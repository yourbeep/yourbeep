import { AppError, env, httpJson } from "@yourbeep/shared";
import { Types } from "mongoose";
import { CourseModel } from "../models/course";
import { GameModel } from "../models/game";
import { SubmissionModel } from "../models/submission";
import type { z } from "zod";
import { submitGameSchema } from "../validators";
import {
  buildAwarenessResultMapping,
  getActivityDetail,
  getAwarenessScoreLabel,
  getPatternScoreLabel,
  getSomaticScoreLabel,
  getSomaticSequence,
} from "./game-engine.service";
import { ensureValidGameSubActivity } from "./game-subactivities.service";

type SubmissionInput = z.infer<typeof submitGameSchema>;
type SubmissionType = SubmissionInput["type"];
type ComputedSubmissionResult = {
  score: number;
  isComplete: boolean;
  resultData: Record<string, unknown>;
};

type PatternMetrics = Record<string, unknown>;
type PatternCriterionScore = 1 | 2 | 3;
type PatternExerciseScoring = {
  breaksScore: PatternCriterionScore;
  durationScore: PatternCriterionScore;
  variabilityScore: PatternCriterionScore;
  boldnessScore: PatternCriterionScore;
  visionScore: PatternCriterionScore;
  patternScore: PatternCriterionScore;
  overlapCrowdingScore: PatternCriterionScore;
  isolatedMarksScore: PatternCriterionScore;
  directionalShiftScore: PatternCriterionScore;
  stabilityScore: PatternCriterionScore;
  densityBehaviorScore: PatternCriterionScore;
  diagnostics: Record<string, unknown>;
};

type PatternExerciseInput = Extract<
  SubmissionInput,
  { type: "pattern_awareness" }
>["payload"]["exercises"][number];
type PatternPayload = Extract<SubmissionInput, { type: "pattern_awareness" }>["payload"];

const requiredPatternExerciseKeys = [
  "draw_your_breath",
  "awareness_circles",
  "scribble_drawing",
] as const;

const activityHeaders = () => ({
  "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
});

const average = (values: number[]) =>
  values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 1;

const round = (value: number) => Number(value.toFixed(2));
const clampPatternScore = (value: number): PatternCriterionScore =>
  Math.max(1, Math.min(3, Math.round(value))) as PatternCriterionScore;
const numberMetric = (metrics: PatternMetrics, key: string, fallback = 0) =>
  typeof metrics[key] === "number" ? Number(metrics[key]) : fallback;
const stringMetric = (metrics: PatternMetrics, key: string, fallback = "") =>
  typeof metrics[key] === "string" ? String(metrics[key]) : fallback;
const booleanMetric = (metrics: PatternMetrics, key: string, fallback = false) =>
  typeof metrics[key] === "boolean" ? Boolean(metrics[key]) : fallback;
const scoreFromRatio = (value: number, high: number, medium: number): PatternCriterionScore =>
  value >= high ? 3 : value >= medium ? 2 : 1;
const scoreFromInverseRatio = (value: number, low: number, medium: number): PatternCriterionScore =>
  value <= low ? 3 : value <= medium ? 2 : 1;

const getLatestCompletedSubmissionByType = async (
  userId: string,
  courseId: string,
  type: SubmissionType,
) =>
  SubmissionModel.findOne({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
    type,
    isComplete: true,
  }).sort({ completedAt: -1, createdAt: -1 });

const deriveFinalCourseScore = async (userId: string, courseId: string) => {
  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404, "NOT_FOUND");
  }

  const latestByGame = await Promise.all(
    course.games.map(async (item: { gameId: Types.ObjectId; weight: number }) => {
      const submission = await SubmissionModel.findOne({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        gameId: item.gameId,
        isComplete: true,
      }).sort({ completedAt: -1, createdAt: -1 });

      return submission
        ? {
            gameId: String(item.gameId),
            weight: item.weight,
            score: submission.score,
            weightedScore: round((submission.score * item.weight) / 100),
          }
        : null;
    }),
  );

  if (latestByGame.some((item) => !item)) {
    return null;
  }

  const breakdown = latestByGame.filter((item): item is NonNullable<typeof item> => Boolean(item));
  return {
    breakdown,
    finalScore: round(breakdown.reduce((sum, item) => sum + item.weightedScore, 0)),
    scaleMax: 3,
  };
};

