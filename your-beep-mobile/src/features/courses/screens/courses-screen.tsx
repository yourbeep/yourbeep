import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MainAppShell } from '@/components/layout/main-app-shell';
import { AppHeader } from '@/components/navigation/app-header';
import { AnimatedReveal } from '@/components/ui/animated-reveal';
import { CourseCard } from '@/features/courses/components/course-card';
import { appImages } from '@/constants/images';
import { courses } from '@/features/courses/data/courses-content';
import { fetchCourses } from '@/lib/api';
import type { CourseSummaryItem } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { useAppTheme } from '@/theme/use-app-theme';

const getCourseTone = (index: number): 'cool' | 'warm' | 'warmStrong' =>
  index % 3 === 0 ? 'warm' : index % 3 === 1 ? 'cool' : 'warmStrong';

const getCourseImage = (index: number) => {
  if (index % 3 === 0) {
    return appImages.courseMeditationIllustration;
  }

  if (index % 3 === 1) {
    return appImages.courseExerciseIllustration;
  }

  return appImages.courseTaskListIllustration;
};

export function CoursesScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  const isAuthReady = useAppSelector((state) => state.auth.isReady);
  const [courseItems, setCourseItems] = useState<CourseSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    let active = true;
    setIsLoading(true);

    void (async () => {
      try {
        const data = await fetchCourses();

        if (!active) {
          return;
        }

        setCourseItems(data.courses);
      } catch {
        if (active) {
          setCourseItems([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [isAuthReady]);

  const visibleCourses =
    courseItems.length > 0
      ? courseItems.map((item, index) => ({
          description:
            item.shortDescription?.trim() ||
            item.subtitle?.trim() ||
            `${item.gameCount} guided activities`,
          iconLabel: undefined,
          id: item._id,
          imageSource: getCourseImage(index),
          route: '/behavioural-signal-intelligence' as const,
          title: item.title,
          tone: getCourseTone(index),
          hasVideos: item.gameCount > 0,
        }))
      : courses;

  return (
    <>
      <StatusBar style="light" />
      <MainAppShell activeRoute="/courses" onTabNavigate={(route) => router.replace(route)}>
        <AnimatedReveal>
          <AppHeader onBackPress={() => router.replace('/home')} subtitle="" title="Courses" />
        </AnimatedReveal>

        <AnimatedReveal delay={120}>
          <View className="mt-2 gap-2 px-1">
            <Text
              className="font-poppinsSemi text-[24px]"
              style={{ color: isDark ? colors.textPrimary : colors.primary }}
            >
              Programs
            </Text>
            <Text
              className="font-poppinsRegular text-[15px] leading-[24px]"
              style={{ color: colors.textSecondary }}
            >
              Your current learning paths can expand here as more modules are added.
            </Text>
          </View>
        </AnimatedReveal>

        {isLoading ? (
          <AnimatedReveal delay={180}>
            <Text
              className="px-1 font-poppinsRegular text-[14px]"
              style={{ color: colors.textSecondary }}
            >
              Loading live courses...
            </Text>
          </AnimatedReveal>
        ) : null}

        <View className="flex-row flex-wrap gap-4">
          {visibleCourses.map((item, index) => {
            const route = item.route;
            const courseId = courseItems[index]?._id;
            const hasContent = item.hasVideos !== false;

            return (
              <AnimatedReveal delay={200 + index * 90} key={item.id} style={{ width: '47%' }}>
                <CourseCard
                  description={item.description}
                  iconLabel={item.iconLabel}
                  heightClassName="h-[176px]"
                  imageClassName="h-[58px] w-[58px]"
                  imageSource={item.imageSource}
                  onPress={
                    route && hasContent
                      ? () =>
                          router.push({
                            pathname: route,
                            params: courseId ? { courseId } : undefined,
                          })
                      : undefined
                  }
                  roundedClassName="rounded-[36px]"
                  title={item.title}
                  tone={item.tone}
                  widthClassName="w-full"
                />
              </AnimatedReveal>
            );
          })}
        </View>
      </MainAppShell>
    </>
  );
}
