import { z } from "zod";

const objectId = () => z.string().regex(/^[0-9a-fA-F]{24}$/);

export const createGameSchema = z.object({
  key: z.string().min(2).max(80).regex(/^[a-z0-9_]+$/),
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export const updateGameSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const courseGameSchema = z.object({
  gameId: objectId(),
  weight: z.number().int().min(1).max(100),
});

const courseFaqSchema = z.object({
  question: z.string().min(2).max(200),
  answer: z.string().min(2).max(2000),
});

const courseTestimonialSchema = z.object({
  quote: z.string().min(2).max(1200),
  name: z.string().min(2).max(120),
  role: z.string().max(160).optional(),
  avatar: z.string().url().optional(),
});

const courseSectionSchema = z.object({
  key: z.string().min(1).max(120).regex(/^[a-z0-9_]+$/),
  title: z.string().min(2).max(160),
  description: z.string().max(1000).optional(),
  order: z.number().int().min(1),
});

export const coursePayloadSchema = z.object({
  title: z.string().min(2).max(100),
  subtitle: z.string().max(160).optional(),
  description: z.string().min(10).max(5000),
  shortDescription: z.string().max(160).optional(),
  thumbnail: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  overview: z.string().max(4000).optional(),
  trailerVideoId: z.string().min(1).optional(),
  instructor: z
    .object({
      name: z.string().min(2).max(120),
      title: z.string().max(160).optional(),
      bio: z.string().max(1000).optional(),
      avatar: z.string().url().optional(),
    })
    .optional(),
  games: z.array(courseGameSchema).min(1).max(10),
  sections: z.array(courseSectionSchema).max(30).optional(),
  durationMinutes: z.number().int().positive().optional(),
  estimatedDurationText: z.string().max(120).optional(),
  difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  language: z.string().max(80).optional(),
  certificateIncluded: z.boolean().optional(),
  communityAccess: z.boolean().optional(),
  whatYouWillLearn: z.array(z.string().min(2).max(280)).max(12).optional(),
  courseHighlights: z.array(z.string().min(2).max(200)).max(12).optional(),
  whoItsFor: z.array(z.string().min(2).max(240)).max(12).optional(),
  whoItsNotFor: z.array(z.string().min(2).max(240)).max(12).optional(),
  faq: z.array(courseFaqSchema).max(12).optional(),
  featuredTestimonial: courseTestimonialSchema.optional(),
  isPublished: z.boolean().optional(),
});

export const createCourseSchema = coursePayloadSchema;
export const updateCourseSchema = coursePayloadSchema.partial();

export const createContentItemSchema = z
  .object({
    type: z.enum(["video", "game"]),
    refId: objectId(),
    sectionKey: z.string().min(1).max(120).regex(/^[a-z0-9_]+$/),
    order: z.number().int().min(1),
    title: z.string().min(2).max(160),
    description: z.string().max(500).optional(),
    durationMinutes: z.number().int().min(0).optional(),
    isFree: z.boolean().optional(),
  });

export const updateContentItemSchema = z
  .object({
    sectionKey: z.string().min(1).max(120).regex(/^[a-z0-9_]+$/).optional(),
    order: z.number().int().min(1).optional(),
    title: z.string().min(2).max(160).optional(),
    description: z.string().max(500).optional(),
    durationMinutes: z.number().int().min(0).optional(),
    isFree: z.boolean().optional(),
  });

export const reorderContentSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: objectId(),
        order: z.number().int().min(1),
      }),
    )
    .min(1),
});

export const listCommentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const createCommentSchema = z.object({
  body: z.string().min(1).max(2000),
  parentCommentId: objectId().optional(),
});

const activationStateSchema = z.enum([
  "excitement_enthusiasm",
  "alert_nervous",
  "irritation_rage",
  "calm_steady",
  "resilient_contesting",
  "stuck_rigid",
]);

const expansionStateSchema = z.enum([
  "joy_abundance",
  "surprise_embrace",
  "spiralling_enveloped",
  "compassion_acceptance",
  "protection_resistance",
  "repress_conflicted",
]);

