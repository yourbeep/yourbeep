import assert from "node:assert/strict";
import mongoose, { Schema, type Connection } from "mongoose";
import { env } from "../packages/shared/src/env";

const FIXTURES = {
  userId: new mongoose.Types.ObjectId("6819c2a0f4a1b0a100000001"),
  firebaseUid: "verify-games-firebase-uid",
  email: "verify-games@example.com",
  courseId: new mongoose.Types.ObjectId("6819c2a0f4a1b0a100000002"),
  gameIds: {
    awareness_states: new mongoose.Types.ObjectId("6819c2a0f4a1b0a100000011"),
    somatic_states: new mongoose.Types.ObjectId("6819c2a0f4a1b0a100000012"),
    pattern_awareness: new mongoose.Types.ObjectId("6819c2a0f4a1b0a100000013"),
    reflect_act: new mongoose.Types.ObjectId("6819c2a0f4a1b0a100000014"),
  },
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForService = async (url: string, label: string) => {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      await fetch(url);
      return;
    } catch {
      if (attempt === 30) {
        throw new Error(`${label} did not become reachable at ${url}`);
      }
      await wait(1000);
    }
  }
};

const createConnection = async (uri: string) => mongoose.createConnection(uri).asPromise();

const makeHeaders = () => ({
  "content-type": "application/json",
  "x-user-id": FIXTURES.userId.toString(),
  "x-user-email": FIXTURES.email,
  "x-user-role": "user",
  "x-firebase-uid": FIXTURES.firebaseUid,
});

const parseResponse = async (response: Response) => {
  const body = (await response.json()) as Record<string, any>;
  if (!response.ok || body.success === false) {
    throw new Error(`Request failed (${response.status}): ${JSON.stringify(body, null, 2)}`);
  }
  return body;
};

const identityUserSchema = new Schema({}, { strict: false });
const contentGameSchema = new Schema({}, { strict: false });
const contentCourseSchema = new Schema({}, { strict: false });
const commercePurchaseSchema = new Schema({}, { strict: false });
const submissionSchema = new Schema({}, { strict: false });

const setupFixtures = async () => {
  const [identityDb, contentDb, commerceDb] = await Promise.all([
    createConnection(env.MONGODB_URI_IDENTITY),
    createConnection(env.MONGODB_URI_CONTENT),
    createConnection(env.MONGODB_URI_COMMERCE),
  ]);

  try {
    const User = identityDb.model("User", identityUserSchema, "users");
    const Game = contentDb.model("Game", contentGameSchema, "games");
    const Course = contentDb.model("Course", contentCourseSchema, "courses");
    const Submission = contentDb.model("Submission", submissionSchema, "submissions");
    const CoursePurchase = commerceDb.model(
      "CoursePurchase",
      commercePurchaseSchema,
      "coursepurchases",
    );

    await Promise.all([
      Submission.deleteMany({ userId: FIXTURES.userId, courseId: FIXTURES.courseId }),
      CoursePurchase.deleteMany({ userId: FIXTURES.userId, courseId: FIXTURES.courseId }),
    ]);

    await User.updateOne(
      { _id: FIXTURES.userId },
      {
        $set: {
          firebaseUid: FIXTURES.firebaseUid,
          name: "Verify Games User",
          email: FIXTURES.email,
          timezone: "Asia/Calcutta",
          role: "user",
          userLevel: 1,
          points: 0,
          streakDays: 0,
          badges: [],
          fcmTokens: [],
          isActive: true,
          lastActiveAt: new Date(),
        },
      },
      { upsert: true },
    );

    const games = [
      {
        _id: FIXTURES.gameIds.awareness_states,
        key: "awareness_states",
        title: "Awareness States",
        description: "Energy orientation and flow stability",
        internalScoreRange: { min: 1, max: 3 },
        isActive: true,
      },
      {
        _id: FIXTURES.gameIds.somatic_states,
        key: "somatic_states",
        title: "Somatic States",
        description: "Body-region sensation mapping",
        internalScoreRange: { min: 1, max: 3 },
        isActive: true,
      },
      {
        _id: FIXTURES.gameIds.pattern_awareness,
        key: "pattern_awareness",
        title: "Pattern Awareness",
        description: "Drawing and movement exercise scoring",
        internalScoreRange: { min: 1, max: 3 },
        isActive: true,
      },
      {
        _id: FIXTURES.gameIds.reflect_act,
        key: "reflect_act",
        title: "Reflect & Act",
        description: "Synthesises the previous three games",
        internalScoreRange: { min: 1, max: 3 },
        isActive: true,
      },
    ];

    for (const game of games) {
      await Game.updateOne({ _id: game._id }, { $set: game }, { upsert: true });
    }

    await Course.updateOne(
      { _id: FIXTURES.courseId },
      {
        $set: {
          title: "Behavioural Signal Intelligence",
          subtitle: "Verification Course",
          description: "Begin a mindful journey to harmonize your somatic sensations with emotional clarity.",
          shortDescription: "Verification course",
          games: [
            { gameId: FIXTURES.gameIds.awareness_states, weight: 30 },
            { gameId: FIXTURES.gameIds.somatic_states, weight: 25 },
            { gameId: FIXTURES.gameIds.pattern_awareness, weight: 25 },
            { gameId: FIXTURES.gameIds.reflect_act, weight: 20 },
          ],
          contentItems: [],
          durationMinutes: 120,
          isSeeded: true,
          isActive: true,
          isPublished: true,
          createdBy: FIXTURES.userId,
        },
      },
      { upsert: true },
    );

    await CoursePurchase.create({
      userId: FIXTURES.userId,
      courseId: FIXTURES.courseId,
      planType: "annual",
      status: "active",
      region: "IN",
      currency: "INR",
      amountPaid: 999,
      stripePriceId: "price_verify_annual",
      stripeSessionId: `verify_session_${Date.now()}`,
      detectedRegionIp: "IN",
      regionMismatch: false,
      accessGranted: true,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      purchasedAt: new Date(),
    });
  } finally {
    await Promise.all([identityDb.close(), contentDb.close(), commerceDb.close()]);
  }
};

