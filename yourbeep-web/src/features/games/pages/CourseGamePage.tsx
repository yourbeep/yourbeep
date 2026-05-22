import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MainPageShell from "@features/main/components/MainPageShell";
import { appRoutes } from "@constants/routes";
import AwarenessGameForm from "../awareness-states/components/AwarenessGameForm";
import GameExperienceSkeleton from "../components/GameExperienceSkeleton";
import GameExperienceHero from "../components/GameExperienceHero";
import GameResultCard from "../components/GameResultCard";
import PatternGameForm from "../pattern-awareness/components/PatternGameForm";
import ReflectGameForm from "../reflect-and-act/components/ReflectGameForm";
import SomaticGameForm from "../somatic-states/components/SomaticGameForm";
import { useCourseGameExperience } from "../hooks/useCourseGameExperience";
import showToast from "@utils/showToast";
import LessonSidebar from "@features/learning/components/LessonSidebar";

const CourseGamePage = () => {
  const navigate = useNavigate();
  const { courseId, gameId } = useParams();
  const [searchParams] = useSearchParams();
  const contentItemId = searchParams.get("contentItemId");
  const returnVideoId = searchParams.get("videoId");
  const subActivityKey = searchParams.get("subActivityKey");

  const {
    content,
    lesson,
    siblingLessons,
    existingResult,
    submission,
    loading,
    submitting,
    error,
    submit,
  } = useCourseGameExperience(courseId, gameId, contentItemId);

  const result = submission?.resultData ?? existingResult;
  const isPatternAwareness = lesson?.gameKey === "pattern_awareness";
  const shouldShowGenericResult =
    lesson?.gameKey !== "awareness_states" && lesson?.gameKey !== "somatic_states";
  const shouldShowSidebar =
    lesson?.gameKey !== "somatic_states" && lesson?.gameKey !== "pattern_awareness";

  useEffect(() => {
    if (!error) return;

    showToast({
      type: "error",
      message: "Unable to load this game experience",
      options: {
        description: error,
      },
    });
  }, [error]);

  const form = useMemo(() => {
    if (!courseId || !lesson) return null;

    switch (lesson.gameKey) {
      case "awareness_states":
        return (
          <AwarenessGameForm
            courseId={courseId}
            submitting={submitting}
            existingResult={existingResult}
            initialSubActivityKey={subActivityKey}
            onSubmit={submit}
          />
        );
      case "somatic_states":
        return (
          <SomaticGameForm
            courseId={courseId}
            gameId={lesson.gameId}
            submitting={submitting}
            contentItemId={contentItemId}
            returnVideoId={returnVideoId}
            onSubmit={submit}
          />
        );
      case "pattern_awareness":
        return (
          <PatternGameForm
            courseId={courseId}
            submitting={submitting}
            existingResult={existingResult}
            submissionResult={submission?.resultData ?? null}
            initialSubActivityKey={subActivityKey}
            onSubmit={submit}
          />
        );
      case "reflect_act":
        return (
          <ReflectGameForm
            courseId={courseId}
            submitting={submitting}
            onSubmit={submit}
          />
        );
      default:
        return null;
    }
  }, [
    contentItemId,
    courseId,
    existingResult,
    lesson,
    returnVideoId,
    subActivityKey,
    submit,
    submitting,
  ]);

  if (loading) {
    return (
      <MainPageShell activeItem="Games">
        <GameExperienceSkeleton />
      </MainPageShell>
    );
  }

  if (error || !courseId || !gameId || !lesson || !content) {
    return (
      <MainPageShell activeItem="Games">
        <div className="rounded-3xl bg-white px-8 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[#1a2e38]">
            We couldn&apos;t load this game experience.
          </p>
          <p className="mt-2 text-sm text-[#6c7a7a]">
            {error || "Game not found in this course."}
          </p>
        </div>
      </MainPageShell>
    );
  }

  return (
    <MainPageShell activeItem="Games">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <GameExperienceHero
          lesson={lesson}
          courseTitle={content.title}
          compact={isPatternAwareness}
          onBack={() =>
            navigate(
              returnVideoId
                ? appRoutes.courseVideo(courseId, returnVideoId, contentItemId || undefined)
                : appRoutes.courseLearn(courseId),
            )
          }
        />

        {isPatternAwareness ? (
          <div className="mt-4 min-w-0">{form}</div>
        ) : (
          <div
            className={`mt-8 grid gap-8 ${
              shouldShowSidebar ? "lg:grid-cols-3" : "grid-cols-1"
            }`}
          >
            <div className={`space-y-8 ${shouldShowSidebar ? "lg:col-span-2" : ""}`}>
              {form}
              {shouldShowGenericResult ? <GameResultCard result={result} /> : null}
            </div>

            {shouldShowSidebar ? (
              <div className="lg:col-span-1">
                <LessonSidebar
                  courseId={courseId}
                  content={content}
                  activeVideoId={returnVideoId || undefined}
                />
              </div>
            ) : null}
          </div>
        )}
      </motion.div>
    </MainPageShell>
  );
};

export default CourseGamePage;
