import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { fetchGameActivity } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

interface SomaticBackendActivityPanelProps {
  activityKey: string;
}

function toObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function pickString(source: Record<string, unknown> | null, keys: string[]) {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

function pickStringList(source: Record<string, unknown> | null, keys: string[]) {
  if (!source) {
    return [];
  }

  for (const key of keys) {
    const value = source[key];

    if (!Array.isArray(value)) {
      continue;
    }

    const list = value
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim());

    if (list.length > 0) {
      return list;
    }
  }

  return [];
}

function pickDurationLabel(source: Record<string, unknown> | null) {
  if (!source) {
    return null;
  }

  const durationValue =
    source.durationLabel ??
    source.durationText ??
    source.recommendedDuration ??
    source.durationSeconds;

  if (typeof durationValue === 'string' && durationValue.trim().length > 0) {
    return durationValue.trim();
  }

  if (typeof durationValue === 'number' && Number.isFinite(durationValue) && durationValue > 0) {
    const minutes = Math.floor(durationValue / 60);
    const seconds = durationValue % 60;

    if (minutes > 0 && seconds > 0) {
      return `${minutes}m ${seconds}s`;
    }

    if (minutes > 0) {
      return `${minutes}m`;
    }

    return `${seconds}s`;
  }

  return null;
}

export function SomaticBackendActivityPanel({
  activityKey,
}: SomaticBackendActivityPanelProps) {
  const { colors, isDark } = useAppTheme();
  const gameId = useAppSelector((state) => state.somatic.gameId);
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [activity, setActivity] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!gameId) {
      setState('error');
      setMessage('Backend game context is missing for this activity.');
      setActivity(null);
      return;
    }

    let active = true;
    setState('loading');
    setMessage(null);

    void (async () => {
      try {
        const response = await fetchGameActivity(gameId, activityKey);

        if (!active) {
          return;
        }

        setActivity(toObject(response.activity));
        setState('success');
      } catch (error) {
        if (!active) {
          return;
        }

        setActivity(null);
        setState('error');
        setMessage(
          error instanceof Error && error.message
            ? error.message
            : 'Could not load backend activity instructions.',
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [activityKey, gameId]);

  const title = useMemo(
    () => pickString(activity, ['title', 'name', 'label']) ?? 'Backend Activity Guide',
    [activity],
  );
  const description = useMemo(
    () => pickString(activity, ['description', 'summary', 'prompt', 'instruction']),
    [activity],
  );
  const instructionList = useMemo(
    () => pickStringList(activity, ['instructions', 'steps', 'protocol']),
    [activity],
  );
  const durationLabel = useMemo(() => pickDurationLabel(activity), [activity]);

  return (
    <View
      className="gap-4 rounded-[22px] border px-5 py-5"
      style={{
        backgroundColor: isDark ? colors.surfaceMuted : '#F4F7ED',
        borderColor: colors.primaryBorder,
      }}
    >
      <View className="gap-1">
        <Text className="font-poppinsMedium text-[12px] uppercase tracking-[0.9px]" style={{ color: colors.accent }}>
          Backend activity
        </Text>
        <Text className="font-poppinsSemi text-[20px]" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
      </View>

      {state === 'loading' ? (
        <Text className="font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
          Loading backend instructions...
        </Text>
      ) : null}

      {state === 'error' ? (
        <Text className="font-poppinsRegular text-[14px] leading-[24px]" style={{ color: '#E45B38' }}>
          {message ?? 'Could not load backend instructions for this activity.'}
        </Text>
      ) : null}

      {state === 'success' ? (
        <>
          {description ? (
            <Text className="font-poppinsRegular text-[14px] leading-[26px]" style={{ color: colors.textSecondary }}>
              {description}
            </Text>
          ) : null}

          {durationLabel ? (
            <View className="self-start rounded-full px-3 py-1.5" style={{ backgroundColor: colors.surface }}>
              <Text className="font-poppinsMedium text-[12px]" style={{ color: colors.textSecondary }}>
                Recommended duration: {durationLabel}
              </Text>
            </View>
          ) : null}

          {instructionList.length > 0 ? (
            <View className="gap-3">
              {instructionList.map((item, index) => (
                <View className="flex-row gap-3" key={`${activityKey}-${index + 1}`}>
                  <Text className="w-5 font-poppinsSemi text-[12px]" style={{ color: colors.accent }}>
                    {(index + 1).toString().padStart(2, '0')}
                  </Text>
                  <Text className="flex-1 font-poppinsRegular text-[13px] leading-[23px]" style={{ color: colors.textSecondary }}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
