import mongoose from "mongoose";
import { env } from "../packages/shared/src/env";
import { GameModel } from "../apps/content/src/models/game";

const FOUR_GAMES = [
  {
    key: "awareness_states",
    title: "Awareness States",
    description:
      "Energy orientation and flow stability through activation and expansion grid selections.",
  },
  {
    key: "somatic_states",
    title: "Somatic States",
    description:
      "Body-region sensation mapping with ordered awareness tests and physical exercises.",
  },
  {
    key: "pattern_awareness",
    title: "Pattern Awareness",
    description:
      "Drawing and movement exercises assessing presence, action, and pattern scores.",
  },
  {
    key: "reflect_act",
    title: "Reflect & Act",
    description:
      "Synthesises the three preceding games into a final action recommendation.",
  },
] as const;

const run = async () => {
  await mongoose.connect(env.MONGODB_URI_CONTENT);

  try {
    for (const game of FOUR_GAMES) {
      await GameModel.updateOne(
        { key: game.key },
        {
          $set: {
            title: game.title,
            description: game.description,
            internalScoreRange: { min: 1, max: 3 },
            isActive: true,
          },
        },
        { upsert: true },
      );
    }

    const seededGames = await GameModel.find({
      key: { $in: FOUR_GAMES.map((game) => game.key) },
    })
      .sort({ key: 1 })
      .lean();

    console.log("Seeded four games successfully:");
    for (const game of seededGames) {
      console.log(`- ${game.key}: ${game.title} (${game._id})`);
    }
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error("Failed to seed four games.");
  console.error(error);
  process.exitCode = 1;
});
