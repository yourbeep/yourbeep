import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { CircleAlert, Sparkles } from "lucide-react";
import { AnimatedDropdown } from "../../../../components/ui/AnimatedDropdown";
import { InputField } from "../../../../components/ui/InputField";
import { ImagePickerField } from "../../../../components/ui/ImagePickerField";
import { KeyValueListField } from "../../../../components/ui/KeyValueListField";
import { MainButton } from "../../../../components/ui/MainButton";
import { SegmentToggle } from "../../../../components/ui/SegmentToggle";
import { ShimmerBlock } from "../../../../components/ui/ShimmerBlock";
import { StringListField } from "../../../../components/ui/StringListField";
import { VideoPickerField } from "../../../../components/ui/VideoPickerField";
import { uploadCloudinaryImage } from "../../../../services/media/cloudinaryUpload";
import type { CourseFormState } from "../../hooks/useCourseBuilder";

type GameOption = {
  _id: string;
  key: string;
  title: string;
  description?: string;
};

type BasicsStepProps = {
  courseForm: CourseFormState;
  setCourseForm: Dispatch<SetStateAction<CourseFormState>>;
  games: GameOption[];
  gamesLoading?: boolean;
  selectedGamesTotal: number;
  toggleGame: (gameId: string) => void;
  updateGameWeight: (gameId: string, weight: number) => void;
  onSave: () => void;
  onUploadTrailer: (file: File) => Promise<void>;
  trailerUploadStatus: string | null;
  trailerUploading: boolean;
  trailerStreamUrl: string | null;
  trailerThumbnailUrl: string | null;
  loading: boolean;
};

const sectionMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const cardClassName =
  "rounded-[28px] border border-[#e7eadf] bg-white p-6 shadow-[0_18px_50px_rgba(34,52,28,0.06)]";

function updateInstructorField(
  setCourseForm: Dispatch<SetStateAction<CourseFormState>>,
  field: keyof CourseFormState["instructor"],
  value: string,
) {
  setCourseForm((current) => ({
    ...current,
    instructor: {
      ...current.instructor,
      [field]: value,
    },
  }));
}

function updateFeaturedTestimonialField(
  setCourseForm: Dispatch<SetStateAction<CourseFormState>>,
  field: keyof CourseFormState["featuredTestimonial"],
  value: string,
) {
  setCourseForm((current) => ({
    ...current,
    featuredTestimonial: {
      ...current.featuredTestimonial,
      [field]: value,
    },
  }));
}