const buildAwarenessSummary = (
  activationResult: ReturnType<typeof buildAwarenessResultMapping>["resultMapping"],
  expansionResult: ReturnType<typeof buildAwarenessResultMapping>["resultMapping"],
  payload: Extract<SubmissionInput, { type: "awareness_states" }>["payload"],
) => ({
  activation: activationResult,
  expansion: expansionResult,
  valueSystems: payload.valueSystems ?? null,
  synthesis: {
    title: "Integrated Awareness Summary",
    description:
      "This summary combines life-domain mapping, activation, and expansion into one reflective awareness snapshot.",
  },
});

const mergeAwarenessPayload = (
  existingPayload: Extract<SubmissionInput, { type: "awareness_states" }>["payload"] | null | undefined,
  incomingPayload: Extract<SubmissionInput, { type: "awareness_states" }>["payload"],
) => ({
  activationSelections: incomingPayload.activationSelections ?? existingPayload?.activationSelections,
  expansionSelections: incomingPayload.expansionSelections ?? existingPayload?.expansionSelections,
  valueSystems: incomingPayload.valueSystems ?? existingPayload?.valueSystems,
});

const computeAwarenessSubmission = (
  step: number,
  payload: Extract<SubmissionInput, { type: "awareness_states" }>["payload"],
  focusedSubActivityKey?: string,
): ComputedSubmissionResult => {
  const activation = payload.activationSelections
    ? buildAwarenessResultMapping(payload.activationSelections)
    : null;
  const expansion = payload.expansionSelections
    ? buildAwarenessResultMapping(payload.expansionSelections)
    : null;

  if (step === 1) {
    return {
      score: 0,
      isComplete: false,
      resultData: {
        valueSystems: payload.valueSystems ?? null,
        step,
        subActivityKey: "mapping_life_domains",
      },
    };
  }

  if (step === 2) {
    if (!activation) {
      throw new AppError("Activation selections are required", 422, "VALIDATION_ERROR");
    }

    return {
      score: activation.score,
      isComplete: false,
      resultData: {
        resultMapping: activation.resultMapping,
        step,
        subActivityKey: "daily_activation",
      },
    };
  }

  if (!activation) {
    if (focusedSubActivityKey === "expansion_check" && expansion) {
      return {
        score: expansion.score,
        isComplete: false,
        resultData: {
          resultMapping: expansion.resultMapping,
          step,
          subActivityKey: "expansion_check",
        },
      };
    }

    throw new AppError("Activation selections are required", 422, "VALIDATION_ERROR");
  }

  if (!expansion) {
    throw new AppError("Expansion selections are required", 422, "VALIDATION_ERROR");
  }

  if (!payload.valueSystems) {
    if (focusedSubActivityKey === "expansion_check") {
      return {
        score: expansion.score,
        isComplete: false,
        resultData: {
          resultMapping: expansion.resultMapping,
          activationResultMapping: activation.resultMapping,
          step,
          subActivityKey: "expansion_check",
        },
      };
    }

    throw new AppError("Life-domain mapping is required", 422, "VALIDATION_ERROR");
  }

  const score = round(average([activation.score, expansion.score]));

  return {
    score,
    isComplete: true,
    resultData: {
      resultMapping: expansion.resultMapping,
      activationResultMapping: activation.resultMapping,
      expansionResultMapping: expansion.resultMapping,
      summary: buildAwarenessSummary(activation.resultMapping, expansion.resultMapping, payload),
      score,
      step,
      subActivityKey: "expansion_check",
    },
  };
};

const computeSomaticSubmission = (
  payload: Extract<SubmissionInput, { type: "somatic_states" }>["payload"],
): ComputedSubmissionResult => {
  const regionResults = payload.regions.map((region) => {
    const expectedSequence = getSomaticSequence(region.region, region.sensation);
    const activityKeys = region.activities.map((activity) => activity.activityKey);

    for (const activityKey of expectedSequence) {
      if (!activityKeys.includes(activityKey)) {
        throw new AppError(
          `Missing required activity ${activityKey} for ${region.region}/${region.sensation}`,
          422,
          "VALIDATION_ERROR",
        );
      }
    }

    const completedCount = region.activities.filter((activity) => activity.completed && !activity.skipped).length;
    const totalActivities = expectedSequence.length;
    const completionRatio = totalActivities === 0 ? 1 : completedCount / totalActivities;
    const regionScore = completionRatio >= 0.8 ? 3 : completionRatio >= 0.45 ? 2 : 1;

    return {
      region: region.region,
      sensation: region.sensation,
      expectedSequence,
      activities: region.activities,
      completedCount,
      totalActivities,
      score: regionScore,
    };
  });

  const overallScore = round(average(regionResults.map((item) => item.score)));

  return {
    score: overallScore,
    isComplete: true,
    resultData: {
      regions: regionResults,
      physiology: {
        score: overallScore,
        label: getSomaticScoreLabel(overallScore),
      },
    },
  };
};

