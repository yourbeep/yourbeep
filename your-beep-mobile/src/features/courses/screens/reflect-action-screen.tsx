import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronDown, ChevronRight, Infinity as InfinityIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { AppButton } from '@/components/ui/app-button';
import {
  getReflectRecommendationContent,
  getReflectFocusContent,
  reflectFocusEntries,
  reflectRecommendationEntries,
  ReflectActionCode,
  ReflectFocusAreaId,
} from '@/features/courses/data/reflect-and-act-content';
import { fetchCourseSubmissions, fetchGameResult, submitGame } from '@/lib/api';
import { useAppTheme } from '@/theme/use-app-theme';

function isReflectFocusId(value: string): value is ReflectFocusAreaId {
  return reflectFocusEntries.some((entry) => entry.id === value);
}

const acceptancePreview = require('../../../../assets/reflect&act/acceptance.png');

function ProtocolRow({
  accentColor,
  body,
  title,
}: {
  accentColor: string;
  body: string;
  title: string;
}) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row gap-4">
      <View className="items-center">
        <View className="mt-1 h-7 w-[3px] rounded-full" style={{ backgroundColor: accentColor }} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="font-poppinsSemi text-[15px] leading-[22px]" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
        <Text className="mt-1 font-poppinsRegular text-[14px] leading-[25px]" style={{ color: colors.textSecondary }}>
          {body}
        </Text>
      </View>
    </View>
  );
}

function RecommendationCard({
  active,
  body,
  onPress,
  title,
}: {
  active?: boolean;
  body: string;
  onPress?: () => void;
  title: string;
}) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      className="rounded-[22px] border px-4 py-4"
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderColor: active ? colors.primary : colors.primaryBorder,
        borderWidth: active ? 1.4 : 1,
      }}
    >
      <LinearGradient
        className="overflow-hidden rounded-[16px] px-4 py-4"
        colors={isDark ? ['#2D3E47', '#243038'] : ['#FFF3DB', '#F6D7A6']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      >
        <Image className="h-[116px] w-full rounded-[14px]" resizeMode="cover" source={acceptancePreview} />
      </LinearGradient>

      <Text className="mt-4 font-poppinsSemi text-[17px] leading-[24px]" style={{ color: colors.textPrimary }}>
        {title}
      </Text>
      <Text className="mt-2 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
        {body}
      </Text>

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="font-poppinsSemi text-[11px] tracking-[0.8px]" style={{ color: colors.primary }}>
          View Recommendation
        </Text>
        <ChevronRight color={colors.primary} size={16} strokeWidth={2.1} />
      </View>
    </Pressable>
  );
}

