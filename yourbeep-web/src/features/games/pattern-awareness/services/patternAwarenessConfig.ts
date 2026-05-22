import { CircleDot, PenLine, Waves } from "lucide-react";
import type { ComponentType } from "react";
import type { PatternAwarenessExerciseDefinition } from "../types";
import type { PatternAwarenessExerciseKey } from "@store/slices/games";

export const patternAwarenessExercises: PatternAwarenessExerciseDefinition[] = [
  {
    key: "draw_your_breath",
    title: "Draw Your Breath",
    durationLabel: "5 mins",
    prompt: "Map your inhale and exhale as one continuous rhythm.",
    accent: "#0f5468",
  },
  {
    key: "awareness_circles",
    title: "Awareness Circles",
    durationLabel: "3 mins",
    prompt: "Follow the breath by tracing circles with calm intention.",
    accent: "#5b7c66",
  },
  {
    key: "scribble_drawing",
    title: "Scribble Drawing",
    durationLabel: "5 mins",
    prompt: "Let your breath create a free-form mark without overthinking.",
    accent: "#70757b",
  },
];

export const exerciseIconMap: Record<
  PatternAwarenessExerciseKey,
  ComponentType<{ className?: string }>
> = {
  draw_your_breath: Waves,
  awareness_circles: CircleDot,
  scribble_drawing: PenLine,
};

export const patternInsightCards = [
  {
    title: "Spatial awareness",
    tone: "stable",
    subtitle:
      "Broader page use often suggests outward perception and stronger environmental contact.",
  },
  {
    title: "Rhythm",
    tone: "fluid",
    subtitle:
      "Wave consistency and repeat intervals can reveal pacing, regulation, and respiratory continuity.",
  },
  {
    title: "Density",
    tone: "spiral",
    subtitle:
      "Tighter repetitions versus open marks help indicate pressure, boldness, and energetic load.",
  },
  {
    title: "Attention",
    tone: "expansive",
    subtitle:
      "Duration and pen lift count help estimate steadiness, presence, and continuity of focus.",
  },
  {
    title: "Adaptability",
    tone: "signal",
    subtitle:
      "Pattern shifts show how comfortably motion changes while maintaining a coherent structure.",
  },
] as const;
