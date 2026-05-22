import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  fetchAdminCourses,
  fetchAdminGames,
} from "../../../store/slices/courses";
import CourseBuilderStepper from "../components/CourseBuilderStepper";
import BasicsStep from "../components/steps/BasicsStep";
import PricingStep from "../components/steps/PricingStep";
import SectionsStep from "../components/steps/SectionsStep";
import VideosStep from "../components/steps/VideosStep";
import ContentStep from "../components/steps/ContentStep";
import CuesStep from "../components/steps/CuesStep";
import PublishStep from "../components/steps/PublishStep";
import { courseSteps, useCourseBuilder } from "../hooks/useCourseBuilder";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const { games, hasLoadedGames, loadingGames, error } = useAppSelector(
    (state) => state.courses,
  );
  const builder = useCourseBuilder({
    courseId,
    games,
    onCourseSaved: (savedCourseId) => {
      if (!courseId) {
        setSearchParams({ courseId: savedCourseId });
      }
      dispatch(fetchAdminCourses());
    },
  });

  useEffect(() => {
    if (!hasLoadedGames && !loadingGames) {
      dispatch(fetchAdminGames());
    }
  }, [dispatch, hasLoadedGames, loadingGames]);

  const currentStep = courseSteps[builder.stepIndex];

  return (
    <div className="space-y-6">
      {(error || builder.error || builder.success) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            builder.error || error
              ? "border-[#f3d2c8] bg-[#fff6f2] text-[#b5574e]"
              : "border-[#dcebd6] bg-[#f5fbf1] text-[#40603d]"
          }`}
        >
          {builder.error || error || builder.success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <CourseBuilderStepper
          stepIndex={builder.stepIndex}
          setStep={builder.setStep}
        />

        <div className="space-y-5">
          <section className="rounded-[24px] border border-[#e7eadf] bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#74816f]">
              Step {builder.stepIndex + 1} of {courseSteps.length}
            </p>
            <h2 className="mt-2 text-[24px] font-bold text-[#203321]">
              {currentStep.title}
            </h2>
            <p className="mt-1 text-sm text-[#74816f]">
              {currentStep.subtitle}
            </p>
          </section>

          {builder.stepIndex === 0 && (
            <BasicsStep
              courseForm={builder.courseForm}
              setCourseForm={builder.setCourseForm}
              games={games}
              gamesLoading={loadingGames}
              selectedGamesTotal={builder.selectedGamesTotal}
              toggleGame={builder.toggleGame}
              updateGameWeight={builder.updateGameWeight}
              onUploadTrailer={builder.uploadTrailerVideo}
              trailerUploadStatus={builder.trailerUploadStatus}
              trailerUploading={builder.trailerUploading}
              trailerStreamUrl={builder.trailerStreamUrl}
              trailerThumbnailUrl={builder.trailerThumbnailUrl}
              onSave={builder.saveBasics}
              loading={builder.loading}
            />
          )}

          {builder.stepIndex === 1 && (
            <PricingStep
              pricingForm={builder.pricingForm}
              setPricingForm={builder.setPricingForm}
              pricingItems={builder.pricingItems}
              deletingPricingRegion={builder.deletingPricingRegion}
              onSelectPricing={builder.loadPricingIntoForm}
              onDeletePricing={builder.removePricing}
              onSave={builder.savePricing}
              onBack={builder.previousStep}
              loading={builder.loading}
            />
          )}

          {builder.stepIndex === 2 && (
            <SectionsStep
              courseForm={builder.courseForm}
              setCourseForm={builder.setCourseForm}
              onSave={builder.saveSections}
              onBack={builder.previousStep}
              loading={builder.loading}
            />
          )}

          {builder.stepIndex === 3 && (
            <VideosStep
              videoForm={builder.videoForm}
              setVideoForm={builder.setVideoForm}
              courseSections={builder.courseForm.sections}
              videoItems={builder.videoItems}
              editingVideoId={builder.editingVideoId}
              deletingVideoId={builder.deletingVideoId}
              uploadStatus={builder.uploadStatus}
              onUpload={builder.createVideoUpload}
              onSaveVideoDetails={builder.saveVideoMetadata}
              onEditVideo={builder.loadVideoIntoEditor}
              onDeleteVideo={builder.removeVideo}
              onAddNewVideo={builder.resetVideoDraft}
              onBack={builder.previousStep}
              onNext={builder.nextStep}
              loading={builder.loading}
            />
          )}

          {builder.stepIndex === 4 && (
            <ContentStep
              contentForm={builder.contentForm}
              setContentForm={builder.setContentForm}
              courseSections={builder.courseForm.sections}
              gameItems={builder.gameItems}
              contentItems={builder.contentItems}
              onAddGameContent={builder.addGameContent}
              onReorderContentItems={builder.reorderContentFlow}
              onRemoveContentItem={builder.removeContentItem}
              onBack={builder.previousStep}
              onNext={builder.nextStep}
              loading={builder.loading}
            />
          )}

          {builder.stepIndex === 5 && (
            <CuesStep
              videoItems={builder.videoItems}
              selectedVideoId={builder.selectedVideoId}
              setSelectedVideoId={builder.setSelectedVideoId}
              cueForm={builder.cueForm}
              setCueForm={builder.setCueForm}
              gameItems={builder.gameItems}
              videoCues={builder.videoCues}
              cuePreviewLoading={builder.cuePreviewLoading}
              cuePreviewStreamUrl={builder.cuePreviewStreamUrl}
              cuePreviewThumbnailUrl={builder.cuePreviewThumbnailUrl}
              cuePreviewStatus={builder.cuePreviewStatus}
              onAddCue={builder.addCue}
              onRemoveCue={builder.removeCue}
              onBack={builder.previousStep}
              onNext={builder.nextStep}
              loading={builder.loading}
            />
          )}

          {builder.stepIndex === 6 && (
            <PublishStep
              activeCourseId={builder.activeCourseId}
              courseForm={builder.courseForm}
              selectedGamesTotal={builder.selectedGamesTotal}
              pricingItems={builder.pricingItems}
              contentItems={builder.contentItems}
              videoItems={builder.videoItems}
              onPublish={builder.publishCourse}
              onBack={builder.previousStep}
              loading={builder.loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
