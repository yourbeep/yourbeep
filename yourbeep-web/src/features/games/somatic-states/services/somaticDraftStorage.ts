import type { SomaticRegionKey } from "./somaticConfig";

export type SomaticActivityStatus = "pending" | "completed" | "skipped";

export type SomaticActivityRuntimeState = {
  durationSeconds: number;
  status: SomaticActivityStatus;
};

export type SomaticDraft = {
  region: SomaticRegionKey | null;
  sensation: string;
  activityState: Record<string, SomaticActivityRuntimeState>;
  updatedAt: number;
};

const buildKey = (courseId: string, gameId: string) =>
  `yourbeep:somatic-draft:${courseId}:${gameId}`;

export const readSomaticDraft = (
  courseId: string,
  gameId: string,
): SomaticDraft | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(buildKey(courseId, gameId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SomaticDraft;
    if (!parsed || typeof parsed !== "object") return null;

    return {
      region: parsed.region ?? null,
      sensation: parsed.sensation ?? "",
      activityState: parsed.activityState ?? {},
      updatedAt: Number(parsed.updatedAt || Date.now()),
    };
  } catch {
    return null;
  }
};

export const writeSomaticDraft = (
  courseId: string,
  gameId: string,
  draft: Omit<SomaticDraft, "updatedAt">,
) => {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(
    buildKey(courseId, gameId),
    JSON.stringify({
      ...draft,
      updatedAt: Date.now(),
    } satisfies SomaticDraft),
  );
};

export const updateSomaticDraftActivity = (
  courseId: string,
  gameId: string,
  activityKey: string,
  nextState: SomaticActivityRuntimeState,
) => {
  const draft = readSomaticDraft(courseId, gameId);
  if (!draft) return;

  writeSomaticDraft(courseId, gameId, {
    region: draft.region,
    sensation: draft.sensation,
    activityState: {
      ...draft.activityState,
      [activityKey]: nextState,
    },
  });
};

export const clearSomaticDraft = (courseId: string, gameId: string) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(buildKey(courseId, gameId));
};
