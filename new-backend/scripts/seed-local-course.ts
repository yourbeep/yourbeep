import mongoose, { Schema } from "mongoose";
import { env } from "../packages/shared/src/env";

const FIXTURES = {
  courseId: new mongoose.Types.ObjectId("6819c2a0f4a1b0a100000002"),
  section: {
    key: "core_practices",
    title: "Core Practices",
    description: "Foundational guided practices for the full course journey.",
    order: 1,
  },
} as const;

const identityUserSchema = new Schema({}, { strict: false });
const contentGameSchema = new Schema({}, { strict: false });
const contentCourseSchema = new Schema({}, { strict: false });
const contentItemSchema = new Schema({}, { strict: false });
const commercePurchaseSchema = new Schema({}, { strict: false });

async function createConnection(uri: string) {
  return mongoose.createConnection(uri).asPromise();
}

async function run() {
  const [identityDb, contentDb, commerceDb] = await Promise.all([
    createConnection(env.MONGODB_URI_IDENTITY),
    createConnection(env.MONGODB_URI_CONTENT),
    createConnection(env.MONGODB_URI_COMMERCE),
  ]);

  try {
    const User = identityDb.model("SeedUser", identityUserSchema, "users");
    const Game = contentDb.model("SeedGame", contentGameSchema, "games");
    const Course = contentDb.model("SeedCourse", contentCourseSchema, "courses");
    const ContentItem = contentDb.model("SeedContentItem", contentItemSchema, "contentitems");
    const CoursePurchase = commerceDb.model(
      "SeedCoursePurchase",
      commercePurchaseSchema,
      "coursepurchases",
    );

    const targetEmail = process.env.LOCAL_USER_EMAIL?.trim().toLowerCase();
    const user = targetEmail
      ? await User.findOne({ email: targetEmail, isActive: true })
      : await User.findOne({ isActive: true }).sort({ createdAt: 1 });

    if (!user) {
      throw new Error(
        targetEmail
          ? `No active user found for LOCAL_USER_EMAIL=${targetEmail}`
          : "No active user found in identity.users",
      );
    }

    const games = [
      {
        key: "awareness_states",
        title: "Awareness States",
        description: "Identify your current emotional energy",
        internalScoreRange: { min: 1, max: 3 },
        isActive: true,
      },
      {
        key: "somatic_states",
        title: "Somatic States",
        description: "Map your current somatic sensations",
        internalScoreRange: { min: 1, max: 3 },
        isActive: true,
      },
      {
        key: "pattern_awareness",
        title: "Pattern Awareness",
        description: "Connect behaviors to nervous system cues",
        internalScoreRange: { min: 1, max: 3 },
        isActive: true,
      },
      {
        key: "reflect_act",
        title: "Reflect & Act",
        description: "Insights into psychosomatic synthesis",
        internalScoreRange: { min: 1, max: 3 },
        isActive: true,
      },
    ];

    for (const game of games) {
      await Game.updateOne({ key: game.key }, { $set: game }, { upsert: true });
    }

    const seededGames = await Game.find({
      key: { $in: games.map((game) => game.key) },
      isActive: true,
    }).lean();

    const gameIdByKey = new Map(seededGames.map((game) => [String(game.key), game._id]));

    await Course.updateOne(
      { _id: FIXTURES.courseId },
      {
        $set: {
          title: "Behavioural Signal Intelligence",
          subtitle: "Local Development Course",
          description:
            "Begin a mindful journey to harmonize your somatic sensations with emotional clarity.",
          shortDescription: "Identify your current emotional energy",
          durationMinutes: 120,
          games: [
            { gameId: gameIdByKey.get("awareness_states"), weight: 30 },
            { gameId: gameIdByKey.get("somatic_states"), weight: 25 },
            { gameId: gameIdByKey.get("pattern_awareness"), weight: 25 },
            { gameId: gameIdByKey.get("reflect_act"), weight: 20 },
          ],
          sections: [FIXTURES.section],
          isSeeded: true,
          isActive: true,
          isPublished: true,
          createdBy: user._id,
        },
      },
      { upsert: true },
    );

    const contentItems = [
      {
        courseId: FIXTURES.courseId,
        type: "game",
        refId: gameIdByKey.get("awareness_states"),
        sectionKey: FIXTURES.section.key,
        order: 1,
        title: "Awareness States",
        description: "Identify your current emotional energy",
        durationMinutes: 10,
        isFree: false,
        isActive: true,
      },
      {
        courseId: FIXTURES.courseId,
        type: "game",
        refId: gameIdByKey.get("somatic_states"),
        sectionKey: FIXTURES.section.key,
        order: 2,
        title: "Somatic States",
        description: "Map your current somatic sensations",
        durationMinutes: 10,
        isFree: false,
        isActive: true,
      },
      {
        courseId: FIXTURES.courseId,
        type: "game",
        refId: gameIdByKey.get("pattern_awareness"),
        sectionKey: FIXTURES.section.key,
        order: 3,
        title: "Pattern Awareness",
        description: "Connect behaviors to nervous system cues",
        durationMinutes: 10,
        isFree: false,
        isActive: true,
      },
      {
        courseId: FIXTURES.courseId,
        type: "game",
        refId: gameIdByKey.get("reflect_act"),
        sectionKey: FIXTURES.section.key,
        order: 4,
        title: "Reflect & Act",
        description: "Insights into psychosomatic synthesis",
        durationMinutes: 10,
        isFree: false,
        isActive: true,
      },
    ];

    for (const item of contentItems) {
      await ContentItem.updateOne(
        { courseId: item.courseId, sectionKey: item.sectionKey, order: item.order },
        { $set: item },
        { upsert: true },
      );
    }

    await CoursePurchase.updateOne(
      { userId: user._id, courseId: FIXTURES.courseId },
      {
        $set: {
          userId: user._id,
          courseId: FIXTURES.courseId,
          planType: "annual",
          status: "active",
          region: "IN",
          currency: "INR",
          originalAmount: 999,
          discountAmount: 0,
          amountPaid: 999,
          stripePriceId: "price_local_annual",
          stripeSessionId: `local_seed_${String(user._id)}`,
          detectedRegionIp: "IN",
          regionMismatch: false,
          accessGranted: true,
          startDate: new Date(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          purchasedAt: new Date(),
        },
      },
      { upsert: true },
    );

    console.log(
      JSON.stringify(
        {
          ok: true,
          userId: String(user._id),
          email: user.email,
          courseId: String(FIXTURES.courseId),
          gamesSeeded: seededGames.length,
          contentItemsSeeded: contentItems.length,
          purchaseGranted: true,
        },
        null,
        2,
      ),
    );
  } finally {
    await Promise.all([identityDb.close(), contentDb.close(), commerceDb.close()]);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
