import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

export interface BreathingTubePhase {
  darkColor: string;
  duration: number;
  id: string;
  label: string;
  lightColor: string;
}

interface BreathingTubeSequenceProps {
  activePhaseIdx: number;
  manualPhase: number | null;
  manualStartTime: number | null;
  onTubePress: (phaseIdx: number) => void;
  phases: readonly BreathingTubePhase[];
  progress: number;
}

const BALL_SIZE = 42;
const TUBE_HEIGHT = 112;
const TUBE_WIDTH = 50;
const TUBE_PADDING = 8;
const TRACK_HEIGHT = TUBE_HEIGHT - BALL_SIZE - TUBE_PADDING * 2;
const BOB_RANGE = 18;

function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function BreathingTubeSequence({
  activePhaseIdx,
  manualPhase,
  manualStartTime,
  onTubePress,
  phases,
  progress,
}: BreathingTubeSequenceProps) {
  const { colors } = useAppTheme();

  const getBallPosition = (phaseIdx: number) => {
    if (manualPhase === phaseIdx && manualStartTime) {
      const manualElapsedSeconds = (Date.now() - manualStartTime) / 1000;
      const manualProgress = clampProgress(manualElapsedSeconds / phases[phaseIdx].duration);
      const restOffset = TRACK_HEIGHT * 0.72;
      return restOffset - Math.sin(manualProgress * Math.PI) * BOB_RANGE;
    }

    if (activePhaseIdx === phaseIdx) {
      const restOffset = TRACK_HEIGHT * 0.72;
      return restOffset - Math.sin(clampProgress(progress) * Math.PI) * BOB_RANGE;
    }

    return TRACK_HEIGHT * 0.72;
  };

  return (
    <View className="relative self-center py-1" style={{ width: 248 }}>
      <View className="gap-6">
        {phases.map((phase, index) => {
          const isActive = activePhaseIdx === index || manualPhase === index;
          const ballPosition = getBallPosition(index);

          return (
            <Pressable
              className="w-full flex-row items-center gap-5"
              key={phase.id}
              onPress={() => onTubePress(index)}
            >
              <View
                className="relative overflow-hidden rounded-full"
                style={{
                  width: TUBE_WIDTH,
                  height: TUBE_HEIGHT,
                  backgroundColor: phase.lightColor,
                  opacity: isActive ? 1 : 0.56,
                  shadowColor: manualPhase === index ? phase.lightColor : 'transparent',
                  shadowOpacity: manualPhase === index ? 0.7 : 0,
                  shadowRadius: manualPhase === index ? 14 : 0,
                }}
              >
                <View
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: phase.darkColor,
                    height: BALL_SIZE,
                    left: (TUBE_WIDTH - BALL_SIZE) / 2,
                    opacity: isActive ? 1 : 0,
                    top: TUBE_PADDING + ballPosition,
                    width: BALL_SIZE,
                  }}
                />
              </View>

              <Text
                className="font-poppinsSemi text-[18px]"
                style={{ color: isActive ? colors.textPrimary : colors.textMuted }}
              >
                {phase.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
