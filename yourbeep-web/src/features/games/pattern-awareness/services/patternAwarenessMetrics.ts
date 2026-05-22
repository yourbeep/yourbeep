import type { PatternAwarenessExerciseKey } from "@store/slices/games";
import type { ExerciseMetricsSummary, SketchPoint, SketchStroke } from "../types";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const roundTo = (value: number, decimals = 2) =>
  Number(value.toFixed(decimals));

const getAllPoints = (strokes: SketchStroke[]) =>
  strokes.flatMap((stroke) => stroke.points);

const getBounds = (points: SketchPoint[]) => {
  if (!points.length) {
    return null;
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
};

const getElapsedSeconds = (strokes: SketchStroke[]) => {
  const timestamps = getAllPoints(strokes).map((point) => point.time);
  if (!timestamps.length) {
    return 0;
  }

  return Math.max(1, Math.round((Math.max(...timestamps) - Math.min(...timestamps)) / 1000));
};

const getSpatialCoverage = (
  strokes: SketchStroke[],
  width: number,
  height: number,
) => {
  const bounds = getBounds(getAllPoints(strokes));
  if (!bounds || width <= 0 || height <= 0) {
    return 0;
  }

  return clamp(
    ((bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY)) / (width * height),
  );
};

const getPenLiftCount = (strokes: SketchStroke[]) =>
  Math.max(0, strokes.filter((stroke) => stroke.points.length > 1).length - 1);

const getAverageSpacing = (strokes: SketchStroke[]) => {
  const points = getAllPoints(strokes);
  if (points.length < 2) {
    return 0;
  }

  let totalDistance = 0;

  for (let index = 1; index < points.length; index += 1) {
    totalDistance += Math.hypot(
      points[index].x - points[index - 1].x,
      points[index].y - points[index - 1].y,
    );
  }

  return totalDistance / (points.length - 1);
};

const getTotalLength = (strokes: SketchStroke[]) =>
  strokes.reduce((sum, stroke) => {
    let strokeLength = 0;

    for (let index = 1; index < stroke.points.length; index += 1) {
      strokeLength += Math.hypot(
        stroke.points[index].x - stroke.points[index - 1].x,
        stroke.points[index].y - stroke.points[index - 1].y,
      );
    }

    return sum + strokeLength;
  }, 0);

const getDirectionChanges = (strokes: SketchStroke[]) => {
  let changes = 0;

  strokes.forEach((stroke) => {
    let lastAngle: number | null = null;

    for (let index = 1; index < stroke.points.length; index += 1) {
      const previous = stroke.points[index - 1];
      const current = stroke.points[index];
      const angle = Math.atan2(current.y - previous.y, current.x - previous.x);

      if (lastAngle !== null && Math.abs(angle - lastAngle) > Math.PI / 3) {
        changes += 1;
      }

      lastAngle = angle;
    }
  });

  return changes;
};

const getAxisDrift = (strokes: SketchStroke[]) => {
  const points = getAllPoints(strokes);
  const bounds = getBounds(points);
  if (!bounds) {
    return 0;
  }

  const width = bounds.maxX - bounds.minX || 1;
  const height = bounds.maxY - bounds.minY || 1;
  return width / height;
};

const getCircularVariance = (strokes: SketchStroke[]) => {
  const points = getAllPoints(strokes);
  const bounds = getBounds(points);
  if (!bounds || points.length < 3) {
    return 1;
  }

  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const radii = points.map((point) => Math.hypot(point.x - centerX, point.y - centerY));
  const averageRadius =
    radii.reduce((sum, radius) => sum + radius, 0) / Math.max(1, radii.length);

  if (!averageRadius) {
    return 1;
  }

  const variance =
    radii.reduce((sum, radius) => sum + Math.abs(radius - averageRadius), 0) /
    Math.max(1, radii.length);

  return clamp(variance / averageRadius, 0, 1.4);
};

const getLoopClosureRatio = (strokes: SketchStroke[]) => {
  const closedStrokes = strokes.filter((stroke) => {
    if (stroke.points.length < 3) {
      return false;
    }

    const first = stroke.points[0];
    const last = stroke.points[stroke.points.length - 1];
    return Math.hypot(last.x - first.x, last.y - first.y) < 40;
  });

  return clamp(closedStrokes.length / Math.max(1, strokes.length));
};

const serialiseTrace = (strokes: SketchStroke[]) => {
  const allPoints = getAllPoints(strokes);
  const firstTimestamp = allPoints[0]?.time ?? 0;

  return allPoints.map((point) => ({
    x: roundTo(point.x / 1000, 3),
    y: roundTo(point.y / 700, 3),
    t: Math.max(0, point.time - firstTimestamp),
  }));
};

const getSpacingLabel = (value: number) => {
  if (value > 18) return "wide";
  if (value > 9) return "medium";
  return "narrow";
};

const getIntervalPattern = (strokes: SketchStroke[]) => {
  const points = getAllPoints(strokes);
  if (points.length < 6) {
    return "medium";
  }

  const firstHalf = points.slice(0, Math.floor(points.length / 2));
  const secondHalf = points.slice(Math.floor(points.length / 2));
  const firstBounds = getBounds(firstHalf);
  const secondBounds = getBounds(secondHalf);
  if (!firstBounds || !secondBounds) {
    return "medium";
  }

  const firstAmplitude = firstBounds.maxY - firstBounds.minY;
  const secondAmplitude = secondBounds.maxY - secondBounds.minY;

  if (Math.abs(firstAmplitude - secondAmplitude) < 18) {
    return "even";
  }

  return firstAmplitude > secondAmplitude ? "wide_to_narrow" : "narrow_to_wide";
};

const getCirclePattern = (variance: number, coverage: number) => {
  if (coverage < 0.2) return "contained";
  if (variance > 0.38) return "scattered";
  if (coverage > 0.42) return "expansive";
  return "defined_spatial";
};

const getDirectionPattern = (axisDrift: number, coverage: number) => {
  if (coverage < 0.22) return "contained";
  if (axisDrift > 1.8 || axisDrift < 0.6) return "defined_spatial";
  if (coverage > 0.48) return "undefined_scattered";
  return "scattered";
};

const scoreFromMetrics = (values: number[]) =>
  Math.round(
    clamp(
      values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length),
      0,
      1,
    ) * 100,
  );

