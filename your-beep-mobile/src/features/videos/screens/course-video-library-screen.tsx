import { useEffect, useMemo, useState } from 'react';
import { FlatList, ImageBackground, Pressable, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Search, SlidersHorizontal } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { FilterChip } from '@/features/videos/components/filter-chip';
import { VideoLessonCard } from '@/features/videos/components/video-lesson-card';
import { featuredVideo, videoSections } from '@/features/videos/data/videos-content';
import {
  fetchCourseContent,
  fetchCourseDetail,
  fetchUserDashboard,
  fetchUserProgress,
} from '@/lib/api';
import type {
  CourseContentResponse,
  CourseDetailResponse,
  CurrentUserDashboard,
  CurrentUserProgressResponse,
} from '@/lib/api';
import { logger } from '@/lib/logger';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

const formatDuration = (durationSeconds?: number | null, durationMinutes?: number | null) => {
  if (durationSeconds && durationSeconds > 0) {
    const totalMinutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${String(totalMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  if (durationMinutes && durationMinutes > 0) {
    return `${String(durationMinutes).padStart(2, '0')}:00`;
  }

  return '--:--';
};

const normalize = (value?: string | null) =>
  (value ?? '')
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getModuleLabel = (title: string) => {
  const matched = title.match(/module\s*\d+/i);

  if (matched) {
    return matched[0].replace(/\s+/g, ' ');
  }

  const decimalMatch = title.match(/(\d+)\.(\d+)/);

  if (decimalMatch) {
    return `Module ${decimalMatch[1]}`;
  }

  return 'All Modules';
};

export function CourseVideoLibraryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId?: string }>();
  const { colors, isDark } = useAppTheme();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isAuthReady = useAppSelector((state) => state.auth.isReady);
  const [courseDetail, setCourseDetail] = useState<CourseDetailResponse | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContentResponse | null>(null);
  const [courseContentError, setCourseContentError] = useState<string | null>(null);
  const [userDashboard, setUserDashboard] = useState<CurrentUserDashboard | null>(null);
  const [userProgress, setUserProgress] = useState<CurrentUserProgressResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All Modules');

  const openVideo = (item: {
    contentItemId?: string;
    courseId: string;
    duration: string;
    title: string;
    videoId: string;
    progress?: number;
  }) => {
    logger.info('VIDEO', '── opening video', {
      videoId: item.videoId,
      courseId: item.courseId,
      contentItemId: item.contentItemId ?? null,
      title: item.title,
    });

    if (!item.videoId) {
      logger.error('VIDEO', '✗ videoId is empty — stream will 404', item);
    }
    if (!item.courseId) {
      logger.error('VIDEO', '✗ courseId is empty — stream will 404', item);
    }

    router.push({
      pathname: '/video/[videoId]',
      params: {
        videoId: item.videoId,
        contentItemId: item.contentItemId,
        courseId: item.courseId,
        duration: item.duration,
        ...(typeof item.progress === 'number' ? { progress: String(item.progress) } : {}),
        title: item.title,
      },
    });
  };

  useEffect(() => {
    if (!params.courseId || !isAuthReady) {
      return;
    }

    let active = true;

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
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthReady, params.courseId]);

  useEffect(() => {
    if (!params.courseId || !isAuthReady || !isAuthenticated) {
      if (!isAuthenticated) {
        setCourseContent(null);
        setCourseContentError('Sign in to load course videos.');
      }
      return;
    }

    let active = true;

    void (async () => {
      try {
        const data = await fetchCourseContent(String(params.courseId));

        if (active) {
          setCourseContent(data);
          setCourseContentError(null);
        }
      } catch (error) {
        logger.error('VIDEO', '✗ failed to load course content', {
          courseId: params.courseId,
          error: error instanceof Error ? error.message : error,
        });

        if (active) {
          setCourseContent(null);
          setCourseContentError(
            error instanceof Error
              ? error.message
              : 'Could not load course videos for this course.',
          );
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthReady, isAuthenticated, params.courseId]);

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) {
      return;
    }

    let active = true;

    void (async () => {
      try {
        const [dashboardData, progressData] = await Promise.all([
          fetchUserDashboard(),
          fetchUserProgress(),
        ]);

        if (active) {
          setUserDashboard(dashboardData);
          setUserProgress(progressData);
        }
      } catch {
        if (active) {
          setUserDashboard(null);
          setUserProgress(null);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthReady, isAuthenticated]);

  const videoItems = useMemo(() => {
    const contentItems = courseContent?.contentItems ?? courseDetail?.contentItems ?? [];

    logger.debug('VIDEO', `resolving videoItems from ${contentItems.length} content items`, {
      source: courseContent ? 'courseContent' : courseDetail ? 'courseDetail' : 'none',
      courseId: params.courseId ?? null,
    });

    const items = contentItems
      .filter((item) => item.type === 'video')
      .map((item, index) => {
        const label = getModuleLabel(item.title);
        const resolvedVideoId = 'videoId' in item ? item.videoId ?? item.refId ?? item._id : item.refId ?? item._id;

        logger.debug('VIDEO', `  item[${index}] "${item.title}"`, {
          _id: item._id,
          refId: item.refId,
          videoId: 'videoId' in item ? item.videoId : '(no videoId field)',
          resolvedVideoId,
        });

        return {
          contentItemId: item._id,
          courseId: String(params.courseId ?? ''),
          duration: formatDuration(undefined, item.durationMinutes ?? null),
          id: resolvedVideoId,
          moduleLabel: label,
          order: item.order,
          progress: item.userStatus === 'completed' ? 100 : item.userStatus === 'in_progress' ? 45 : 0,
          source:
            courseDetail?.thumbnail
              ? { uri: courseDetail.thumbnail }
              : index % 2 === 0
                ? featuredVideo.source
                : videoSections[1].items[0].source,
          title: item.title,
          videoId: resolvedVideoId,
        };
      })
      .sort((left, right) => left.order - right.order);

    logger.info('VIDEO', `videoItems resolved — ${items.length} video(s)`, items.map((v) => ({ videoId: v.videoId, title: v.title })));
    return items;
  }, [courseContent, courseDetail?.contentItems, courseDetail?.thumbnail, params.courseId]);

  const moduleFilters = useMemo(() => {
    const labels = Array.from(new Set(videoItems.map((item) => item.moduleLabel)));
    return ['All Modules', ...labels.filter((label) => label !== 'All Modules')];
  }, [videoItems]);

  const visibleItems = useMemo(() => {
    const query = normalize(searchQuery);

    return videoItems.filter((item) => {
      const matchesModule = selectedModule === 'All Modules' || item.moduleLabel === selectedModule;
      const matchesQuery =
        !query || normalize(`${item.title} ${item.moduleLabel}`).includes(query);

      return matchesModule && matchesQuery;
    });
  }, [searchQuery, selectedModule, videoItems]);

  const featuredCard = visibleItems[0] ?? null;

  const continueWatchingItems = useMemo(() => {
    const dashboardMatch = userDashboard?.continueLearning?.find(
      (course) => course.courseId === params.courseId && course.nextItem?.videoId,
    );

    if (!dashboardMatch?.nextItem?.videoId) {
      return [];
    }

    return [
      {
        contentItemId: dashboardMatch.nextItem.itemId,
        courseId: dashboardMatch.courseId,
        duration: '--:--',
        id: dashboardMatch.nextItem.videoId,
        progress: dashboardMatch.percentComplete,
        source: dashboardMatch.thumbnailUrl ? { uri: dashboardMatch.thumbnailUrl } : featuredVideo.source,
        tag: dashboardMatch.title,
        title: dashboardMatch.nextItem.title,
        videoId: dashboardMatch.nextItem.videoId,
      },
    ];
  }, [params.courseId, userDashboard]);

  const startAgainItems = useMemo(() => {
    const progressMatch = userProgress?.courses?.find((course) => course.courseId === params.courseId);

    if (!progressMatch) {
      return [];
    }

    return visibleItems.map((item) => ({
      courseId: item.courseId,
      duration: item.duration,
      id: item.id,
      progress: progressMatch.progress.percentComplete && item.order === visibleItems[0]?.order ? progressMatch.progress.percentComplete : 0,
      source: item.source,
      tag: item.moduleLabel,
      title: item.title,
      videoId: item.videoId,
      contentItemId: item.contentItemId,
    }));
  }, [params.courseId, userProgress, visibleItems]);

  const liveSections =
    continueWatchingItems.length > 0 || startAgainItems.length > 0
      ? [
          {
            id: 'continue-watching',
            items: continueWatchingItems.length > 0 ? continueWatchingItems : startAgainItems.slice(0, 1),
            title: 'Continue Watching',
          },
          {
            id: 'start-again',
            items: startAgainItems.length > 0 ? startAgainItems : visibleItems.map((item) => ({
              courseId: item.courseId,
              duration: item.duration,
              id: item.id,
              progress: item.progress,
              source: item.source,
              tag: item.moduleLabel,
              title: item.title,
              videoId: item.videoId,
              contentItemId: item.contentItemId,
            })),
            title: 'Start Again',
          },
        ]
      : [
          {
            id: 'start-again',
            items: visibleItems.map((item) => ({
              courseId: item.courseId,
              duration: item.duration,
              id: item.id,
              progress: item.progress,
              source: item.source,
              tag: item.moduleLabel,
              title: item.title,
              videoId: item.videoId,
              contentItemId: item.contentItemId,
            })),
            title: 'Video Lessons',
          },
        ];

  const courseTitle = courseDetail?.title ?? courseContent?.title ?? 'Video Library';
  const courseDescription =
    courseDetail?.description ??
    'Access high-fidelity somatic training modules and behavioral signal analyses.';

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell showBottomNav={false}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.replace('/videos')} subtitle="" title="Video Library" />
        </AnimatedReveal>

        <AnimatedReveal delay={120}>
          <View className="mt-2 gap-2 px-1">
            <Text
              className="font-poppinsSemi text-[24px]"
              style={{ color: isDark ? colors.textPrimary : colors.primary }}
            >
              {courseTitle}
            </Text>
            <Text
              className="font-poppinsRegular text-[15px] leading-[24px]"
              style={{ color: colors.textSecondary }}
            >
              {courseDescription}
            </Text>
          </View>
        </AnimatedReveal>

        <AnimatedReveal delay={180}>
          <View className="gap-4 px-1">
            <View className="flex-row items-center gap-3">
              <View
                className="h-[48px] flex-1 flex-row items-center gap-3 rounded-[15px] border px-4"
                style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
              >
                <Search color={colors.textSecondary} size={18} strokeWidth={2} />
                <TextInput
                  className="flex-1 font-poppinsRegular text-[14px]"
                  onChangeText={setSearchQuery}
                  placeholder="Search lessons, modules..."
                  placeholderTextColor={colors.textMuted}
                  style={{ color: colors.textPrimary }}
                  value={searchQuery}
                />
              </View>

              <View
                className="h-[48px] w-[48px] items-center justify-center rounded-[14px] border"
                style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
              >
                <SlidersHorizontal
                  color={isDark ? colors.textPrimary : colors.primary}
                  size={18}
                  strokeWidth={2}
                />
              </View>
            </View>

            <FlatList
              contentContainerStyle={{ columnGap: 8, paddingRight: 22 }}
              data={moduleFilters}
              horizontal
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <FilterChip
                  active={item === selectedModule}
                  label={item}
                  onPress={() => setSelectedModule(item)}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </AnimatedReveal>

        {featuredCard ? (
          <AnimatedReveal delay={220}>
            <Pressable
              onPress={() =>
                openVideo({
                  contentItemId: featuredCard.contentItemId,
                  courseId: featuredCard.courseId,
                  duration: featuredCard.duration,
                  title: featuredCard.title,
                  videoId: featuredCard.videoId,
                })
              }
            >
              <ImageBackground
                className="h-[186px] overflow-hidden rounded-[18px]"
                imageStyle={{ borderRadius: 18 }}
                resizeMode="cover"
                source={featuredCard.source}
              >
                <View className="flex-1 justify-between bg-[rgba(7,20,22,0.28)] p-4">
                  <View className="self-start rounded-full bg-[rgba(254,254,229,0.84)] px-2 py-1">
                    <Text className="font-poppinsMedium text-[10px] text-brand-success">
                      {featuredCard.moduleLabel.toUpperCase()}
                    </Text>
                  </View>

                  <View className="items-center justify-center">
                    <View className="h-[66px] w-[66px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.24)]">
                      <Text className="ml-1 font-poppinsSemi text-[28px] text-brand-textInverse">
                        ▶
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-end justify-between gap-3">
                    <Text className="max-w-[190px] font-poppinsSemi text-[22px] text-brand-textInverse">
                      {featuredCard.title}
                    </Text>
                    <Text className="font-poppinsSemi text-[12px] text-brand-textInverse">
                      {featuredCard.duration}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </Pressable>
          </AnimatedReveal>
        ) : null}

        {!featuredCard && courseContentError ? (
          <AnimatedReveal delay={260}>
            <View
              className="rounded-[18px] border p-4"
              style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
            >
              <Text
                className="font-poppinsSemi text-[16px]"
                style={{ color: isDark ? colors.textPrimary : colors.primary }}
              >
                Video library unavailable
              </Text>
              <Text
                className="mt-2 font-poppinsRegular text-[14px] leading-[22px]"
                style={{ color: colors.textSecondary }}
              >
                {courseContentError}
              </Text>
            </View>
          </AnimatedReveal>
        ) : null}

        {liveSections.map((section, sectionIndex) => (
          <View className="gap-3" key={section.id}>
            <AnimatedReveal delay={320 + sectionIndex * 110}>
              <Text
                className="font-poppinsSemi text-[22px]"
                style={{ color: isDark ? colors.textPrimary : colors.primary }}
              >
                {section.title}
              </Text>
            </AnimatedReveal>

            <View className="gap-3">
              {section.items.map((item, itemIndex) => (
                <AnimatedReveal
                  delay={390 + sectionIndex * 120 + itemIndex * 70}
                  key={`${section.id}-${item.id}-${itemIndex}`}
                >
                  <VideoLessonCard
                    duration={item.duration}
                    onPress={() =>
                      openVideo({
                        contentItemId: item.contentItemId,
                        courseId: item.courseId,
                        duration: item.duration,
                        progress: item.progress,
                        title: item.title,
                        videoId: item.videoId,
                      })
                    }
                    progress={item.progress}
                    source={item.source}
                    tag={item.tag}
                    title={item.title}
                  />
                </AnimatedReveal>
              ))}
            </View>
          </View>
        ))}
      </MainAppShell>
    </>
  );
}