const scorePatternExercise = (
  exercise: PatternExerciseInput,
): PatternExerciseScoring => {
  const metrics = exercise.metrics as PatternMetrics;
  const coverage = numberMetric(metrics, "spatialCoverage", 0);
  const penLiftCount = numberMetric(metrics, "penLiftCount", 0);
  const overlapDensity = numberMetric(metrics, "overlapDensity", 0);
  const densityScoreMetric = numberMetric(metrics, "densityScore", 0);
  const closureRatio = numberMetric(metrics, "closureRatio", 0);
  const circularVariance = numberMetric(metrics, "circularVariance", 1);
  const directionChanges = numberMetric(metrics, "directionChanges", 0);
  const axisDrift = numberMetric(metrics, "axisDrift", 0);
  const averageStep = numberMetric(metrics, "averageStep", 0);
  const strokeCount = numberMetric(metrics, "strokeCount", 0);
  const totalLength = numberMetric(metrics, "totalLength", 0);
  const totalPoints = numberMetric(metrics, "totalPoints", 0);
  const isolatedCircleCount = numberMetric(metrics, "isolatedCircleCount", penLiftCount);
  const traceAvailable = Array.isArray(metrics.trace) && metrics.trace.length > 0;

  const breaksScore: PatternCriterionScore = penLiftCount <= 1 ? 3 : penLiftCount <= 3 ? 2 : 1;
  const durationScore: PatternCriterionScore =
    exercise.durationSeconds >= 240 ? 3 : exercise.durationSeconds >= 120 ? 2 : 1;
  const overlapCrowdingScore = scoreFromInverseRatio(overlapDensity, 0.18, 0.38);
  const isolatedMarksScore = isolatedCircleCount <= 1 ? 3 : isolatedCircleCount <= 3 ? 2 : 1;
  const directionalShiftScore = scoreFromInverseRatio(directionChanges, 8, 18);
  const densityBehaviorScore = scoreFromRatio(densityScoreMetric, 0.72, 0.42);
  const stabilityScore = scoreFromInverseRatio(axisDrift, 0.12, 0.28);

  if (exercise.exerciseKey === "draw_your_breath") {
    const spacing = stringMetric(metrics, "controlLimitSpacing");
    const intervalPattern = stringMetric(metrics, "intervalPattern");
    const variabilityScore: PatternCriterionScore =
      spacing === "wide" ? 3 : spacing === "medium" ? 2 : 1;
    const boldnessScore: PatternCriterionScore =
      intervalPattern === "wide_to_narrow" || intervalPattern === "narrow_to_wide"
        ? 3
        : intervalPattern === "medium"
          ? 2
          : 1;
    const visionScore = coverage > 0.75 ? 3 : coverage > 0.4 ? 2 : 1;
    const patternScore = clampPatternScore(
      average([boldnessScore, visionScore, stabilityScore, densityBehaviorScore]),
    );

    return {
      breaksScore,
      durationScore,
      variabilityScore,
      boldnessScore,
      visionScore,
      patternScore,
      overlapCrowdingScore,
      isolatedMarksScore,
      directionalShiftScore,
      stabilityScore,
      densityBehaviorScore,
      diagnostics: {
        coverage,
        penLiftCount,
        intervalPattern,
        controlLimitSpacing: spacing,
        axisDrift,
        directionChanges,
        averageStep,
        densityScore: densityScoreMetric,
        strokeCount,
        totalLength,
        totalPoints,
        traceAvailable,
      },
    };
  }

  if (exercise.exerciseKey === "awareness_circles") {
    const circleCompleteness = numberMetric(metrics, "circleCompleteness", 0);
    const circlePattern = stringMetric(metrics, "circlePattern");
    const variabilityScore =
      circleCompleteness >= 0.85 ? 3 : circleCompleteness >= 0.55 ? 2 : 1;
    const boldnessScore =
      circlePattern === "expansive"
        ? 3
        : circlePattern === "scattered"
          ? 2
          : 1;
    const visionScore = coverage > 0.75 ? 3 : coverage > 0.4 ? 2 : 1;
    const patternScore = clampPatternScore(
      average([
        circlePattern === "defined_spatial" ? 3 : circlePattern === "scattered" ? 2 : 1,
        overlapCrowdingScore,
        scoreFromRatio(closureRatio, 0.82, 0.55),
        scoreFromInverseRatio(circularVariance, 0.18, 0.34),
      ]),
    );

    return {
      breaksScore,
      durationScore,
      variabilityScore,
      boldnessScore,
      visionScore,
      patternScore,
      overlapCrowdingScore,
      isolatedMarksScore,
      directionalShiftScore,
      stabilityScore,
      densityBehaviorScore,
      diagnostics: {
        coverage,
        penLiftCount,
        circleCompleteness,
        circlePattern,
        closureRatio,
        circularVariance,
        overlapDensity,
        isolatedCircleCount,
        strokeCount,
        totalLength,
        totalPoints,
        traceAvailable,
      },
    };
  }

  const lineSpacing = stringMetric(metrics, "lineSpacing");
  const directionPattern = stringMetric(metrics, "directionPattern");
  const variabilityScore: PatternCriterionScore =
    lineSpacing === "wide" ? 3 : lineSpacing === "medium" ? 2 : 1;
  const boldnessScore: PatternCriterionScore =
    directionPattern === "defined_spatial"
      ? 3
      : directionPattern === "scattered" || directionPattern === "undefined_scattered"
        ? 2
        : 1;
  const visionScore = coverage > 0.75 ? 3 : coverage > 0.4 ? 2 : 1;
  const patternScore = clampPatternScore(
    average([
      directionPattern === "defined_spatial"
        ? 3
        : directionPattern === "scattered" || directionPattern === "undefined_scattered"
          ? 2
          : 1,
      directionalShiftScore,
      densityBehaviorScore,
    ]),
  );

  return {
    breaksScore,
    durationScore,
    variabilityScore,
    boldnessScore,
    visionScore,
    patternScore,
    overlapCrowdingScore,
    isolatedMarksScore,
    directionalShiftScore,
    stabilityScore,
    densityBehaviorScore,
    diagnostics: {
      coverage,
      penLiftCount,
      lineSpacing,
      directionPattern,
      directionChanges,
      axisDrift,
      averageStep,
      densityScore: densityScoreMetric,
      overlapDensity,
      strokeCount,
      totalLength,
      totalPoints,
      traceAvailable,
      denseLinesDetected: booleanMetric(metrics, "denseLinesDetected", densityScoreMetric >= 0.72),
    },
  };
};