export const summariseExerciseMetrics = ({
  exerciseKey,
  strokes,
  width,
  height,
}: {
  exerciseKey: PatternAwarenessExerciseKey;
  strokes: SketchStroke[];
  width: number;
  height: number;
}): ExerciseMetricsSummary => {
  const validStrokes = strokes.filter((stroke) => stroke.points.length > 1);
  const durationSeconds = getElapsedSeconds(validStrokes);
  const strokeCount = validStrokes.length;
  const spatialCoverage = getSpatialCoverage(validStrokes, width, height);
  const penLiftCount = getPenLiftCount(validStrokes);
  const averageSpacing = getAverageSpacing(validStrokes);
  const totalLength = getTotalLength(validStrokes);
  const directionChanges = getDirectionChanges(validStrokes);
  const axisDrift = getAxisDrift(validStrokes);
  const circularVariance = getCircularVariance(validStrokes);
  const closureRatio = getLoopClosureRatio(validStrokes);
  const points = getAllPoints(validStrokes);
  const bounds = getBounds(points);
  const commonTelemetry = {
    penLiftCount,
    spatialCoverage: roundTo(spatialCoverage),
    strokeCount,
    totalLength: roundTo(totalLength, 1),
    totalPoints: points.length,
    averageStep: roundTo(averageSpacing, 2),
    directionChanges,
    axisDrift: roundTo(axisDrift, 3),
    closureRatio: roundTo(closureRatio, 3),
    circularVariance: roundTo(circularVariance, 3),
    canvas: { width, height },
    bounds: bounds
      ? {
          minX: roundTo(bounds.minX, 1),
          maxX: roundTo(bounds.maxX, 1),
          minY: roundTo(bounds.minY, 1),
          maxY: roundTo(bounds.maxY, 1),
        }
      : null,
    trace: serialiseTrace(validStrokes),
  };

  if (exerciseKey === "draw_your_breath") {
    const metrics = {
      controlLimitSpacing: getSpacingLabel(averageSpacing),
      intervalPattern: getIntervalPattern(validStrokes),
      ...commonTelemetry,
    };

    return {
      durationSeconds,
      strokeCount,
      metrics,
      score: scoreFromMetrics([
        clamp(durationSeconds / 150),
        spatialCoverage,
        1 - clamp(penLiftCount / 6),
        clamp(axisDrift / 2.2),
      ]),
    };
  }

  if (exerciseKey === "awareness_circles") {
    const completeness = clamp((closureRatio * 0.65) + ((1 - circularVariance) * 0.35));
    const metrics = {
      circleCompleteness: roundTo(completeness),
      circlePattern: getCirclePattern(circularVariance, spatialCoverage),
      overlapDensity: roundTo(directionChanges / Math.max(1, strokeCount), 2),
      isolatedCircleCount: penLiftCount,
      ...commonTelemetry,
    };

    return {
      durationSeconds,
      strokeCount,
      metrics,
      score: scoreFromMetrics([
        completeness,
        spatialCoverage,
        1 - clamp(penLiftCount / 5),
      ]),
    };
  }

  const metrics = {
    lineSpacing: getSpacingLabel(averageSpacing),
    directionPattern: getDirectionPattern(axisDrift, spatialCoverage),
    densityScore: roundTo(totalLength / Math.max(1, width * height), 4),
    ...commonTelemetry,
  };

  return {
    durationSeconds,
    strokeCount,
    metrics,
    score: scoreFromMetrics([
      clamp(durationSeconds / 150),
      spatialCoverage,
      clamp(averageSpacing / 22),
      1 - clamp(penLiftCount / 8),
    ]),
  };
};