export default function BasicsStep({
  courseForm,
  setCourseForm,
  games,
  gamesLoading = false,
  selectedGamesTotal,
  toggleGame,
  updateGameWeight,
  onSave,
  onUploadTrailer,
  trailerUploadStatus,
  trailerUploading,
  trailerStreamUrl,
  trailerThumbnailUrl,
  loading,
}: BasicsStepProps) {
  const canSave =
    !loading && !!courseForm.games.length && selectedGamesTotal === 100;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className="space-y-6"
    >
      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe7d3] bg-[#f4f8ef] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5f6f5d]">
                <Sparkles className="h-3.5 w-3.5" />
                Course Basics
              </div>
              <h3 className="mt-3 text-[24px] font-bold tracking-[-0.02em] text-[#203321]">
                Set the core story of the course
              </h3>
              <p className="mt-2 max-w-[720px] text-sm leading-6 text-[#74816f]">
                Define the public identity, editorial messaging, learner
                outcomes, and trust-building details that the user-side course
                page will rely on.
              </p>
            </div>
            <div className="rounded-xl border border-[#e1ead8] bg-[#fbfcf8] px-4 py-3 text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#74816f]">
                Weight Health
              </p>
              <p
                className={`mt-2 text-2xl font-bold ${
                  selectedGamesTotal === 100 ? "text-[#1d8f57]" : "text-[#b5701f]"
                }`}
              >
                {selectedGamesTotal}%
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Course title"
              name="course-title"
              value={courseForm.title}
              placeholder="Behavioural Signal Intelligence"
              onChange={(event) =>
                setCourseForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
            <InputField
              label="Subtitle"
              name="course-subtitle"
              value={courseForm.subtitle}
              placeholder="Begin your self-reflection journey"
              onChange={(event) =>
                setCourseForm((current) => ({
                  ...current,
                  subtitle: event.target.value,
                }))
              }
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Short description"
              name="course-short-description"
              value={courseForm.shortDescription}
              placeholder="A guided self-awareness journey through reflective lessons and embodied practices."
              helpText="Shown on cards and compact course listings."
              onChange={(event) =>
                setCourseForm((current) => ({
                  ...current,
                  shortDescription: event.target.value,
                }))
              }
            />
            <InputField
              label="Duration in minutes"
              name="course-duration"
              type="number"
              value={courseForm.durationMinutes}
              placeholder="120"
              onChange={(event) =>
                setCourseForm((current) => ({
                  ...current,
                  durationMinutes: event.target.value,
                }))
              }
            />
          </div>

          <InputField
            label="Full description"
            name="course-description"
            element="textarea"
            rows={6}
            value={courseForm.description}
            placeholder="Describe what the course teaches, who it helps, and how the self-reflection journey unfolds."
            helpText="This is the core body copy shown in the detail experience."
            onChange={(event) =>
              setCourseForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />

          <InputField
            label="Overview"
            name="course-overview"
            element="textarea"
            rows={5}
            value={courseForm.overview}
            placeholder="Write a richer editorial overview that explains the emotional arc and why this course matters."
            helpText="Useful for the top section of the course detail page, separate from the short description."
            onChange={(event) =>
              setCourseForm((current) => ({
                ...current,
                overview: event.target.value,
              }))
            }
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <InputField
              label="Estimated duration text"
              name="course-estimated-duration"
              value={courseForm.estimatedDurationText}
              placeholder="6 weeks • self-paced"
              onChange={(event) =>
                setCourseForm((current) => ({
                  ...current,
                  estimatedDurationText: event.target.value,
                }))
              }
            />
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#475467]">
                Difficulty
              </p>
              <AnimatedDropdown
                name="course-difficulty"
                value={courseForm.difficultyLevel}
                options={[
                  { label: "Beginner", value: "beginner" },
                  { label: "Intermediate", value: "intermediate" },
                  { label: "Advanced", value: "advanced" },
                ]}
                placeholder="Select difficulty"
                onChange={(value) =>
                  setCourseForm((current) => ({
                    ...current,
                    difficultyLevel: value,
                  }))
                }
              />
            </div>
            <InputField
              label="Language"
              name="course-language"
              value={courseForm.language}
              placeholder="English"
              onChange={(event) =>
                setCourseForm((current) => ({
                  ...current,
                  language: event.target.value,
                }))
              }
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-[#475467]">
                  Certificate included
                </p>
                <SegmentToggle
                  value={courseForm.certificateIncluded ? "enabled" : "disabled"}
                  onChange={(value) =>
                    setCourseForm((current) => ({
                      ...current,
                      certificateIncluded: value === "enabled",
                    }))
                  }
                  items={[
                    { label: "Included", value: "enabled" },
                    { label: "Not included", value: "disabled" },
                  ]}
                  motionId="course-certificate"
                  size="md"
                />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-[#475467]">
                  Community access
                </p>
                <SegmentToggle
                  value={courseForm.communityAccess ? "enabled" : "disabled"}
                  onChange={(value) =>
                    setCourseForm((current) => ({
                      ...current,
                      communityAccess: value === "enabled",
                    }))
                  }
                  items={[
                    { label: "Included", value: "enabled" },
                    { label: "Not included", value: "disabled" },
                  ]}
                  motionId="course-community"
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="grid gap-6 xl:grid-cols-2">
          <ImagePickerField
            label="Course thumbnail"
            value={courseForm.thumbnail}
            previewAlt={courseForm.title || "Course thumbnail"}
            aspectHint="Recommended: landscape artwork for cards and compact previews."
            helpText="Uploads go to Cloudinary and save the final asset URL into the course draft."
            showUrlInput={false}
            onChange={(value) =>
              setCourseForm((current) => ({
                ...current,
                thumbnail: value,
              }))
            }
            onUpload={(file) =>
              uploadCloudinaryImage(file, {
                folder: "yourbeep/admin/courses/thumbnails",
                tags: ["courses", "thumbnail"],
              }).then((result) => result.secureUrl)
            }
          />

          <ImagePickerField
            label="Course banner"
            value={courseForm.bannerImage}
            previewAlt={courseForm.title || "Course banner"}
            aspectHint="Recommended: wide hero artwork for the course details page."
            helpText="This wide image gives the user-side course detail page a proper hero instead of reusing the thumbnail."
            showUrlInput={false}
            onChange={(value) =>
              setCourseForm((current) => ({
                ...current,
                bannerImage: value,
              }))
            }
            onUpload={(file) =>
              uploadCloudinaryImage(file, {
                folder: "yourbeep/admin/courses/banners",
                tags: ["courses", "banner"],
              }).then((result) => result.secureUrl)
            }
          />
        </div>

        <div className="mt-6">
          <VideoPickerField
            label="Trailer video"
            streamUrl={trailerStreamUrl}
            posterUrl={trailerThumbnailUrl}
            status={trailerUploadStatus}
            disabled={trailerUploading}
            helpText="If the course draft is not created yet, the admin will create it first and then upload the trailer."
            onUpload={onUploadTrailer}
          />
        </div>
      </motion.section>

      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#203321]">Instructor details</h3>
          <p className="mt-1 text-sm text-[#74816f]">
            Give the course a strong human voice and enough context for trust.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Instructor name"
                name="instructor-name"
                value={courseForm.instructor.name}
                placeholder="Dr. Raj Lodhi"
                onChange={(event) =>
                  updateInstructorField(setCourseForm, "name", event.target.value)
                }
              />
              <InputField
                label="Instructor title"
                name="instructor-title"
                value={courseForm.instructor.title}
                placeholder="Somatic educator and behavioural guide"
                onChange={(event) =>
                  updateInstructorField(setCourseForm, "title", event.target.value)
                }
              />
            </div>
            <InputField
              label="Instructor bio"
              name="instructor-bio"
              element="textarea"
              rows={5}
              value={courseForm.instructor.bio}
              placeholder="Share the experience, tone, and reflective lens this instructor brings to the course."
              onChange={(event) =>
                updateInstructorField(setCourseForm, "bio", event.target.value)
              }
            />
          </div>

          <ImagePickerField
            label="Instructor avatar"
            value={courseForm.instructor.avatar}
            previewAlt={courseForm.instructor.name || "Instructor avatar"}
            aspectHint="Recommended: portrait image or square headshot."
            helpText="Uploads go to Cloudinary so the same asset can be reused across the course, landing pages, and testimonials."
            showUrlInput={false}
            onChange={(value) => updateInstructorField(setCourseForm, "avatar", value)}
            onUpload={(file) =>
              uploadCloudinaryImage(file, {
                folder: "yourbeep/admin/courses/instructors",
                tags: ["courses", "instructor"],
              }).then((result) => result.secureUrl)
            }
          />
        </div>
      </motion.section>

      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#203321]">Learning metadata</h3>
          <p className="mt-1 text-sm text-[#74816f]">
            These fields power the “what you’ll learn”, highlights, audience fit,
            and FAQ sections on the user-facing course detail page.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <StringListField
            label="What you'll learn"
            items={courseForm.whatYouWillLearn}
            onChange={(items) =>
              setCourseForm((current) => ({ ...current, whatYouWillLearn: items }))
            }
            addLabel="Add learning point"
            placeholder="Name one concrete learner outcome"
            helpText="Use short, outcome-focused bullet points."
          />

          <StringListField
            label="Course highlights"
            items={courseForm.courseHighlights}
            onChange={(items) =>
              setCourseForm((current) => ({ ...current, courseHighlights: items }))
            }
            addLabel="Add highlight"
            placeholder="Guided video lessons"
            helpText="Short feature callouts like community access, self-paced journey, or guided practices."
          />

          <StringListField
            label="Who it's for"
            items={courseForm.whoItsFor}
            onChange={(items) =>
              setCourseForm((current) => ({ ...current, whoItsFor: items }))
            }
            addLabel="Add audience point"
            placeholder="People who want a slower and more embodied self-observation practice"
          />

          <StringListField
            label="Who it's not for"
            items={courseForm.whoItsNotFor}
            onChange={(items) =>
              setCourseForm((current) => ({ ...current, whoItsNotFor: items }))
            }
            addLabel="Add boundary point"
            placeholder="People looking for a fast productivity hack"
          />
        </div>

        <div className="mt-6">
          <KeyValueListField
            label="Course FAQ"
            items={courseForm.faq.map((item) => ({
              key: item.question,
              value: item.answer,
            }))}
            onChange={(items) =>
              setCourseForm((current) => ({
                ...current,
                faq: items.map((item) => ({
                  question: item.key,
                  answer: item.value,
                })),
              }))
            }
            keyLabel="Question"
            valueLabel="Answer"
            keyPlaceholder="What kind of learner is this course designed for?"
            valuePlaceholder="Add a helpful, specific answer"
            addLabel="Add FAQ"
          />
        </div>
      </motion.section>

      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#203321]">
            Featured testimonial
          </h3>
          <p className="mt-1 text-sm text-[#74816f]">
            Optional, but strong social proof makes the detail page feel much
            more alive.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            <InputField
              label="Quote"
              name="featured-testimonial-quote"
              element="textarea"
              rows={5}
              value={courseForm.featuredTestimonial.quote}
              placeholder="This course helped me slow down enough to notice patterns I had been reacting from for years."
              onChange={(event) =>
                updateFeaturedTestimonialField(
                  setCourseForm,
                  "quote",
                  event.target.value,
                )
              }
            />
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Name"
                name="featured-testimonial-name"
                value={courseForm.featuredTestimonial.name}
                placeholder="Ananya S."
                onChange={(event) =>
                  updateFeaturedTestimonialField(
                    setCourseForm,
                    "name",
                    event.target.value,
                  )
                }
              />
              <InputField
                label="Role"
                name="featured-testimonial-role"
                value={courseForm.featuredTestimonial.role}
                placeholder="Leadership coach"
                onChange={(event) =>
                  updateFeaturedTestimonialField(
                    setCourseForm,
                    "role",
                    event.target.value,
                  )
                }
              />
            </div>
          </div>

          <ImagePickerField
            label="Testimonial avatar"
            value={courseForm.featuredTestimonial.avatar}
            previewAlt={courseForm.featuredTestimonial.name || "Testimonial avatar"}
            aspectHint="Optional portrait image for the featured learner quote."
            showUrlInput={false}
            onChange={(value) =>
              updateFeaturedTestimonialField(setCourseForm, "avatar", value)
            }
            onUpload={(file) =>
              uploadCloudinaryImage(file, {
                folder: "yourbeep/admin/courses/testimonials",
                tags: ["courses", "testimonial"],
              }).then((result) => result.secureUrl)
            }
          />
        </div>
      </motion.section>

      <motion.section variants={sectionMotion} className={cardClassName}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#203321]">Games and weights</h3>
            <p className="mt-1 text-sm text-[#74816f]">
              Select the reusable game library entries that power the course
              score and balance them until the total reaches exactly 100%.
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              selectedGamesTotal === 100
                ? "bg-[#e6f6ed] text-[#1d8f57]"
                : "bg-[#fff4e6] text-[#b5701f]"
            }`}
          >
            <CircleAlert className="h-4 w-4" />
            Weight total: {selectedGamesTotal}%
          </div>
        </div>

        {gamesLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-[#e7eadf] bg-[#fbfcf8] p-4"
              >
                <div className="flex items-start gap-4">
                  <ShimmerBlock className="h-5 w-5 rounded-md" />
                  <div className="flex-1 space-y-3">
                    <ShimmerBlock className="h-4 w-40" />
                    <ShimmerBlock className="h-3 w-full" />
                    <ShimmerBlock className="h-3 w-2/3" />
                  </div>
                  <ShimmerBlock className="h-10 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : !games.length ? (
          <div className="rounded-[24px] border border-dashed border-[#d8e3d2] bg-[#fbfcf8] px-5 py-8 text-sm text-[#74816f]">
            No reusable games are available yet. Create them in the{" "}
            <span className="font-semibold text-[#203321]">Games Library</span>{" "}
            and come back to attach them here.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {games.map((game, index) => {
              const selected = courseForm.games.find(
                (item) => item.gameId === game._id,
              );

              return (
                <motion.div
                  key={game._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`rounded-[24px] border p-4 transition ${
                    selected
                      ? "border-[#cae4c8] bg-[#f8fbf5] shadow-[0_10px_30px_rgba(95,133,86,0.08)]"
                      : "border-[#e7eadf] bg-white hover:border-[#dbe6d4]"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <label className="flex min-w-0 cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(selected)}
                        onChange={() => toggleGame(game._id)}
                        className="mt-1 h-4 w-4 rounded accent-[var(--primary)]"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#203321]">
                          {game.title}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7d8b79]">
                          {game.key}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#72806e]">
                          {game.description ||
                            "No game description has been added yet."}
                        </p>
                      </div>
                    </label>

                    <div className="w-full max-w-[120px] shrink-0">
                      <InputField
                        label="Weight"
                        name={`game-weight-${game._id}`}
                        type="number"
                        value={selected ? String(selected.weight ?? "") : ""}
                        placeholder="0"
                        disabled={!selected}
                        onChange={(event) =>
                          updateGameWeight(
                            game._id,
                            Number(event.target.value || 0),
                          )
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      <motion.div
        variants={sectionMotion}
        className="sticky bottom-4 z-10 flex justify-end rounded-[24px] border border-[#e7eadf] bg-white/92 px-4 py-4 shadow-[0_20px_50px_rgba(32,51,33,0.08)] backdrop-blur"
      >
        <MainButton
          text={loading ? "Saving..." : "Save Draft & Continue"}
          size="lg"
          onClick={onSave}
          isLoading={loading}
          disabled={!canSave}
        />
      </motion.div>
    </motion.div>
  );
}