const sortPatternExercises = (exercises: PatternExerciseInput[]) => {
  const order = new Map(requiredPatternExerciseKeys.map((key, index) => [key, index]));
  return [...exercises].sort(
    (left, right) => (order.get(left.exerciseKey) ?? 999) - (order.get(right.exerciseKey) ?? 999),
  );
};

const mergePatternPayload = (
  existingPayload: PatternPayload | null | undefined,
  incomingPayload: PatternPayload,
): PatternPayload => {
  const merged = new Map<string, PatternExerciseInput>();

  for (const exercise of existingPayload?.exercises ?? []) {
    merged.set(exercise.exerciseKey, exercise);
  }

  for (const exercise of incomingPayload.exercises) {
    merged.set(exercise.exerciseKey, exercise);
  }

  return {
    exercises: sortPatternExercises([...merged.values()]),
  };
};

const computePatternProgressSubmission = (payload: PatternPayload): ComputedSubmissionResult => {
  const exercises = payload.exercises.map((exercise) => ({
    exerciseKey: exercise.exerciseKey,
    durationSeconds: exercise.durationSeconds,
    metrics: exercise.metrics,
    scores: scorePatternExercise(exercise),
  }));

  const presenceScore = round(
    average(exercises.map((exercise) => average([exercise.scores.breaksScore, exercise.scores.durationScore]))),
  );
  const actionScore = round(
    average(
      exercises.map((exercise) =>
        average([
          exercise.scores.variabilityScore,
          exercise.scores.boldnessScore,
          exercise.scores.visionScore,
        ]),
      ),
    ),
  );
  const patternScore = round(average(exercises.map((exercise) => exercise.scores.patternScore)));
  const progressScore = round(average([presenceScore, actionScore, patternScore]));
  const completedExerciseKeys = exercises.map((exercise) => exercise.exerciseKey);
  const pendingExerciseKeys = requiredPatternExerciseKeys.filter((key) => !completedExerciseKeys.includes(key));

  return {
    score: progressScore,
    isComplete: false,
    resultData: {
      stage: "in_progress",
      exercises,
      progressScore,
      presenceScore,
      actionScore,
      patternScore,
      progress: {
        completedCount: completedExerciseKeys.length,
        totalCount: requiredPatternExerciseKeys.length,
        completedExerciseKeys,
        pendingExerciseKeys,
      },
    },
  };
};

