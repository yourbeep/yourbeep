export type GameSubActivityOption = {
  value: string;
  label: string;
  description: string;
};

const awarenessSubActivities: GameSubActivityOption[] = [
  {
    value: "mapping_life_domains",
    label: "Mapping Your Life Domains",
    description: "Choose two high-resource and two low-resource life domains.",
  },
  {
    value: "daily_activation",
    label: "Daily Activation",
    description: "Map the activation pattern that best matches the body right now.",
  },
  {
    value: "expansion_check",
    label: "Expansion Check",
    description: "Notice how the system opens, contracts, or protects once activation begins to move.",
  },
];

const patternSubActivities: GameSubActivityOption[] = [
  {
    value: "draw_your_breath",
    label: "Draw Your Breath",
    description: "Trace the rhythm of the breath through the drawing exercise.",
  },
  {
    value: "awareness_circles",
    label: "Awareness Circles",
    description: "Map awareness through circular pattern making.",
  },
  {
    value: "scribble_drawing",
    label: "Scribble Drawing",
    description: "Use free-line movement to reveal pattern organization.",
  },
];

const gameSubActivities: Record<string, GameSubActivityOption[]> = {
  awareness_states: awarenessSubActivities,
  pattern_awareness: patternSubActivities,
};

export const getGameSubActivityOptions = (gameKey?: string | null) =>
  (gameKey ? gameSubActivities[gameKey] : null) ?? [];

export const isAwarenessSubActivity = (
  value?: string | null,
): value is "mapping_life_domains" | "daily_activation" | "expansion_check" =>
  awarenessSubActivities.some((item) => item.value === value);

export const isPatternSubActivity = (
  value?: string | null,
): value is "draw_your_breath" | "awareness_circles" | "scribble_drawing" =>
  patternSubActivities.some((item) => item.value === value);
