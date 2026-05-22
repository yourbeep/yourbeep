import { useEffect, useMemo, useState } from 'react';
import { ImageSourcePropType, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Search, SlidersHorizontal } from 'lucide-react-native';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { VideoLessonCard } from '@/features/videos/components/video-lesson-card';
import { appImages } from '@/constants/images';
import { fetchCourseContent, fetchCourses } from '@/lib/api';
import type { CourseContentResponse, CourseSummaryItem } from '@/lib/api';
import { logger } from '@/lib/logger';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

const normalize = (value?: string | null) =>
  (value ?? '')
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const formatDuration = (durationMinutes?: number | null) => {
  if (durationMinutes && durationMinutes > 0) {
    return `${String(durationMinutes).padStart(2, '0')}:00`;
  }

  return '--:--';
};

const getCourseImage = (index: number) => {
  if (index % 3 === 0) {
    return appImages.courseMeditationIllustration;
  }

  if (index % 3 === 1) {
    return appImages.courseExerciseIllustration;
  }

  return appImages.courseTaskListIllustration;
};

type AggregatedVideoItem = {
  contentItemId: string;
  courseId: string;
  courseTitle: string;
  duration: string;
  order: number;
  progress: number;
  source: ImageSourcePropType;
  title: string;
  videoId: string;
};

export function VideosScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const isAuthReady = useAppSelector((state) => state.auth.isReady);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [courses, setCourses] = useState<CourseSummaryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoItems, setVideoItems] = useState<AggregatedVideoItem[]>([]);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    let active = true;

    void (async () => {
      try {
        const data = await fetchCourses();

        if (active) {
          setCourses(data.courses);
        }
      } catch (error) {
        logger.error('VIDEO', '✗ failed to load courses for videos tab', {
          error: error instanceof Error ? error.message : error,
        });

        if (active) {
          setCourses([]);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthReady]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (!isAuthenticated) {
      setVideoItems([]);
      setVideoError('Sign in to load available course videos.');
      return;
    }

    if (courses.length === 0) {
      setVideoItems([]);
      setVideoError(null);
      return;
    }

    let active = true;

    void (async () => {
      try {
        const results = await Promise.all(
          courses.map(async (course, index) => {
            try {
              const content = await fetchCourseContent(course._id);
              return { content, course, index };
            } catch (error) {
              logger.warn('VIDEO', 'course content unavailable on videos tab', {
                courseId: course._id,
                courseTitle: course.title,
                error: error instanceof Error ? error.message : error,
              });
              return null;
            }
          }),
        );

        if (!active) {
          return;
        }

        const aggregated = results
          .filter((entry): entry is { content: CourseContentResponse; course: CourseSummaryItem; index: number } => Boolean(entry))
          .flatMap(({ content, course, index }) =>
            content.contentItems
              .filter((item) => item.type === 'video')
              .map((item) => ({
                contentItemId: item._id,
                courseId: course._id,
                courseTitle: course.title,
                duration: formatDuration(item.durationMinutes),
                order: item.order,
                progress:
                  item.userStatus === 'completed'
                    ? 100
                    : item.userStatus === 'in_progress'
                      ? 45
                      : 0,
                source: course.thumbnail ? { uri: course.thumbnail } : getCourseImage(index),
                title: item.title,
                videoId: item.videoId ?? item.refId ?? item._id,
              }))
          )
          .sort((left, right) => {
            const byCourse = left.courseTitle.localeCompare(right.courseTitle);
            return byCourse !== 0 ? byCourse : left.order - right.order;
          });

        logger.info(
          'VIDEO',
          `videos tab resolved ${aggregated.length} video(s) across ${courses.length} course(s)`,
          aggregated.map((item) => ({
            courseId: item.courseId,
            courseTitle: item.courseTitle,
            videoId: item.videoId,
          })),
        );

        setVideoItems(aggregated);
        setVideoError(
          aggregated.length === 0
            ? 'No available course videos were returned for this account.'
            : null,
        );
      } catch (error) {
        if (!active) {
          return;
        }

        logger.error('VIDEO', '✗ failed to aggregate videos for videos tab', {
          error: error instanceof Error ? error.message : error,
        });
        setVideoItems([]);
        setVideoError(
          error instanceof Error ? error.message : 'Could not load available videos.',
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [courses, isAuthReady, isAuthenticated]);

  const filteredVideos = useMemo(() => {
    const query = normalize(searchQuery);

    if (!query) {
      return videoItems;
    }

    return videoItems.filter((item) =>
      normalize(`${item.title} ${item.courseTitle}`).includes(query),
    );
  }, [searchQuery, videoItems]);

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell activeRoute="/videos" onTabNavigate={(route) => router.replace(route)}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.replace('/home')} subtitle="" title="Video Library" />
        </AnimatedReveal>

        <AnimatedReveal delay={120}>
          <View className="mt-2 gap-2 px-1">
            <Text
              className="font-poppinsSemi text-[24px]"
              style={{ color: isDark ? colors.textPrimary : colors.primary }}
            >
              Video Library
            </Text>
            <Text
              className="font-poppinsRegular text-[15px] leading-[24px]"
              style={{ color: colors.textSecondary }}
            >
              Browse all available course videos from one place.
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
                  placeholder="Search videos or courses..."
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
          </View>
        </AnimatedReveal>

        {videoError ? (
          <AnimatedReveal delay={240}>
            <View
              className="rounded-[18px] border p-4"
              style={{ backgroundColor: colors.surface, borderColor: colors.primaryBorder }}
            >
              <Text
                className="font-poppinsSemi text-[16px]"
                style={{ color: isDark ? colors.textPrimary : colors.primary }}
              >
                Videos unavailable
              </Text>
              <Text
                className="mt-2 font-poppinsRegular text-[14px] leading-[22px]"
                style={{ color: colors.textSecondary }}
              >
                {videoError}
              </Text>
            </View>
          </AnimatedReveal>
        ) : null}

        <View className="gap-3 px-1">
          {filteredVideos.map((item, index) => (
            <AnimatedReveal delay={280 + index * 50} key={`${item.courseId}-${item.contentItemId}`}>
              <VideoLessonCard
                duration={item.duration}
                onPress={() =>
                  router.push({
                    pathname: '/video/[videoId]',
                    params: {
                      contentItemId: item.contentItemId,
                      courseId: item.courseId,
                      duration: item.duration,
                      title: item.title,
                      videoId: item.videoId,
                    },
                  })
                }
                progress={item.progress}
                source={item.source}
                tag={item.courseTitle}
                title={item.title}
              />
            </AnimatedReveal>
          ))}
        </View>

        {!videoError && filteredVideos.length === 0 ? (
          <AnimatedReveal delay={320}>
            <Text
              className="px-1 font-poppinsRegular text-[14px]"
              style={{ color: colors.textSecondary }}
            >
              No videos matched this search.
            </Text>
          </AnimatedReveal>
        ) : null}
      </MainAppShell>
    </>
  );
}