const domainSchema = z.enum([
  "work",
  "relationships",
  "family",
  "finances",
  "personal_development",
  "health",
  "previous_stress",
]);

const rootCauseSchema = z.enum([
  "learned_emotional_strategy",
  "recurring_environmental_stressor",
  "protective_belief_or_meaning",
  "unmet_need",
]);

const awarenessSubmissionSchema = z.object({
  type: z.literal("awareness_states"),
  courseId: objectId(),
  step: z.number().int().min(1).max(3),
  subActivityKey: z
    .enum(["mapping_life_domains", "daily_activation", "expansion_check"])
    .optional(),
  payload: z.object({
    activationSelections: z.array(activationStateSchema).min(1).max(2).optional(),
    expansionSelections: z.array(expansionStateSchema).min(1).max(2).optional(),
    valueSystems: z
      .object({
        highPoints: z.array(domainSchema).length(2),
        lowPoints: z.array(domainSchema).length(2),
      })
      .optional(),
  }),
}).superRefine((value, ctx) => {
  if (value.step === 1 && !value.payload.valueSystems) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["payload", "valueSystems"],
      message: "valueSystems are required for step 1",
    });
  }

  if (value.step === 2 && !value.payload.activationSelections) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["payload", "activationSelections"],
      message: "activationSelections are required for step 2",
    });
  }

  if (value.step === 3 && !value.payload.expansionSelections) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["payload", "expansionSelections"],
      message: "expansionSelections are required for step 3",
    });
  }

  const high = value.payload.valueSystems?.highPoints ?? [];
  const low = value.payload.valueSystems?.lowPoints ?? [];
  const overlap = high.filter((item) => low.includes(item));
  if (overlap.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["payload", "valueSystems"],
      message: "highPoints and lowPoints must not overlap",
    });
  }
});

const somaticSubmissionSchema = z.object({
  type: z.literal("somatic_states"),
  courseId: objectId(),
  payload: z.object({
    regions: z
      .array(
        z.object({
          region: z.enum(["head", "face_throat", "heart", "chest", "stomach", "hands_legs"]),
          sensation: z.string().min(1),
          activities: z.array(
            z.object({
              activityKey: z.string().min(1),
              completed: z.boolean(),
              skipped: z.boolean(),
              durationSeconds: z.number().int().min(0).optional(),
              response: z.record(z.string(), z.unknown()).optional(),
            }),
          ),
        }),
      )
      .min(1)
      .max(6),
  }),
}).superRefine((value, ctx) => {
  const seenRegions = new Set<string>();

  for (const [index, region] of value.payload.regions.entries()) {
    if (seenRegions.has(region.region)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payload", "regions", index, "region"],
        message: "Each region may only be submitted once",
      });
    }
    seenRegions.add(region.region);

    const seenActivities = new Set<string>();
    for (const [activityIndex, activity] of region.activities.entries()) {
      if (seenActivities.has(activity.activityKey)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payload", "regions", index, "activities", activityIndex, "activityKey"],
          message: "Duplicate activityKey in region activities",
        });
      }
      seenActivities.add(activity.activityKey);

      if (activity.completed && activity.skipped) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payload", "regions", index, "activities", activityIndex],
          message: "An activity cannot be both completed and skipped",
        });
      }
    }
  }
});