const computePatternSubmission = (payload: PatternPayload): ComputedSubmissionResult => {
  const exercises = payload.exercises.map((exercise) => ({
    exerciseKey: exercise.exerciseKey,
    durationSeconds: exercise.durationSeconds,
    metrics: exercise.metrics,
    scores: scorePatternExercise(exercise),
  }));

  const presenceScore = round(
    average(exercises.map((exercise) => average([exercise.scores.breaksScore, exercise.scores.durationScore]))),
  );
  const actionScore = round(
    average(
      exercises.map((exercise) =>
        average([
          exercise.scores.variabilityScore,
          exercise.scores.boldnessScore,
          exercise.scores.visionScore,
        ]),
      ),
    ),
  );
  const patternScore = round(average(exercises.map((exercise) => exercise.scores.patternScore)));
  const overallScore = round(average([presenceScore, actionScore, patternScore]));
  const criterionBreakdown = {
    presenceAttention: {
      score: presenceScore,
      label: getPatternScoreLabel(presenceScore),
      components: exercises.map((exercise) => ({
        exerciseKey: exercise.exerciseKey,
        breaksScore: exercise.scores.breaksScore,
        durationScore: exercise.scores.durationScore,
        isolatedMarksScore: exercise.scores.isolatedMarksScore,
      })),
    },
    action: {
      score: actionScore,
      label: getPatternScoreLabel(actionScore),
      components: exercises.map((exercise) => ({
        exerciseKey: exercise.exerciseKey,
        variabilityScore: exercise.scores.variabilityScore,
        boldnessScore: exercise.scores.boldnessScore,
        visionScore: exercise.scores.visionScore,
        stabilityScore: exercise.scores.stabilityScore,
        densityBehaviorScore: exercise.scores.densityBehaviorScore,
      })),
    },
    pattern: {
      score: patternScore,
      label: getPatternScoreLabel(patternScore),
      components: exercises.map((exercise) => ({
        exerciseKey: exercise.exerciseKey,
        patternScore: exercise.scores.patternScore,
        overlapCrowdingScore: exercise.scores.overlapCrowdingScore,
        directionalShiftScore: exercise.scores.directionalShiftScore,
      })),
    },
  };

  return {
    score: overallScore,
    isComplete: true,
    resultData: {
      exercises,
      presenceScore,
      actionScore,
      patternScore,
      overallScore,
      criteria: criterionBreakdown,
      labels: {
        presenceAttention: getPatternScoreLabel(presenceScore),
        action: getPatternScoreLabel(actionScore),
        pattern: getPatternScoreLabel(patternScore),
      },
      exerciseDiagnostics: exercises.map((exercise) => ({
        exerciseKey: exercise.exerciseKey,
        durationSeconds: exercise.durationSeconds,
        diagnostics: exercise.scores.diagnostics,
        scoringValues: {
          breaksScore: exercise.scores.breaksScore,
          durationScore: exercise.scores.durationScore,
          variabilityScore: exercise.scores.variabilityScore,
          boldnessScore: exercise.scores.boldnessScore,
          visionScore: exercise.scores.visionScore,
          patternScore: exercise.scores.patternScore,
          overlapCrowdingScore: exercise.scores.overlapCrowdingScore,
          isolatedMarksScore: exercise.scores.isolatedMarksScore,
          directionalShiftScore: exercise.scores.directionalShiftScore,
          stabilityScore: exercise.scores.stabilityScore,
          densityBehaviorScore: exercise.scores.densityBehaviorScore,
        },
      })),
      adminReviewSummary: {
        tracePayloadAvailableFor: exercises
          .filter((exercise) => Boolean(exercise.scores.diagnostics.traceAvailable))
          .map((exercise) => exercise.exerciseKey),
        telemetryFields: [
          "trace",
          "strokeCount",
          "totalLength",
          "directionChanges",
          "overlapDensity",
          "densityScore",
          "closureRatio",
          "circularVariance",
          "axisDrift",
          "bounds",
          "canvas",
        ],
      },
    },
  };
};

