import type { ActivityLogDocument } from "../models/activity-log";

const GAME_SUBMISSION_XP = 120;
const COURSE_PROGRESS_XP = 35;
const VIDEO_WATCH_XP_PER_MINUTE = 1;
const LEVEL_XP_STEP = 500;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getNumericMetadata = (metadata: Record<string, unknown> | undefined, key: string) => {
  const value = metadata?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
};

export const getXpAwardForActivity = (entry: Pick<ActivityLogDocument, "type" | "metadata">) => {
  if (entry.type === "game_submission") {
    return GAME_SUBMISSION_XP;
  }

  if (entry.type === "course_progress") {
    return COURSE_PROGRESS_XP;
  }

  const watchedSeconds = getNumericMetadata(entry.metadata, "watchedSeconds");
  if (watchedSeconds <= 0) {
    return 0;
  }

  return Math.max(1, Math.round((watchedSeconds / 60) * VIDEO_WATCH_XP_PER_MINUTE));
};

export const getTotalXpFromLogs = (entries: Array<Pick<ActivityLogDocument, "type" | "metadata">>) =>
  entries.reduce((sum, entry) => sum + getXpAwardForActivity(entry), 0);

export const getLevelFromXp = (totalXp: number) => Math.max(1, Math.floor(totalXp / LEVEL_XP_STEP) + 1);

export const getProgressionSnapshot = (totalXp: number, trendScoreDelta: number) => {
  const safeXp = Math.max(0, Math.round(totalXp));
  const level = getLevelFromXp(safeXp);
  const currentLevelBaseXp = (level - 1) * LEVEL_XP_STEP;
  const nextLevelBaseXp = level * LEVEL_XP_STEP;
  const currentXp = safeXp - currentLevelBaseXp;
  const nextLevelXp = nextLevelBaseXp - currentLevelBaseXp;
  const progressPercentage = clamp(Math.round((currentXp / nextLevelXp) * 100), 0, 100);

  return {
    level,
    totalXp: safeXp,
    currentXp,
    nextLevelXp,
    progressPercentage,
    stateTrend: trendScoreDelta > 0.05 ? "improving" : trendScoreDelta < -0.05 ? "declining" : "steady",
    stateDirection: trendScoreDelta > 0.05 ? "up" : trendScoreDelta < -0.05 ? "down" : "flat",
  };
};