const patternSubmissionSchema = z.object({
  type: z.literal("pattern_awareness"),
  courseId: objectId(),
  payload: z.object({
    exercises: z
      .array(
        z.object({
          exerciseKey: z.enum(["draw_your_breath", "awareness_circles", "scribble_drawing"]),
          durationSeconds: z.number().int().min(0),
          metrics: z.record(z.string(), z.unknown()),
        }),
      )
      .min(1)
      .max(3),
  }),
}).superRefine((value, ctx) => {
  const seen = new Set<string>();

  for (const [index, exercise] of value.payload.exercises.entries()) {
    if (seen.has(exercise.exerciseKey)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payload", "exercises", index, "exerciseKey"],
        message: "Each exercise may only be submitted once",
      });
    }
    seen.add(exercise.exerciseKey);

    if (exercise.exerciseKey === "draw_your_breath") {
      if (typeof exercise.metrics.controlLimitSpacing !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payload", "exercises", index, "metrics", "controlLimitSpacing"],
          message: "controlLimitSpacing is required for draw_your_breath",
        });
      }
      if (typeof exercise.metrics.intervalPattern !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payload", "exercises", index, "metrics", "intervalPattern"],
          message: "intervalPattern is required for draw_your_breath",
        });
      }
    }

    if (exercise.exerciseKey === "awareness_circles") {
      if (typeof exercise.metrics.circleCompleteness !== "number") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payload", "exercises", index, "metrics", "circleCompleteness"],
          message: "circleCompleteness is required for awareness_circles",
        });
      }
      if (typeof exercise.metrics.circlePattern !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payload", "exercises", index, "metrics", "circlePattern"],
          message: "circlePattern is required for awareness_circles",
        });
      }
    }

    if (exercise.exerciseKey === "scribble_drawing") {
      if (typeof exercise.metrics.lineSpacing !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payload", "exercises", index, "metrics", "lineSpacing"],
          message: "lineSpacing is required for scribble_drawing",
        });
      }
      if (typeof exercise.metrics.directionPattern !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payload", "exercises", index, "metrics", "directionPattern"],
          message: "directionPattern is required for scribble_drawing",
        });
      }
    }
  }

});

const reflectActSubmissionSchema = z.object({
  type: z.literal("reflect_act"),
  courseId: objectId(),
  payload: z.object({
    userReflectionNotes: z.string().max(2000).optional(),
    acknowledgedAction: z
      .enum(["acceptance", "transfer", "remediation", "redesign", "no_action"])
      .optional(),
  }),
});

export const submitGameSchema = z.discriminatedUnion("type", [
  awarenessSubmissionSchema,
  somaticSubmissionSchema,
  patternSubmissionSchema,
  reflectActSubmissionSchema,
]);

export const createMasterCourseSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  videoUrl: z.string().url().optional(),
  bunnyVideoId: z.string().min(1).optional(),
  durationSeconds: z.number().int().min(0).optional(),
  thumbnail: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export const updateMasterCourseSchema = createMasterCourseSchema.partial();

export const createVideoUploadSchema = z
  .object({
    title: z.string().min(2).max(200),
    description: z.string().max(1000).optional(),
    sectionKey: z.string().min(1).max(120).regex(/^[a-z0-9_]+$/),
    order: z.number().int().min(1),
  });

export const createTrailerUploadSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
});

export const updateVideoSchema = z
  .object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(1000).optional(),
    sectionKey: z.string().min(1).max(120).regex(/^[a-z0-9_]+$/).optional(),
    order: z.number().int().min(1).optional(),
    thumbnailUrl: z.string().url().optional(),
  });

export const recordVideoWatchSchema = z.object({
  watchedSeconds: z.number().int().min(1).max(14_400),
  positionSeconds: z.number().int().min(0).optional(),
  contentItemId: objectId().optional(),
  completed: z.boolean().optional(),
});

export const createVideoCueSchema = z.object({
  gameId: objectId(),
  subActivityKey: z.string().min(1).max(120).optional(),
  triggerAtSeconds: z.number().min(0),
  title: z.string().min(1).max(160).optional(),
  description: z.string().max(500).optional(),
  ctaLabel: z.string().min(1).max(80).optional(),
  pauseVideo: z.boolean().optional(),
  isSkippable: z.boolean().optional(),
});

export const updateVideoCueSchema = z.object({
  gameId: objectId().optional(),
  subActivityKey: z.string().min(1).max(120).optional(),
  triggerAtSeconds: z.number().min(0).optional(),
  title: z.string().min(1).max(160).optional(),
  description: z.string().max(500).optional(),
  ctaLabel: z.string().min(1).max(80).optional(),
  pauseVideo: z.boolean().optional(),
  isSkippable: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const bunnyWebhookSchema = z.object({
  VideoGuid: z.string().min(1),
  VideoLibraryId: z.union([z.string(), z.number()]),
  Status: z.number().int(),
  StorageSize: z.number().optional(),
  VideoLength: z.number().optional(),
});
