import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ExternalLink } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AppButton } from '@/components/ui/app-button';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { useAwarenessFlow } from '@/features/awareness/context/awareness-flow-context';
import {
  buildBehaviouralModules,
  resolveBehaviouralModuleGameId,
} from '@/features/courses/data/behavioural-course-flow';
import { CourseCard } from '@/features/courses/components/course-card';
import { resetSomaticFlow } from '@/features/somatic/store/somatic-slice';
import { fetchCourseContent, fetchCourseDetail } from '@/lib/api';
import { fetchCoursePrice, fetchCoursePriceForRegion } from '@/lib/api';
import type { CourseContentResponse, CourseDetailResponse, CoursePricingResponse } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

export function BehaviouralSignalIntelligenceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId?: string }>();
  const dispatch = useAppDispatch();
  const { resetFlow } = useAwarenessFlow();
  const { colors, isDark } = useAppTheme();
  const isAuthReady = useAppSelector((state) => state.auth.isReady);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isCourseContentLoading, setIsCourseContentLoading] = useState(false);
  const [isCourseDetailLoading, setIsCourseDetailLoading] = useState(false);
  const [courseDetail, setCourseDetail] = useState<CourseDetailResponse | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContentResponse | null>(null);
  const [coursePricing, setCoursePricing] = useState<CoursePricingResponse | null>(null);

  useEffect(() => {
    if (!params.courseId || !isAuthReady) {
      return;
    }

    let active = true;
    setIsCourseDetailLoading(true);

    void (async () => {
      try {
        const data = await fetchCourseDetail(String(params.courseId));

        if (active) {
          setCourseDetail(data);
        }
      } catch {
        if (active) {
          setCourseDetail(null);
        }
      } finally {
        if (active) {
          setIsCourseDetailLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthReady, params.courseId]);

  useEffect(() => {
    if (!params.courseId || !isAuthReady) {
      return;
    }

    let active = true;

    void (async () => {
      try {
        const region = courseDetail?.pricing?.region;
        const data = region
          ? await fetchCoursePriceForRegion(String(params.courseId), region)
          : await fetchCoursePrice(String(params.courseId));

        if (active) {
          setCoursePricing(data);
        }
      } catch {
        if (active) {
          setCoursePricing(null);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [courseDetail?.pricing?.region, isAuthReady, params.courseId]);

  useEffect(() => {
    if (!params.courseId || !isAuthReady) {
      return;
    }

    if (!isAuthenticated) {
      setCourseContent(null);
      setIsCourseContentLoading(false);
      return;
    }

    let active = true;
    setIsCourseContentLoading(true);

    void (async () => {
      try {
        const data = await fetchCourseContent(String(params.courseId));

        if (active) {
          setCourseContent(data);
        }
      } catch {
        if (active) {
          setCourseContent(null);
        }
      } finally {
        if (active) {
          setIsCourseContentLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthReady, isAuthenticated, params.courseId]);

  const courseTitle = courseDetail?.title ?? 'Behavioural Signal Intelligence';
  const courseDescription = 
    courseDetail?.description ??
    'Begin your self-reflection journey by harmonizing your somatic sensations with emotional clarity.';
  const modules = useMemo(
    () => buildBehaviouralModules(courseContent, courseDetail),
    [courseContent, courseDetail],
  );
  const resolvedModules = useMemo(
    () =>
      modules.map((module) => ({
        ...module,
        gameId: resolveBehaviouralModuleGameId(courseDetail, module.type, module.gameId),
      })),
    [courseDetail, modules],
  );

  const openModule = (route: string, gameId?: string, contentItemId?: string) => {
    if (route === '/awareness-states') {
      resetFlow();
    }

    if (route === '/somatic-states') {
      dispatch(resetSomaticFlow());
    }

    router.push({
      params: {
        contentItemId,
        courseId: params.courseId,
        gameId,
      },
      pathname: route,
    });
  };

  const startModule =
    resolvedModules.find((module) => module.route === '/awareness-states') ?? resolvedModules[0];
  const hasCourseContext = Boolean(params.courseId);
  const isAwaitingAuth = hasCourseContext && !isAuthReady;
  const isCourseLoading = isCourseContentLoading || isCourseDetailLoading;
  const startAssessmentReady = Boolean(params.courseId && startModule?.gameId);
  const startAssessmentEnabled = !isAwaitingAuth && !isCourseLoading && (!hasCourseContext || startAssessmentReady);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.replace('/courses')} subtitle="" title="Courses" />
        </AnimatedReveal>

        <AnimatedReveal delay={110}>
          <View className="gap-4 px-1">
            <Text className="font-poppinsSemi text-[30px] leading-[44px]" style={{ color: colors.textPrimary }}>
              Welcome to <Text style={{ color: colors.accent, fontStyle: 'italic', fontWeight: 'bold' }}>{courseTitle}</Text>
            </Text>

            <Text className="font-poppinsRegular text-[15px] leading-[28px]" style={{ color: colors.textSecondary }}>
              {courseDescription}
            </Text>

            {coursePricing ? (
              <View
                className="self-start rounded-[18px] border px-4 py-3"
                style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
              >
                <Text className="font-poppinsSemi text-[12px]" style={{ color: colors.primary }}>
                  Regional Pricing • {coursePricing.region}
                </Text>
                <Text className="mt-1 font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                  6 months {coursePricing.displayPrice6mo} • 1 year {coursePricing.displayPrice1yr}
                </Text>
              </View>
            ) : null}
          </View>
        </AnimatedReveal>

        <View className="flex-row flex-wrap justify-between gap-y-5">
          {resolvedModules.map((item, index) => {
            const moduleReady = Boolean(item.route && (!hasCourseContext || item.gameId));

            return (
              <AnimatedReveal
                delay={190 + index * 70}
                key={`${item.type}-${item.gameId ?? item.title}`}
                style={{ width: '47%' }}
              >
                <CourseCard
                  description={item.description}
                  heightClassName="min-h-[196px]"
                  imageClassName="h-[64px] w-[64px]"
                  imageSource={item.imageSource}
                  onPress={
                    item.route && moduleReady
                      ? () => openModule(item.route, item.gameId, item.contentItemId)
                      : undefined
                  }
                  roundedClassName="rounded-[48px]"
                  title={item.title}
                  tone={item.tone}
                  widthClassName="w-full"
                />
              </AnimatedReveal>
            );
          })}
        </View>

        <AnimatedReveal delay={520}>
          <View className="gap-3">
            {!hasCourseContext ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Live course mapping is unavailable right now. You can still open the activities locally.
              </Text>
            ) : isAwaitingAuth || isCourseLoading ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Loading course activities...
              </Text>
            ) : !startAssessmentReady ? (
              <Text className="font-poppinsRegular text-[13px]" style={{ color: colors.textSecondary }}>
                Assessment flow is still syncing with backend course games. Please wait a moment and reopen this course.
              </Text>
            ) : null}

            <AppButton
              className="mt-2 flex-row gap-3"
              label="Start Assessment"
              disabled={!startAssessmentEnabled}
              onPress={() => {
                openModule(startModule.route, startModule.gameId, startModule.contentItemId);
              }}
              variant="primary"
            />
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={600}>
          <View className="items-center">
            <View className="flex-row items-center gap-1">
              <Text className="font-poppinsMedium text-[15px]" style={{ color: isDark ? colors.textSecondary : '#7B684D' }}>
                Learn More
              </Text>
              <ExternalLink color={isDark ? colors.textSecondary : '#7B684D'} size={15} strokeWidth={1.9} />
            </View>
          </View>
        </AnimatedReveal>
      </MainAppShell>
    </>
  );
}
