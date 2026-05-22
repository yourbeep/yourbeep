import type { GameSubmissionPayload } from "../../services/gameExperienceTypes";
import type {
  SomaticActivityRuntimeState,
  SomaticActivityStatus,
} from "./somaticDraftStorage";
import { getSomaticScreenDefinition } from "./somaticScreenRegistry";
import { humanizeKey } from "./somaticConfig";

type BuildSomaticSubmissionPayloadArgs = {
  courseId: string;
  region: string;
  sensation: string;
  activityKeys: string[];
  activityState: Record<string, SomaticActivityRuntimeState>;
};

export const buildSomaticSubmissionPayload = ({
  courseId,
  region,
  sensation,
  activityKeys,
  activityState,
}: BuildSomaticSubmissionPayloadArgs): GameSubmissionPayload => ({
  type: "somatic_states",
  courseId,
  payload: {
    regions: [
      {
        region,
        sensation,
        activities: activityKeys.map((activityKey) => {
          const screen = getSomaticScreenDefinition(activityKey);
          const runtime = activityState[activityKey] ?? {
            durationSeconds: 60,
            status: "pending" as SomaticActivityStatus,
          };
          const skipped = runtime.status === "skipped";

          return {
            activityKey,
            completed: runtime.status === "completed",
            skipped,
            durationSeconds: runtime.durationSeconds,
            response: {
              note: skipped
                ? `${screen?.title ?? humanizeKey(activityKey)} was skipped in the somatic pathway.`
                : `${screen?.title ?? humanizeKey(activityKey)} was practiced through the interactive somatic flow.`,
            },
          };
        }),
      },
    ],
  },
});