const submit = async (gameId: string, payload: Record<string, unknown>) => {
  const response = await fetch(`${env.CONTENT_URL}/games/${gameId}/submit`, {
    method: "POST",
    headers: makeHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

const getResult = async (gameId: string) => {
  const response = await fetch(`${env.CONTENT_URL}/games/${gameId}/result`, {
    method: "GET",
    headers: makeHeaders(),
  });
  return parseResponse(response);
};

const getCourseSubmissions = async () => {
  const response = await fetch(`${env.CONTENT_URL}/courses/${FIXTURES.courseId.toString()}/submissions`, {
    method: "GET",
    headers: makeHeaders(),
  });
  return parseResponse(response);
};

const run = async () => {
  await Promise.all([
    waitForService(env.IDENTITY_URL, "identity"),
    waitForService(env.CONTENT_URL, "content"),
    waitForService(env.COMMERCE_URL, "commerce"),
  ]);

  await setupFixtures();

  const awarenessStep1 = await submit(FIXTURES.gameIds.awareness_states.toString(), {
    type: "awareness_states",
    courseId: FIXTURES.courseId.toString(),
    step: 1,
    payload: {
      activationSelections: ["alert_nervous", "calm_steady"],
    },
  });
  assert.equal(
    awarenessStep1.data.submission.resultData.resultMapping.energyOrientation.label,
    "Activation",
  );

  const awarenessStep2 = await submit(FIXTURES.gameIds.awareness_states.toString(), {
    type: "awareness_states",
    courseId: FIXTURES.courseId.toString(),
    step: 2,
    payload: {
      activationSelections: ["alert_nervous", "calm_steady"],
      expansionSelections: ["protection_resistance", "joy_abundance"],
    },
  });
  assert.equal(
    awarenessStep2.data.submission.resultData.resultMapping.flowStability.label,
    "Waver",
  );

  const awarenessFinal = await submit(FIXTURES.gameIds.awareness_states.toString(), {
    type: "awareness_states",
    courseId: FIXTURES.courseId.toString(),
    step: 3,
    payload: {
      activationSelections: ["alert_nervous", "calm_steady"],
      expansionSelections: ["protection_resistance", "joy_abundance"],
      valueSystems: {
        highPoints: ["work", "personal_development"],
        lowPoints: ["finances", "family"],
      },
      rootCauses: {
        work: "learned_emotional_strategy",
        personal_development: "unmet_need",
        finances: "recurring_environmental_stressor",
        family: "protective_belief_or_meaning",
      },
    },
  });
  assert.equal(awarenessFinal.data.submission.isComplete, true);
  assert.ok(awarenessFinal.data.submission.resultData.summary);

  const somatic = await submit(FIXTURES.gameIds.somatic_states.toString(), {
    type: "somatic_states",
    courseId: FIXTURES.courseId.toString(),
    payload: {
      regions: [
        {
          region: "head",
          sensation: "bright_clear_focus",
          activities: [
            { activityKey: "60_second_cognitive_check", completed: true, skipped: false, durationSeconds: 60 },
            { activityKey: "expand_the_window", completed: true, skipped: false, durationSeconds: 300 },
          ],
        },
        {
          region: "face_throat",
          sensation: "subtle_tension",
          activities: [
            { activityKey: "clench_detection_drill", completed: true, skipped: false },
            { activityKey: "jaw_awareness_reset", completed: false, skipped: true },
            { activityKey: "throat_openness_check", completed: true, skipped: false },
            { activityKey: "belly_breathing", completed: true, skipped: false, durationSeconds: 180 },
            { activityKey: "neck_release_awareness", completed: true, skipped: false },
            { activityKey: "shoulder_drop", completed: true, skipped: false },
          ],
        },
      ],
    },
  });
  assert.ok(Array.isArray(somatic.data.submission.resultData.regions));

  const pattern = await submit(FIXTURES.gameIds.pattern_awareness.toString(), {
    type: "pattern_awareness",
    courseId: FIXTURES.courseId.toString(),
    payload: {
      exercises: [
        {
          exerciseKey: "draw_your_breath",
          durationSeconds: 245,
          metrics: {
            penLiftCount: 3,
            totalLength: 820,
            spatialCoverage: 0.72,
            controlLimitSpacing: "medium",
            intervalPattern: "narrow_to_wide",
          },
        },
        {
          exerciseKey: "awareness_circles",
          durationSeconds: 180,
          metrics: {
            penLiftCount: 1,
            circleCompleteness: 0.85,
            spatialCoverage: 0.61,
            circlePattern: "scattered",
          },
        },
        {
          exerciseKey: "scribble_drawing",
          durationSeconds: 300,
          metrics: {
            penLiftCount: 5,
            lineSpacing: "wide",
            spatialCoverage: 0.8,
            directionPattern: "defined_spatial",
          },
        },
      ],
    },
  });
  assert.ok(typeof pattern.data.submission.resultData.presenceScore === "number");
  assert.ok(typeof pattern.data.submission.resultData.actionScore === "number");
  assert.ok(typeof pattern.data.submission.resultData.patternScore === "number");

  const reflectPreview = await getResult(FIXTURES.gameIds.reflect_act.toString());
  assert.ok(reflectPreview.data.sections);
  assert.ok(reflectPreview.data.totals);

  const reflect = await submit(FIXTURES.gameIds.reflect_act.toString(), {
    type: "reflect_act",
    courseId: FIXTURES.courseId.toString(),
    payload: {
      userReflectionNotes: "Verification run",
      acknowledgedAction: "remediation",
    },
  });
  assert.equal(reflect.data.submission.isComplete, true);
  assert.ok(reflect.data.submission.finalCourseScore);

  const awarenessResult = await getResult(FIXTURES.gameIds.awareness_states.toString());
  const somaticResult = await getResult(FIXTURES.gameIds.somatic_states.toString());
  const patternResult = await getResult(FIXTURES.gameIds.pattern_awareness.toString());
  const reflectResult = await getResult(FIXTURES.gameIds.reflect_act.toString());
  const courseSubmissions = await getCourseSubmissions();

  const summary = {
    awareness: awarenessResult.data,
    somatic: somaticResult.data,
    pattern: patternResult.data,
    reflect: reflectResult.data,
    finalCourseScore: courseSubmissions.data.finalCourseScore,
    submissionCount: courseSubmissions.data.submissions.length,
  };

  console.log(JSON.stringify(summary, null, 2));
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
