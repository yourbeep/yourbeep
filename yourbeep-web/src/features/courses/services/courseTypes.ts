export type CoursePricing = {
  sixMonthAmount?: number;
  annualAmount?: number;
  amount?: number;
  displayPrice?: string;
  currency?: string;
  region?: string;
};

export type CourseInstructor = {
  name: string;
  title?: string;
  bio?: string;
  avatar?: string;
};

export type CourseFaqItem = {
  question: string;
  answer: string;
};

export type CourseFeaturedTestimonial = {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
};

export type CourseTrailerStream = {
  streamUrl: string;
  expiresIn: number;
  title: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
};

export type CourseCardItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  bannerImage?: string;
  durationMinutes: number;
  estimatedDurationText?: string;
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
  language?: string;
  certificateIncluded?: boolean;
  communityAccess?: boolean;
  instructor?: CourseInstructor;
  pricing: CoursePricing;
  hasAccess: boolean;
  progressPercent: number;
  planType?: string | null;
  gamesCompleted?: number;
  gamesTotal?: number;
  gamesCount: number;
};

export type CourseDetailPageData = CourseCardItem & {
  overview?: string;
  trailerVideoId?: string;
  whatYouWillLearn: string[];
  courseHighlights: string[];
  whoItsFor: string[];
  whoItsNotFor: string[];
  faq: CourseFaqItem[];
  featuredTestimonial?: CourseFeaturedTestimonial;
  lessonCount: number;
  practiceCount: number;
  gameTitles?: string[];
  contentPreview?: Array<{
    id: string;
    title: string;
    type: string;
    description: string;
  }>;
  modules: Array<{
    id: string;
    title: string;
    type: string;
    description: string;
    points: string[];
  }>;
};
