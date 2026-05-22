export type GameRoutePath =
  | '/awareness-states'
  | '/pattern-awareness'
  | '/reflect-synthesis'
  | '/somatic-states';

export function resolveInteractiveCueRoute(gameKey?: string | null): GameRoutePath | null {
  if (!gameKey) {
    return null;
  }

  switch (gameKey) {
    case 'awareness_states':
      return '/awareness-states';
    case 'pattern_awareness':
      return '/pattern-awareness';
    case 'reflect_act':
      return '/reflect-synthesis';
    case 'somatic_states':
      return '/somatic-states';
    default:
      return null;
  }
}

export function formatCueTime(triggerAtSeconds?: number) {
  if (typeof triggerAtSeconds !== 'number' || Number.isNaN(triggerAtSeconds) || triggerAtSeconds < 0) {
    return null;
  }

  const totalSeconds = Math.floor(triggerAtSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
