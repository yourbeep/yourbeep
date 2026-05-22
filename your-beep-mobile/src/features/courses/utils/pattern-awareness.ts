export type PatternExerciseKey =
  | 'draw_your_breath'
  | 'awareness_circles'
  | 'scribble_drawing';

export interface PatternPoint {
  t: number;
  x: number;
  y: number;
}

export interface PatternStroke {
  points: PatternPoint[];
}

export interface PatternExercisePayload {
  durationSeconds: number;
  exerciseKey: PatternExerciseKey;
  metrics: Record<string, number | string>;
}

interface Bounds {
  height: number;
  width: number;
}

const safeDivide = (value: number, total: number) => (total > 0 ? value / total : 0);

function getAllPoints(strokes: PatternStroke[]) {
  return strokes.flatMap((stroke) => stroke.points);
}

function getBounds(points: PatternPoint[]) {
  if (points.length === 0) {
    return { maxX: 0, maxY: 0, minX: 0, minY: 0 };
  }

  return points.reduce(
    (acc, point) => ({
      maxX: Math.max(acc.maxX, point.x),
      maxY: Math.max(acc.maxY, point.y),
      minX: Math.min(acc.minX, point.x),
      minY: Math.min(acc.minY, point.y),
    }),
    {
      maxX: points[0].x,
      maxY: points[0].y,
      minX: points[0].x,
      minY: points[0].y,
    },
  );
}

function getTotalLength(strokes: PatternStroke[]) {
  return strokes.reduce((sum, stroke) => {
    let strokeLength = 0;

    for (let index = 1; index < stroke.points.length; index += 1) {
      const previous = stroke.points[index - 1];
      const current = stroke.points[index];
      strokeLength += Math.hypot(current.x - previous.x, current.y - previous.y);
    }

    return sum + strokeLength;
  }, 0);
}

function getCoverage(points: PatternPoint[], canvas: Bounds) {
  const bounds = getBounds(points);
  const width = Math.max(0, bounds.maxX - bounds.minX);
  const height = Math.max(0, bounds.maxY - bounds.minY);
  return Math.max(0, Math.min(1, safeDivide(width * height, canvas.width * canvas.height)));
}

function getAverageStep(strokes: PatternStroke[]) {
  const distances: number[] = [];

  strokes.forEach((stroke) => {
    for (let index = 1; index < stroke.points.length; index += 1) {
      const previous = stroke.points[index - 1];
      const current = stroke.points[index];
      distances.push(Math.hypot(current.x - previous.x, current.y - previous.y));
    }
  });

  if (distances.length === 0) {
    return 0;
  }

  return distances.reduce((sum, value) => sum + value, 0) / distances.length;
}

function getDirectionChanges(strokes: PatternStroke[]) {
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
}

function getCircleCompleteness(points: PatternPoint[]) {
  if (points.length < 3) {
    return 0.2;
  }

  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const radii = points.map((point) => Math.hypot(point.x - centerX, point.y - centerY));
  const averageRadius = radii.reduce((sum, value) => sum + value, 0) / radii.length;
  const variance =
    radii.reduce((sum, value) => sum + Math.abs(value - averageRadius), 0) / radii.length;
  const start = points[0];
  const end = points[points.length - 1];
  const closure = Math.hypot(end.x - start.x, end.y - start.y);
  const closurePenalty = averageRadius > 0 ? Math.min(1, closure / averageRadius) : 1;
  const smoothnessPenalty = averageRadius > 0 ? Math.min(1, variance / averageRadius) : 1;

  return Math.max(0.1, Math.min(1, 1 - (closurePenalty * 0.45 + smoothnessPenalty * 0.55)));
}

function classifySpacing(value: number, canvasWidth: number) {
  if (value > canvasWidth * 0.03) {
    return 'wide';
  }

  if (value > canvasWidth * 0.015) {
    return 'medium';
  }

  return 'narrow';
}

function getIntervalPattern(strokes: PatternStroke[]) {
  const distances: number[] = [];

  strokes.forEach((stroke) => {
    for (let index = 1; index < stroke.points.length; index += 1) {
      const previous = stroke.points[index - 1];
      const current = stroke.points[index];
      distances.push(Math.hypot(current.x - previous.x, current.y - previous.y));
    }
  });

  if (distances.length < 6) {
    return 'medium';
  }

  const midpoint = Math.floor(distances.length / 2);
  const firstHalf =
    distances.slice(0, midpoint).reduce((sum, value) => sum + value, 0) / Math.max(1, midpoint);
  const secondHalf =
    distances.slice(midpoint).reduce((sum, value) => sum + value, 0) /
    Math.max(1, distances.length - midpoint);

  if (secondHalf > firstHalf * 1.18) {
    return 'narrow_to_wide';
  }

  if (firstHalf > secondHalf * 1.18) {
    return 'wide_to_narrow';
  }

  return 'medium';
}

export function buildPatternExercisePayload(
  exerciseKey: PatternExerciseKey,
  strokes: PatternStroke[],
  durationSeconds: number,
  canvas: Bounds,
): PatternExercisePayload {
  const points = getAllPoints(strokes);
  const totalLength = Math.round(getTotalLength(strokes));
  const penLiftCount = Math.max(0, strokes.length - 1);
  const spatialCoverage = Number(getCoverage(points, canvas).toFixed(2));
  const averageStep = getAverageStep(strokes);
  const directionChanges = getDirectionChanges(strokes);

  if (exerciseKey === 'draw_your_breath') {
    return {
      durationSeconds,
      exerciseKey,
      metrics: {
        controlLimitSpacing: classifySpacing(averageStep, canvas.width),
        intervalPattern: getIntervalPattern(strokes),
        penLiftCount,
        spatialCoverage,
        totalLength,
      },
    };
  }

  if (exerciseKey === 'awareness_circles') {
    return {
      durationSeconds,
      exerciseKey,
      metrics: {
        circleCompleteness: Number(getCircleCompleteness(points).toFixed(2)),
        circlePattern: directionChanges > 18 ? 'scattered' : 'defined_spatial',
        penLiftCount,
        spatialCoverage,
      },
    };
  }

  return {
    durationSeconds,
    exerciseKey,
    metrics: {
      directionPattern: directionChanges > 24 ? 'scattered' : 'defined_spatial',
      lineSpacing: classifySpacing(averageStep, canvas.width),
      penLiftCount,
      spatialCoverage,
    },
  };
}
