import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MainPageShell from "@features/main/components/MainPageShell";
import { appRoutes } from "@constants/routes";
import LessonSidebar from "../components/LessonSidebar";
import VideoInfoCard from "../components/VideoInfoCard";
import VideoPlayerCard from "../components/VideoPlayerCard";
import { useVideoLesson } from "../hooks/useVideoLesson";
import type { InteractiveCue } from "../services/learningTypes";

const VideoDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId, videoId } = useParams();
  const [searchParams] = useSearchParams();
  const contentItemId = searchParams.get("contentItemId") || undefined;
  const { stream, content, activeItem, videoRef, loading, error } = useVideoLesson(
    courseId,
    videoId,
    contentItemId,
  );

  if (loading) {
    return (
      <MainPageShell activeItem="Courses">
        <div className="rounded-3xl bg-white px-8 py-16 text-center text-sm text-[#5a6a6a] shadow-sm">
          Preparing your lesson stream...
        </div>
      </MainPageShell>
    );
  }

  if (error || !courseId || !videoId) {
    return (
      <MainPageShell activeItem="Courses">
        <div className="rounded-3xl bg-white px-8 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[#1a2e38]">
            We couldn&apos;t load this lesson.
          </p>
          <p className="mt-2 text-sm text-[#6c7a7a]">
            {error || "Lesson not found."}
          </p>
        </div>
      </MainPageShell>
    );
  }

  const openCueActivity = (cue: InteractiveCue) => {
    if (!courseId || !videoId) return;

    if (cue.gameKey === "somatic_states" && cue.subActivityKey) {
      navigate(
        appRoutes.courseGameActivity(courseId, cue.gameId, cue.subActivityKey, {
          contentItemId,
          videoId,
        }),
      );
      return;
    }

    navigate(
      appRoutes.courseGame(courseId, cue.gameId, {
        contentItemId,
        videoId,
        cueAt: cue.triggerAtSeconds,
        subActivityKey: cue.subActivityKey ?? undefined,
      }),
    );
  };

  return (
    <MainPageShell activeItem="Courses">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VideoPlayerCard
            stream={stream}
            videoRef={videoRef}
            onOpenCueActivity={openCueActivity}
          />
          <VideoInfoCard stream={stream} item={activeItem} />
        </div>

        <div className="lg:col-span-1">
          <LessonSidebar
            courseId={courseId}
            content={content}
            activeVideoId={videoId}
          />
        </div>
      </div>
    </MainPageShell>
  );
};

export default VideoDetailsPage;
