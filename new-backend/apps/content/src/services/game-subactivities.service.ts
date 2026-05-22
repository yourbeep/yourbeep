import { getActivityDetail, listSomaticActivityDetails } from "./game-engine.service";

export type GameSubActivityDefinition = {
  key: string;
  label: string;
  description: string;
};

const awarenessSubActivities: GameSubActivityDefinition[] = [
  {
    key: "mapping_life_domains",
    label: "Mapping Your Life Domains",
    description: "Choose two resourced domains and two strained domains to anchor the awareness work in real life.",
  },
  {
    key: "daily_activation",
    label: "Daily Activation",
    description: "Map the immediate activation pattern that best matches the body's current mobilization.",
  },
  {
    key: "expansion_check",
    label: "Expansion Check",
    description: "Notice how the system opens, contracts, or protects once the first activation begins to move.",
  },
];

const patternSubActivities: GameSubActivityDefinition[] = [
  {
    key: "draw_your_breath",
    label: "Draw Your Breath",
    description: "Trace your breath rhythm to reveal spacing, pacing, and internal control tendencies.",
  },
  {
    key: "awareness_circles",
    label: "Awareness Circles",
    description: "Map the quality of circular attention, openness, and closure in the current state.",
  },
  {
    key: "scribble_drawing",
    label: "Scribble Drawing",
    description: "Capture spontaneous line movement to reveal directional shifts and pattern organization.",
  },
];

const somaticSubActivities: GameSubActivityDefinition[] = listSomaticActivityDetails().map((activity) => ({
  key: activity.activityKey,
  label: activity.title,
  description: activity.subtitle,
}));

const gameSubActivityCatalog: Record<string, GameSubActivityDefinition[]> = {
  awareness_states: awarenessSubActivities,
  somatic_states: somaticSubActivities,
  pattern_awareness: patternSubActivities,
  reflect_act: [],
};

export const getGameSubActivities = (gameKey: string) => gameSubActivityCatalog[gameKey] ?? [];

export const getGameSubActivity = (gameKey: string, subActivityKey: string) =>
  getGameSubActivities(gameKey).find((item) => item.key === subActivityKey) ?? null;

export const ensureValidGameSubActivity = (gameKey: string, subActivityKey: string) => {
  const subActivity = getGameSubActivity(gameKey, subActivityKey);
  if (!subActivity) {
    throw new Error(`Unsupported sub activity ${subActivityKey} for ${gameKey}`);
  }

  if (gameKey === "somatic_states") {
    getActivityDetail(subActivityKey);
  }

  return subActivity;
};