function humanizeAction(value: ReflectActionCode | null) {
  if (!value) {
    return 'Pending';
  }

  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function isReflectActionCode(value: unknown): value is ReflectActionCode {
  return (
    value === 'acceptance' ||
    value === 'transfer' ||
    value === 'remediation' ||
    value === 'redesign' ||
    value === 'no_action'
  );
}

export function ReflectActionScreen() {
  const params = useLocalSearchParams<{ courseId?: string; focus?: string; gameId?: string }>();
  const { colors, isDark } = useAppTheme();
  const initialFocusId =
    typeof params.focus === 'string' && isReflectFocusId(params.focus) ? params.focus : 'somatics';
  const [selectedFocusId, setSelectedFocusId] = useState<ReflectFocusAreaId>(initialFocusId);
  const [showDropdown, setShowDropdown] = useState(false);
  const [reflectResult, setReflectResult] = useState<Record<string, unknown> | null>(null);
  const [resultState, setResultState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [finalCourseScore, setFinalCourseScore] = useState<string | null>(null);

  const effectiveCourseId = params.courseId ? String(params.courseId) : undefined;
  const effectiveGameId = params.gameId ? String(params.gameId) : undefined;

  useEffect(() => {
    if (typeof params.focus === 'string' && isReflectFocusId(params.focus)) {
      setSelectedFocusId(params.focus);
    }
  }, [params.focus]);

  useEffect(() => {
    if (!effectiveGameId || resultState !== 'idle') {
      return;
    }

    void (async () => {
      setResultState('loading');
      setResultMessage(null);

      try {
        const response = await fetchGameResult(effectiveGameId);
        setReflectResult(
          response && typeof response === 'object'
            ? (response as Record<string, unknown>)
            : null,
        );
        setResultState('success');
      } catch (error) {
        setResultMessage(
          error instanceof Error && error.message
            ? error.message
            : 'We could not load the backend recommendation right now.',
        );
        setResultState('error');
      }
    })();
  }, [effectiveGameId, resultState]);

  const selectedFocus = useMemo(() => getReflectFocusContent(selectedFocusId), [selectedFocusId]);
  const recommendedAction = isReflectActionCode(reflectResult?.recommendedAction)
    ? reflectResult.recommendedAction
    : null;
  const selectedRecommendation = getReflectRecommendationContent(recommendedAction ?? 'acceptance');
  const actionDescription =
    typeof reflectResult?.actionDescription === 'string'
      ? reflectResult.actionDescription
      : selectedRecommendation.description;
  const canSubmit = Boolean(effectiveCourseId && effectiveGameId && recommendedAction);
  const selectedProtocolTitle =
    selectedFocusId === 'somatics'
      ? `Somatic ${selectedRecommendation.previewTitle}`
      : `${selectedFocus.label.replace(/^./, (value) => value.toUpperCase())} ${selectedRecommendation.previewTitle}`;

  const handleCompleteReflect = async () => {
    if (!effectiveCourseId || !effectiveGameId || !recommendedAction || submitState === 'submitting') {
      return;
    }

    setSubmitState('submitting');
    setSubmitMessage(null);

    try {
      await submitGame(effectiveGameId, {
        courseId: effectiveCourseId,
        payload: {
          acknowledgedAction: recommendedAction,
          userReflectionNotes: selectedFocus.protocolTitle,
        },
        type: 'reflect_act',
      });

      if (effectiveCourseId) {
        const submissions = await fetchCourseSubmissions(effectiveCourseId);
        if (submissions.finalCourseScore) {
          setFinalCourseScore(
            `${submissions.finalCourseScore.finalScore}/${submissions.finalCourseScore.scaleMax}`,
          );
        }
      }

      setSubmitState('success');
    } catch (error) {
      setSubmitMessage(
        error instanceof Error && error.message
          ? error.message
          : 'We could not complete the reflect phase right now.',
      );
      setSubmitState('error');
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.back()} subtitle="" title="Act" />
        </AnimatedReveal>

        <AnimatedReveal delay={90}>
          <View className="items-center gap-2 px-1">
            <Text className="text-center font-poppinsSemi text-[28px] leading-[34px]" style={{ color: colors.textPrimary }}>
              Action Pathways
            </Text>
            <Text className="text-center font-poppinsRegular text-[15px] leading-[24px]" style={{ color: colors.textSecondary, maxWidth: 308 }}>
              Translating insights into behavioral intelligence
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={120}>
          <View className="gap-3 px-1">
            {resultState === 'loading' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Loading backend recommendation...
              </Text>
            ) : resultState === 'error' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
                {resultMessage ?? 'We could not load the backend recommendation right now.'}
              </Text>
            ) : !effectiveGameId ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Backend reflect game context is missing, so this action path is showing local guidance only.
              </Text>
            ) : resultState === 'success' && recommendedAction ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.accent }}>
                Backend recommendation ready: {humanizeAction(recommendedAction)}.
              </Text>
            ) : null}

            {submitState === 'success' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.accent }}>
                Reflect phase saved to your course progress.
              </Text>
            ) : null}

            {submitState === 'success' && finalCourseScore ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.accent }}>
                Final course score: {finalCourseScore}
              </Text>
            ) : submitState === 'submitting' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Completing your reflect phase...
              </Text>
            ) : submitState === 'error' ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: '#E45B38' }}>
                {submitMessage ?? 'We could not complete the reflect phase right now.'}
              </Text>
            ) : null}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={150}>
          <View
            className="rounded-[28px] px-4 py-4 shadow-brand"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.primaryBorder,
              borderWidth: 1,
            }}
          >
            <LinearGradient
              className="overflow-hidden rounded-[18px] px-5 py-5"
              colors={isDark ? ['#3E3427', '#5C4A33', '#776040'] : ['#F7E7C7', '#F2D4A0', '#E8BF79']}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
            >
              <Image className="h-[116px] w-full rounded-[16px]" resizeMode="cover" source={acceptancePreview} />

              <View className="mt-4">
                <View className="items-end">
                  <Text className="font-poppinsSemi text-[14px] italic text-[rgba(66,47,21,0.88)]">
                    {selectedRecommendation.heroEyebrow}
                  </Text>
                </View>

                <View className="mt-3 w-[80%]">
                  <Text className="font-poppinsSemi text-[26px] leading-[30px] text-[#422F15]">
                    {selectedRecommendation.previewTitle}
                  </Text>
                  <Text className="mt-2 font-poppinsRegular text-[12px] leading-[20px] text-[rgba(66,47,21,0.88)]">
                    {actionDescription}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            <Text className="mt-4 font-poppinsSemi text-[18px] leading-[24px]" style={{ color: colors.textPrimary }}>
              {selectedRecommendation.previewTitle}
            </Text>
            <Text className="mt-2 font-poppinsRegular text-[14px] leading-[24px]" style={{ color: colors.textSecondary }}>
              {selectedRecommendation.previewBody}
            </Text>

            <Pressable
              className="mt-5 flex-row items-center justify-between"
              onPress={() => setShowDropdown((current) => !current)}
            >
              <Text className="font-poppinsSemi text-[12px] tracking-[0.8px]" style={{ color: colors.textPrimary }}>
                View Recommendation
              </Text>
              <ChevronDown
                color={colors.textSecondary}
                size={16}
                strokeWidth={2.1}
                style={showDropdown ? { transform: [{ rotate: '180deg' }] } : undefined}
              />
            </Pressable>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={220}>
          <View className="px-1">
            <Text className="font-poppinsSemi text-[26px] leading-[32px]" style={{ color: colors.textPrimary }}>
              {selectedProtocolTitle}
            </Text>
            <Text className="mt-2 font-poppinsRegular text-[15px] leading-[27px]" style={{ color: colors.textSecondary }}>
              {selectedRecommendation.description} {selectedFocus.how}
            </Text>

            <Text className="mt-7 font-poppinsSemi text-[20px] leading-[28px]" style={{ color: colors.textPrimary }}>
              Protocol Details
            </Text>

            <View
              className="mt-5 gap-5 rounded-[24px] px-5 py-5"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.primaryBorder,
                borderWidth: 1,
              }}
            >
              <ProtocolRow
                accentColor="#58E7DA"
                body={selectedRecommendation.indicators.join('\n')}
                title="Indicators"
              />
              <ProtocolRow
                accentColor="#C9C6FF"
                body={selectedRecommendation.framework.join('\n')}
                title="Framework"
              />
              <ProtocolRow
                accentColor="#FFB451"
                body={selectedRecommendation.outcomes.join('\n')}
                title="Expected Outcome"
              />
            </View>

            <View className="mt-6 rounded-[16px] px-4 py-4" style={{ backgroundColor: colors.accentSoft }}>
              <View className="flex-row items-center gap-2">
                <InfinityIcon color={colors.primary} size={16} strokeWidth={2} />
                <Text className="font-poppinsSemi text-[11px] tracking-[0.8px]" style={{ color: colors.textPrimary }}>
                  SYSTEM NOTE
                </Text>
              </View>
              <Text className="mt-3 font-poppinsRegular text-[14px] leading-[25px]" style={{ color: colors.textSecondary }}>
                {selectedFocus.note}
              </Text>
            </View>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={300}>
          <View className="relative">
            {showDropdown ? (
              <View className="mt-1 gap-4">
                {reflectRecommendationEntries
                  .filter((entry) => entry.code !== 'no_action')
                  .map((entry) => (
                    <RecommendationCard
                      active={entry.code === selectedRecommendation.code}
                      body={entry.previewBody}
                      key={entry.code}
                      onPress={() => {
                        setReflectResult((current) => ({
                          ...(current ?? {}),
                          actionDescription: entry.description,
                          recommendedAction: entry.code,
                        }));
                        setShowDropdown(false);
                      }}
                      title={entry.previewTitle}
                    />
                  ))}
              </View>
            ) : null}
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={360}>
          <AppButton
            disabled={!canSubmit || resultState === 'loading' || submitState === 'submitting'}
            label="Complete Reflect Phase"
            onPress={() => {
              void handleCompleteReflect();
            }}
            variant="primary"
          />
        </AnimatedReveal>

        <AnimatedReveal delay={420}>
          <AppButton
            label="Return to Course"
            onPress={() =>
              router.replace({
                pathname: '/behavioural-signal-intelligence',
                params: effectiveCourseId ? { courseId: effectiveCourseId } : undefined,
              })
            }
            variant="secondary"
          />
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}