const resolveReflectAction = (scores: {
  emotionalState: number;
  physiology: number;
  presenceAttention: number;
  action: number;
  pattern: number;
}) => {
  const values = Object.values(scores);
  const totalScore = values.reduce((sum, value) => sum + value, 0);
  const cumulative = values.reduce((sum, value) => sum + (value - 2), 0);

  if ((totalScore >= 13 || cumulative >= 3) && scores.emotionalState >= 3 && scores.action >= 3) {
    return {
      recommendedAction: "transfer",
      actionDescription: "Total score is 13 or above with strong functional application, indicating transfer focus.",
    };
  }

  if (totalScore >= 13 || cumulative >= 3) {
    return {
      recommendedAction: "acceptance",
      actionDescription: "Total score is 13 or above with mostly stable scores, indicating acceptance focus.",
    };
  }

  if (totalScore <= 7 || cumulative <= -3) {
    return {
      recommendedAction: "redesign",
      actionDescription: "Total score is 7 or below indicating redesign focus.",
    };
  }

  if (totalScore >= 8 && totalScore <= 12 && cumulative >= -2 && cumulative <= 1) {
    return {
      recommendedAction: "remediation",
      actionDescription: "Total score is between 8-12 indicating moderate remediation focus.",
    };
  }

  return {
    recommendedAction: "no_action",
    actionDescription: "No action is recommended until more signal is available.",
  };
};

const computeReflectSubmission = async (
  userId: string,
  courseId: string,
  payload: Extract<SubmissionInput, { type: "reflect_act" }>["payload"],
): Promise<ComputedSubmissionResult> => {
  const [awareness, somatic, pattern] = await Promise.all([
    getLatestCompletedSubmissionByType(userId, courseId, "awareness_states"),
    getLatestCompletedSubmissionByType(userId, courseId, "somatic_states"),
    getLatestCompletedSubmissionByType(userId, courseId, "pattern_awareness"),
  ]);

  if (!awareness || !somatic || !pattern) {
    throw new AppError(
      "Reflect & Act cannot be submitted until all prerequisite games are completed",
      422,
      "PREREQUISITES_NOT_MET",
    );
  }

  const patternData = pattern.resultData ?? {};
  const scores = {
    emotionalState: round(awareness.score),
    physiology: round(somatic.score),
    presenceAttention:
      typeof patternData.presenceScore === "number" ? round(patternData.presenceScore) : round(pattern.score),
    action: typeof patternData.actionScore === "number" ? round(patternData.actionScore) : round(pattern.score),
    pattern: typeof patternData.patternScore === "number" ? round(patternData.patternScore) : round(pattern.score),
  };

  const totalScore = round(Object.values(scores).reduce((sum, value) => sum + value, 0));
  const averageScore = round(totalScore / 5);
  const percentage = `${Math.round((totalScore / 15) * 100)}%`;
  const actionResolution = resolveReflectAction(scores);

  return {
    score: averageScore,
    isComplete: true,
    resultData: {
      sourceSubmissions: {
        awarenessId: awareness.id,
        somaticId: somatic.id,
        patternId: pattern.id,
      },
      sections: {
        emotionalState: {
          score: scores.emotionalState,
          label: getAwarenessScoreLabel(scores.emotionalState),
          source: "awareness_states",
        },
        physiology: {
          score: scores.physiology,
          label: getSomaticScoreLabel(scores.physiology),
          source: "somatic_states",
        },
        presenceAttention: {
          score: scores.presenceAttention,
          label: getPatternScoreLabel(scores.presenceAttention),
          source: "pattern_awareness",
        },
        action: {
          score: scores.action,
          label: getPatternScoreLabel(scores.action),
          source: "pattern_awareness",
        },
        pattern: {
          score: scores.pattern,
          label: getPatternScoreLabel(scores.pattern),
          source: "pattern_awareness",
        },
      },
      scores,
      totals: {
        sum: totalScore,
        average: averageScore,
        percentage,
        maxPossible: 15,
      },
      totalScore,
      averageScore,
      recommendedAction: actionResolution.recommendedAction,
      actionDescription: actionResolution.actionDescription,
      userReflectionNotes: payload.userReflectionNotes ?? null,
      acknowledgedAction: payload.acknowledgedAction ?? null,
    },
  };
};

const computeSubmission = async (
  userId: string,
  input: SubmissionInput,
): Promise<ComputedSubmissionResult> => {
  switch (input.type) {
    case "awareness_states":
      return computeAwarenessSubmission(input.step, input.payload);
    case "somatic_states":
      return computeSomaticSubmission(input.payload);
    case "pattern_awareness":
      return computePatternSubmission(input.payload);
    case "reflect_act":
      return computeReflectSubmission(userId, input.courseId, input.payload);
  }
};

