import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronDown } from 'lucide-react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import {
  getReflectFocusContent,
  reflectFocusEntries,
  reflectPeriodSummaries,
  reflectTimePeriodOptions,
  ReflectFocusAreaId,
  ReflectTimePeriod,
} from '@/features/courses/data/reflect-and-act-content';
import { fetchGameResult } from '@/lib/api';
import { AppThemeColors } from '@/theme/colors';
import { useAppTheme } from '@/theme/use-app-theme';

const CHART_SIZE = 300;
const CHART_CENTER = CHART_SIZE / 2;
const CHART_RADIUS = 104;

function buildRadarPath(values: number[]) {
  return values
    .map((value, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / values.length;
      const x = CHART_CENTER + Math.cos(angle) * CHART_RADIUS * value;
      const y = CHART_CENTER + Math.sin(angle) * CHART_RADIUS * value;

      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ')
    .concat(' Z');
}

function buildPointMap(values: number[]) {
  return values.map((value, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / values.length;

    return {
      x: CHART_CENTER + Math.cos(angle) * CHART_RADIUS * value,
      y: CHART_CENTER + Math.sin(angle) * CHART_RADIUS * value,
    };
  });
}

function toNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function buildBackendPeriodSummary(resultData: Record<string, unknown>, period: ReflectTimePeriod) {
  const sections =
    resultData.sections && typeof resultData.sections === 'object'
      ? (resultData.sections as Record<string, unknown>)
      : null;
  const totals =
    resultData.totals && typeof resultData.totals === 'object'
      ? (resultData.totals as Record<string, unknown>)
      : null;

  if (!sections) {
    return null;
  }

  const getSectionScore = (key: string, fallback: number) => {
    const value = sections[key];

    if (value && typeof value === 'object' && 'score' in value) {
      return toNumber((value as Record<string, unknown>).score, fallback);
    }

    return fallback;
  };

  const values = [
    getSectionScore('presenceAttention', 2) / 3,
    getSectionScore('action', 2) / 3,
    getSectionScore('pattern', 2) / 3,
    getSectionScore('physiology', 2) / 3,
    getSectionScore('emotionalState', 2) / 3,
  ];
  const percentage =
    typeof totals?.percentage === 'string'
      ? totals.percentage
      : `${Math.round((toNumber(totals?.sum, 10) / Math.max(1, toNumber(totals?.maxPossible, 15))) * 100)}%`;
  const periodLabel = reflectTimePeriodOptions.find((option) => option.id === period)?.label ?? 'Daily';
  const recommendedAction =
    typeof resultData.recommendedAction === 'string'
      ? resultData.recommendedAction.replace(/_/g, ' ')
      : 'not yet available';

  return {
    coherence: Math.round(parseInt(percentage.replace('%', ''), 10) || 0),
    insightTitle: `${periodLabel} Live Synthesis`,
    label: periodLabel,
    mappedFor: `Recommended action: ${recommendedAction}. Overall coherence ${percentage}.`,
    values,
  };
}

function ReflectRadar({
  coherence,
  colors,
  isDark,
  onSelect,
  values,
}: {
  coherence: number;
  colors: AppThemeColors;
  isDark: boolean;
  onSelect: (focus: ReflectFocusAreaId) => void;
  values: number[];
}) {
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [drift]);

  const points = useMemo(() => buildPointMap(values), [values]);
  const polygonPath = useMemo(() => buildRadarPath(values), [values]);
  const activePoint = points[2];
  const markerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(drift.value, [0, 1], [activePoint.x - 10, activePoint.x + 2]) },
      { translateY: interpolate(drift.value, [0, 1], [activePoint.y + 10, activePoint.y - 4]) },
      { scale: interpolate(drift.value, [0, 1], [0.94, 1.04]) },
    ],
  }));

  return (
    <View className="items-center">
      <View className="relative h-[312px] w-[320px] items-center justify-center">
        <Svg height={CHART_SIZE} width={CHART_SIZE}>
          <Defs>
            <LinearGradient id="reflectFill" x1="0%" x2="100%" y1="0%" y2="100%">
              <Stop offset="0%" stopColor="#DDF5F1" stopOpacity="0.94" />
              <Stop offset="100%" stopColor="#C8E8E2" stopOpacity="0.88" />
            </LinearGradient>
          </Defs>

          {[1, 0.82, 0.64, 0.46].map((ratio) => (
            <Circle
              cx={CHART_CENTER}
              cy={CHART_CENTER}
              fill="none"
              key={ratio}
              r={CHART_RADIUS * ratio}
              stroke={isDark ? 'rgba(245,245,232,0.12)' : 'rgba(10,63,79,0.10)'}
              strokeWidth="1.2"
            />
          ))}

          <Path
            d={polygonPath}
            fill="url(#reflectFill)"
            opacity="0.98"
            stroke={isDark ? colors.accent : '#2F928A'}
            strokeWidth="5.5"
          />

          {points.map((point, index) => (
            <Circle
              cx={point.x}
              cy={point.y}
              fill={isDark ? colors.accent : '#0D7F77'}
              key={`${point.x}-${point.y}`}
              r={index === 2 ? 8 : 7}
            />
          ))}
        </Svg>

        <Animated.View className="absolute h-4 w-4 rounded-full bg-black" style={markerStyle} />

        <View className="absolute items-center">
          <Text className="font-poppinsSemi text-[17px]" style={{ color: colors.textPrimary }}>
            {coherence}%
          </Text>
          <Text className="mt-1 font-poppinsMedium text-[11px] tracking-[0.8px]" style={{ color: colors.primary }}>
            Coherence
          </Text>
        </View>

        <Pressable className="absolute top-0 px-1 py-1" onPress={() => onSelect('presence-attention')}>
          <Text className="font-poppinsMedium text-[10px] tracking-[0.3px]" style={{ color: colors.textPrimary }}>
            Presence & Attention
          </Text>
        </Pressable>
        <Pressable className="absolute right-[6px] top-[112px] px-1 py-1" onPress={() => onSelect('action')}>
          <Text className="font-poppinsMedium text-[10px] tracking-[0.3px]" style={{ color: colors.textPrimary }}>
            Action
          </Text>
        </Pressable>
        <Pressable className="absolute bottom-[16px] right-[76px] px-1 py-1" onPress={() => onSelect('pattern')}>
          <Text className="font-poppinsMedium text-[10px] tracking-[0.3px]" style={{ color: colors.textPrimary }}>
            Pattern
          </Text>
        </Pressable>
        <Pressable className="absolute bottom-[68px] left-[8px] px-1 py-1" onPress={() => onSelect('somatics')}>
          <Text className="font-poppinsMedium text-[10px] tracking-[0.3px]" style={{ color: colors.textPrimary }}>
            Somatics
          </Text>
        </Pressable>
        <Pressable className="absolute left-[10px] top-[114px] px-1 py-1" onPress={() => onSelect('emotional-state')}>
          <Text className="font-poppinsMedium text-[10px] tracking-[0.3px]" style={{ color: colors.textPrimary }}>
            Emotional State
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ReflectSynthesisScreen() {
  const params = useLocalSearchParams<{ courseId?: string; gameId?: string }>();
  const { colors, isDark } = useAppTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<ReflectTimePeriod>('daily');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [reflectResult, setReflectResult] = useState<Record<string, unknown> | null>(null);
  const [reflectState, setReflectState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reflectMessage, setReflectMessage] = useState<string | null>(null);

  const periodSummary = reflectPeriodSummaries[selectedPeriod];
  const effectiveGameId = params.gameId ? String(params.gameId) : undefined;
  const backendSummary = useMemo(
    () => (reflectResult ? buildBackendPeriodSummary(reflectResult, selectedPeriod) : null),
    [reflectResult, selectedPeriod],
  );
  const activeSummary = backendSummary ?? periodSummary;

  useEffect(() => {
    if (!effectiveGameId || reflectState !== 'idle') {
      return;
    }

    void (async () => {
      setReflectState('loading');
      setReflectMessage(null);

      try {
        const response = await fetchGameResult(effectiveGameId);
        const result =
          response && typeof response === 'object'
            ? (response as Record<string, unknown>)
            : null;

        setReflectResult(result);
        setReflectState('success');
      } catch (error) {
        setReflectMessage(
          error instanceof Error && error.message
            ? error.message
            : 'We could not load the reflect synthesis yet.',
        );
        setReflectState('error');
      }
    })();
  }, [effectiveGameId, reflectState]);

  const openReflectAction = (focus: ReflectFocusAreaId) =>
    router.push({
      params: {
        ...(params.courseId ? { courseId: String(params.courseId) } : {}),
        ...(effectiveGameId ? { gameId: effectiveGameId } : {}),
        focus,
      },
      pathname: '/reflect-action',
    });

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader
            onBackPress={() =>
              router.replace({
                pathname: '/behavioural-signal-intelligence',
                params: params.courseId ? { courseId: String(params.courseId) } : undefined,
              })
            }
            subtitle=""
            title="Reflect"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="items-center gap-4">
            <View className="relative">
              <Pressable
                className="flex-row items-center gap-2 rounded-full px-4 py-3"
                onPress={() => setShowPeriodMenu((current) => !current)}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.primaryBorder,
                  borderWidth: 1,
                }}
              >
                <Text className="font-poppinsMedium text-[15px]" style={{ color: colors.textPrimary }}>
                  {activeSummary.label}
                </Text>
                <ChevronDown color={colors.textPrimary} size={18} strokeWidth={2.1} />
              </Pressable>

              {showPeriodMenu ? (
                <View
                  className="absolute right-0 top-[58px] z-20 w-[148px] rounded-[20px] border px-2 py-2"
                  style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
                >
                  {reflectTimePeriodOptions.map((option) => {
                    const active = option.id === selectedPeriod;

                    return (
                      <Pressable
                        className="rounded-[14px] px-3 py-3"
                        key={option.id}
                        onPress={() => {
                          setSelectedPeriod(option.id);
                          setShowPeriodMenu(false);
                        }}
                        style={active ? { backgroundColor: colors.accentSoft } : undefined}
                      >
                        <Text
                          className="font-poppinsMedium text-[14px]"
                          style={{ color: active ? colors.primary : colors.textPrimary }}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>

            <View className="items-center">
              <Text className="text-center font-poppinsSemi text-[28px] leading-[34px]" style={{ color: colors.textPrimary }}>
                {activeSummary.insightTitle}
              </Text>
              <Text
                className="mt-2 text-center font-poppinsRegular text-[15px] leading-[24px]"
                style={{ color: colors.textSecondary, maxWidth: 308 }}
              >
                {activeSummary.mappedFor}
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={120}>
          <View className="gap-3 px-1">
            {reflectState === 'loading' ? (
              <Text className="text-center font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Loading your reflect synthesis from the backend...
              </Text>
            ) : reflectState === 'error' ? (
              <Text className="text-center font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
                {reflectMessage ?? 'We could not load the reflect synthesis yet.'}
              </Text>
            ) : !effectiveGameId ? (
              <Text className="text-center font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Backend reflect game context is missing, so this screen is showing local guidance only.
              </Text>
            ) : reflectState === 'success' && backendSummary ? (
              <Text className="text-center font-poppinsRegular text-[13px]" style={{ color: colors.accent }}>
                Live reflect synthesis loaded from your completed course activities.
              </Text>
            ) : null}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={140}>
          <View
            className="rounded-[30px] px-4 py-6"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.primaryBorder,
              borderWidth: 1,
            }}
          >
            <ReflectRadar
              coherence={activeSummary.coherence}
              colors={colors}
              isDark={isDark}
              onSelect={openReflectAction}
              values={activeSummary.values}
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={210}>
          <View className="items-center px-1">
            <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
              Suggestive Insights
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={250}>
          <View
            className="rounded-[24px] px-5 py-5"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.primaryBorder,
              borderWidth: 1,
            }}
          >
            {reflectFocusEntries.map((entry, index) => (
              <Pressable
                className={index === reflectFocusEntries.length - 1 ? 'flex-row gap-3' : 'mb-5 flex-row gap-3 border-b pb-5'}
                key={entry.id}
                onPress={() => openReflectAction(entry.id)}
                style={
                  index === reflectFocusEntries.length - 1
                    ? undefined
                    : { borderBottomColor: colors.primaryBorder }
                }
              >
                <View
                  className="mt-1 h-6 w-[3px] rounded-full"
                  style={{
                    backgroundColor:
                      index === 0
                        ? '#65E6E0'
                        : index === 1
                          ? '#C7CAFF'
                          : index === 2
                            ? '#FFB15C'
                            : index === 3
                              ? '#B8E394'
                              : '#C9CDD6',
                  }}
                />
                <View className="min-w-0 flex-1">
                  <Text className="font-poppinsSemi text-[16px] leading-[22px]" style={{ color: colors.textPrimary }}>
                    {entry.label}
                  </Text>
                  <Text
                    className="mt-1 font-poppinsRegular text-[14px] leading-[24px]"
                    style={{ color: colors.textSecondary }}
                  >
                    {getReflectFocusContent(entry.id).summary}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={320}>
          <AppButton
            label="Move To Act"
            onPress={() => openReflectAction('somatics')}
            variant="primary"
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}
