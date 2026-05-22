import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import {
  buildPatternExercisePayload,
  type PatternExerciseKey,
  type PatternExercisePayload,
  type PatternStroke,
} from '@/features/courses/utils/pattern-awareness';
import { useAppTheme } from '@/theme/use-app-theme';

const EXERCISE_SECONDS = 120;

const exercises: Array<{
  caption: string;
  description: string;
  key: PatternExerciseKey;
  title: string;
}> = [
  {
    caption: 'Inhale • Exhale • Trace',
    description: 'Trace the rhythm of your breath. Speed indicates intensity. The canvas drifts as you draw.',
    key: 'draw_your_breath',
    title: 'Map Your Breath',
  },
  {
    caption: 'Center • Expand • Return',
    description: 'Draw expanding circles with steady attention and minimal finger lift-offs.',
    key: 'awareness_circles',
    title: 'Awareness Circles',
  },
  {
    caption: 'Move • Notice • Release',
    description: 'Let the hand move freely so the final pattern reveals density, direction, and spatial use.',
    key: 'scribble_drawing',
    title: 'Scribble Drawing',
  },
] as const;

type Point = { t: number; x: number; y: number };

function buildStrokePath(stroke: PatternStroke) {
  if (stroke.points.length === 0) {
    return '';
  }

  return stroke.points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function PatternGuideArtwork({
  exerciseKey,
  hasStroke,
  isDark,
}: {
  exerciseKey: PatternExerciseKey;
  hasStroke: boolean;
  isDark: boolean;
}) {
  if (hasStroke) {
    return null;
  }

  if (exerciseKey === 'awareness_circles') {
    return (
      <View className="absolute inset-0 items-center justify-center">
        <Svg height="100%" width="100%">
          <Circle
            cx="24%"
            cy="46%"
            fill="none"
            opacity="0.9"
            r="52"
            stroke="#BEEDE6"
            strokeWidth="1.2"
          />
          <Circle
            cx="50%"
            cy="46%"
            fill={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)'}
            r="26"
            stroke="#162F35"
            strokeWidth="1.8"
          />
          <Circle cx="50%" cy="46%" fill="#111111" r="3.2" />
          <Path
            d="M52 172 C 112 128, 210 136, 286 198"
            fill="none"
            opacity="0.16"
            stroke="#DAD7C8"
            strokeWidth="1"
          />
        </Svg>
      </View>
    );
  }

  if (exerciseKey === 'scribble_drawing') {
    return (
      <View className="absolute inset-0 items-center justify-center">
        <Svg height="100%" width="100%">
          <Path
            d="M88 200 C 126 146, 154 238, 204 184 S 254 136, 292 188"
            fill="none"
            opacity="0.68"
            stroke="#BEDFD6"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <Path
            d="M114 154 C 152 102, 210 222, 276 150"
            fill="none"
            opacity="0.54"
            stroke="#D0CDC2"
            strokeLinecap="round"
            strokeWidth="6"
          />
        </Svg>
      </View>
    );
  }

  return (
    <View className="absolute inset-0 items-center justify-center">
      <Svg height="100%" width="100%">
        <Path
          d="M78 156 C 130 210, 188 186, 242 124 S 314 92, 306 154"
          fill="none"
          opacity="0.78"
          stroke="#A8E4DC"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <Path
          d="M102 206 C 148 136, 206 152, 258 218 S 326 212, 328 180"
          fill="none"
          opacity="0.28"
          stroke="#C8C5BA"
          strokeLinecap="round"
          strokeWidth="8"
        />
      </Svg>

      <Text
        className="mt-14 font-poppinsRegular text-[16px]"
        style={{ color: isDark ? 'rgba(245,245,232,0.52)' : 'rgba(90,112,120,0.55)' }}
      >
        Trace your breath
      </Text>
    </View>
  );
}

export function PatternAwarenessScreen() {
  const params = useLocalSearchParams<{ courseId?: string; gameId?: string }>();
  const { colors, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const [canvasSize, setCanvasSize] = useState({ height: 420, width: 320 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exercisePayloads, setExercisePayloads] = useState<PatternExercisePayload[]>([]);
  const [exerciseStart, setExerciseStart] = useState(() => Date.now());
  const [remainingSeconds, setRemainingSeconds] = useState(EXERCISE_SECONDS);
  const [, setRenderVersion] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef<number | null>(null);
  const strokesRef = useRef<PatternStroke[]>([]);
  const isCompact = width < 390;

  const currentExercise = exercises[currentIndex];
  const strokes = strokesRef.current;
  const canFinishExercise = strokes.some((stroke) => stroke.points.length > 1);
  const isLastExercise = currentIndex === exercises.length - 1;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const requestCanvasRender = () => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setRenderVersion((current) => current + 1);
    });
  };

  const resetCurrentExercise = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    strokesRef.current = [];
    setExerciseStart(Date.now());
    setRemainingSeconds(EXERCISE_SECONDS);
    requestCanvasRender();
  };

  const startTimer = () => {
    if (intervalRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          startTimer();
          const { locationX, locationY } = event.nativeEvent;
          const point: Point = { t: Date.now(), x: locationX, y: locationY };
          strokesRef.current = [...strokesRef.current, { points: [point] }];
          requestCanvasRender();
        },
        onPanResponderMove: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          const point: Point = { t: Date.now(), x: locationX, y: locationY };
          const nextStrokes = strokesRef.current.length > 0 ? [...strokesRef.current] : [{ points: [] }];
          const lastStroke = nextStrokes[nextStrokes.length - 1];
          const previousPoint = lastStroke.points[lastStroke.points.length - 1];

          if (previousPoint && Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y) < 2.5) {
            return;
          }

          nextStrokes[nextStrokes.length - 1] = {
            ...lastStroke,
            points: [...lastStroke.points, point],
          };
          strokesRef.current = nextStrokes;
          requestCanvasRender();
        },
        onPanResponderRelease: requestCanvasRender,
        onPanResponderTerminate: requestCanvasRender,
        onStartShouldSetPanResponder: () => true,
      }),
    [],
  );

  const finishExercise = () => {
    const durationSeconds = Math.max(
      1,
      Math.min(EXERCISE_SECONDS, Math.round((Date.now() - exerciseStart) / 1000)),
    );
    const payload = buildPatternExercisePayload(
      currentExercise.key,
      strokesRef.current,
      durationSeconds,
      canvasSize,
    );
    const nextPayloads = [...exercisePayloads, payload];

    stopTimer();

    if (isLastExercise) {
      router.push({
        pathname: '/pattern-awareness-result',
        params: {
          ...(params.courseId ? { courseId: params.courseId } : {}),
          ...(params.gameId ? { gameId: params.gameId } : {}),
          patternPayload: JSON.stringify(nextPayloads),
        },
      });
      return;
    }

    setExercisePayloads(nextPayloads);
    setCurrentIndex((current) => current + 1);
    strokesRef.current = [];
    setExerciseStart(Date.now());
    setRemainingSeconds(EXERCISE_SECONDS);
    requestCanvasRender();
  };

  const handleCanvasLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setCanvasSize({
      height: Math.max(1, Math.round(height)),
      width: Math.max(1, Math.round(width)),
    });
  };

  const buttonLabel = isLastExercise ? 'Finish Mapping' : 'Continue Mapping';

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell scrollEnabled={false} showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader
            onBackPress={() =>
              router.replace({
                pathname: '/behavioural-signal-intelligence',
                params: params.courseId ? { courseId: params.courseId } : undefined,
              })
            }
            subtitle=""
            title="Pattern Awareness"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={80}>
          <View className="items-center">
            <View
              className="flex-row items-center gap-3 rounded-full px-6 py-4 shadow-brand"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.primaryBorder,
                borderWidth: 1,
              }}
            >
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors.accent }} />
              <Text className="font-poppinsSemi text-[18px]" style={{ color: colors.textPrimary }}>
                {formatTimer(remainingSeconds)}
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={150}>
          <View
            className="flex-1 overflow-hidden rounded-[30px]"
            onLayout={handleCanvasLayout}
            style={{
              backgroundColor: isDark ? '#142126' : colors.background,
              minHeight: isCompact ? 420 : 520,
            }}
            {...panResponder.panHandlers}
          >
            <PatternGuideArtwork
              exerciseKey={currentExercise.key}
              hasStroke={strokes.length > 0}
              isDark={isDark}
            />

            <Svg height="100%" width="100%">
              {strokes.map((stroke, index) => (
                <Path
                  d={buildStrokePath(stroke)}
                  fill="none"
                  key={`${currentExercise.key}-${index}`}
                  stroke={
                    isDark ? '#7FF0E3' : currentExercise.key === 'draw_your_breath' ? '#A5E8DF' : '#103E4B'
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={currentExercise.key === 'draw_your_breath' ? 5 : 4}
                />
              ))}
            </Svg>

            <View className={`absolute inset-x-0 items-center px-6 ${isCompact ? 'top-[126px]' : 'top-[188px]'}`}>
              <Text
                className={`text-center font-poppinsSemi ${
                  isCompact ? 'text-[18px] leading-[24px]' : 'text-[22px] leading-[30px]'
                }`}
                style={{ color: colors.textPrimary }}
              >
                {currentExercise.title}
              </Text>
              <Text
                className={`mt-3 text-center font-poppinsRegular ${
                  isCompact ? 'text-[13px] leading-[22px]' : 'text-[15px] leading-[28px]'
                }`}
                style={{ color: colors.textSecondary, maxWidth: isCompact ? 260 : 290 }}
              >
                {currentExercise.description}
              </Text>
            </View>

            <View className={`absolute inset-x-0 items-center px-6 ${isCompact ? 'bottom-[28px]' : 'bottom-[44px]'}`}>
              <Text
                className={`font-poppinsSemi ${isCompact ? 'text-[10px]' : 'text-[12px]'} tracking-[4px]`}
                style={{ color: isDark ? 'rgba(245,245,232,0.42)' : 'rgba(130,147,154,0.62)' }}
              >
                {currentExercise.caption}
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={240}>
          <View className="mt-auto gap-3 pb-1">
            {strokes.length > 0 ? (
              <Pressable onPress={resetCurrentExercise}>
                <Text
                  className="text-center font-poppinsMedium text-[13px]"
                  style={{ color: colors.textMuted }}
                >
                  Reset trace
                </Text>
              </Pressable>
            ) : null}

            <AppButton
              disabled={!canFinishExercise}
              label={buttonLabel}
              onPress={finishExercise}
              style={{
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.22,
                shadowRadius: 18,
              }}
              trailing={<ArrowRight color="#FEFEE5" size={20} strokeWidth={2.2} />}
            />
          </View>
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}