const logActivity = async (userId: string, courseId: string, gameKey: string, title: string) => {
  await httpJson(`${env.IDENTITY_URL}/internal/activity-log`, {
    method: "POST",
    headers: activityHeaders(),
    body: JSON.stringify({
      userId,
      courseId,
      gameKey,
      type: "game_submission",
      title,
      completedAt: new Date().toISOString(),
    }),
  }).catch(() => null);
};

const ensureGameBelongsToCourse = async (courseId: string, gameId: string) => {
  const course = await CourseModel.findOne({
    _id: new Types.ObjectId(courseId),
    isActive: true,
    "games.gameId": new Types.ObjectId(gameId),
  });

  if (!course) {
    throw new AppError("Game does not belong to this course", 404, "GAME_NOT_FOUND");
  }

  return course;
};

const verifyAccess = async (userId: string, courseId: string) => {
  const response = await httpJson<{ success: boolean; data: { hasAccess: boolean } }>(
    `${env.COMMERCE_URL}/internal/purchases/${userId}/${courseId}`,
    {
      method: "GET",
      headers: activityHeaders(),
    },
  );

  if (!response.data.hasAccess) {
    throw new AppError("User has not purchased this course", 403, "COURSE_NOT_PURCHASED");
  }
};

export const submitGame = async (userId: string, gameId: string, input: SubmissionInput) => {
  await verifyAccess(userId, input.courseId);
  const course = await ensureGameBelongsToCourse(input.courseId, gameId);

  const game = await GameModel.findById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404, "GAME_NOT_FOUND");
  }

  if (game.key !== input.type) {
    throw new AppError("Submission type does not match selected game", 422, "VALIDATION_ERROR");
  }

  if ("subActivityKey" in input && typeof input.subActivityKey === "string") {
    try {
      ensureValidGameSubActivity(game.key, input.subActivityKey);
    } catch (error) {
      throw new AppError(
        error instanceof Error ? error.message : "Unsupported game sub activity",
        422,
        "VALIDATION_ERROR",
      );
    }
  }

  let submission;

  if (input.type === "awareness_states") {
    const existingDraft = await SubmissionModel.findOne({
      userId: new Types.ObjectId(userId),
      gameId: new Types.ObjectId(gameId),
      courseId: new Types.ObjectId(input.courseId),
      type: input.type,
      isComplete: false,
    });
    const mergedPayload = mergeAwarenessPayload(
      existingDraft?.payload as Extract<SubmissionInput, { type: "awareness_states" }>["payload"] | undefined,
      input.payload,
    );
    const computed = computeAwarenessSubmission(
      input.step,
      mergedPayload,
      input.subActivityKey,
    );
    submission = await SubmissionModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        gameId: new Types.ObjectId(gameId),
        courseId: new Types.ObjectId(input.courseId),
        type: input.type,
        isComplete: false,
      },
      {
        $set: {
          payload: mergedPayload,
          score: computed.score,
          resultData: computed.resultData,
          isComplete: computed.isComplete,
          completedAt: computed.isComplete ? new Date() : undefined,
        },
        $setOnInsert: {
          userId: new Types.ObjectId(userId),
          gameId: new Types.ObjectId(gameId),
          courseId: new Types.ObjectId(input.courseId),
          type: input.type,
        },
      },
      { upsert: true, new: true },
    );
  } else if (input.type === "pattern_awareness") {
    const existingDraft = await SubmissionModel.findOne({
      userId: new Types.ObjectId(userId),
      gameId: new Types.ObjectId(gameId),
      courseId: new Types.ObjectId(input.courseId),
      type: input.type,
      isComplete: false,
    });

    const mergedPayload = mergePatternPayload(existingDraft?.payload as PatternPayload | undefined, input.payload);
    const hasAllExercises = requiredPatternExerciseKeys.every((key) =>
      mergedPayload.exercises.some((exercise) => exercise.exerciseKey === key),
    );
    const computed = hasAllExercises
      ? computePatternSubmission(mergedPayload)
      : computePatternProgressSubmission(mergedPayload);

    submission = await SubmissionModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        gameId: new Types.ObjectId(gameId),
        courseId: new Types.ObjectId(input.courseId),
        type: input.type,
        isComplete: false,
      },
      {
        $set: {
          payload: mergedPayload,
          score: computed.score,
          resultData: computed.resultData,
          isComplete: computed.isComplete,
          completedAt: computed.isComplete ? new Date() : undefined,
        },
        $setOnInsert: {
          userId: new Types.ObjectId(userId),
          gameId: new Types.ObjectId(gameId),
          courseId: new Types.ObjectId(input.courseId),
          type: input.type,
        },
      },
      { upsert: true, new: true },
    );
  } else {
    const computed = await computeSubmission(userId, input);
    submission = await SubmissionModel.create({
      userId: new Types.ObjectId(userId),
      gameId: new Types.ObjectId(gameId),
      courseId: new Types.ObjectId(input.courseId),
      type: input.type,
      payload: input.payload,
      score: computed.score,
      resultData: computed.resultData,
      isComplete: true,
      completedAt: new Date(),
    });
  }

  if (submission.isComplete) {
    await logActivity(userId, input.courseId, game.key, `${game.title} completed`);
  }

  const finalCourseScore = submission.isComplete ? await deriveFinalCourseScore(userId, input.courseId) : null;

  return {
    ...submission.toObject(),
    finalCourseScore,
    courseGameWeights: course.games.map((item: { gameId: Types.ObjectId; weight: number }) => ({
      gameId: String(item.gameId),
      weight: item.weight,
    })),
  };
};

export const getGameResult = async (userId: string, gameId: string) => {
  const game = await GameModel.findById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404, "GAME_NOT_FOUND");
  }

  if (game.key === "reflect_act") {
    const latestReflect = await SubmissionModel.findOne({
      userId: new Types.ObjectId(userId),
      gameId: new Types.ObjectId(gameId),
      isComplete: true,
    }).sort({ completedAt: -1, createdAt: -1 });

    if (latestReflect) {
      return latestReflect.resultData ?? latestReflect.toObject();
    }

    const latestCourseSubmission = await SubmissionModel.findOne({
      userId: new Types.ObjectId(userId),
      type: { $in: ["awareness_states", "somatic_states", "pattern_awareness"] },
      isComplete: true,
    }).sort({ completedAt: -1, createdAt: -1 });

    if (!latestCourseSubmission) {
      throw new AppError("Submission not found", 404, "NOT_FOUND");
    }

    const computed = await computeReflectSubmission(userId, String(latestCourseSubmission.courseId), {});
    return computed.resultData;
  }

  const submission = await SubmissionModel.findOne({
    userId: new Types.ObjectId(userId),
    gameId: new Types.ObjectId(gameId),
    isComplete: true,
  }).sort({ completedAt: -1, createdAt: -1 });

  if (!submission) {
    throw new AppError("Submission not found", 404, "NOT_FOUND");
  }

  return submission.resultData ?? submission.toObject();
};

export const getCourseSubmissions = async (userId: string, courseId: string) => {
  const submissions = await SubmissionModel.find({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
  }).sort({ completedAt: -1, createdAt: -1 });

  const finalCourseScore = await deriveFinalCourseScore(userId, courseId);
  return { submissions, finalCourseScore };
};

export const getSubmissionById = async (userId: string, submissionId: string) => {
  const submission = await SubmissionModel.findOne({
    _id: new Types.ObjectId(submissionId),
    userId: new Types.ObjectId(userId),
  });

  if (!submission) {
    throw new AppError("Submission not found", 404, "NOT_FOUND");
  }

  const finalCourseScore = await deriveFinalCourseScore(userId, String(submission.courseId));
  return {
    ...submission.toObject(),
    finalCourseScore,
  };
};

export const getSubmissionByIdForAdmin = async (submissionId: string) => {
  const submission = await SubmissionModel.findById(new Types.ObjectId(submissionId));

  if (!submission) {
    throw new AppError("Submission not found", 404, "NOT_FOUND");
  }

  const finalCourseScore = await deriveFinalCourseScore(String(submission.userId), String(submission.courseId));
  return {
    ...submission.toObject(),
    finalCourseScore,
  };
};

export const deleteSubmission = async (submissionId: string) => {
  const submission = await SubmissionModel.findByIdAndDelete(submissionId);

  if (!submission) {
    throw new AppError("Submission not found", 404, "NOT_FOUND");
  }

  return { deleted: true };
};

export const getCompletedCourseGameIds = async (userId: string, courseId: string) => {
  const submissions = await SubmissionModel.aggregate<{ _id: Types.ObjectId }>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        isComplete: true,
      },
    },
    {
      $group: {
        _id: "$gameId",
      },
    },
  ]);

  return submissions.map((item) => String(item._id));
};

export const getActivityDetailByKey = async (_gameId: string, activityKey: string) => {
  try {
    return getActivityDetail(activityKey);
  } catch {
    throw new AppError("Activity not found", 404, "NOT_FOUND");
  }
};
