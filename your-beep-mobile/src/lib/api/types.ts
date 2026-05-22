export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryValue = string | number | boolean | null | undefined;

export type QueryParams = Record<string, QueryValue>;

export interface ApiRequestOptions<TBody = unknown> {
  body?: TBody;
  headers?: Record<string, string>;
  method?: ApiMethod;
  query?: QueryParams;
  signal?: AbortSignal;
}

export interface ApiEnvelope<TData> {
  data: TData;
  message?: string;
  meta?: Record<string, unknown>;
  success?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface UserProfile {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}

export interface AuthSyncResponse {
  isNewUser: boolean;
  user: CurrentUser;
}

export interface ProgramSummary {
  description: string;
  id: string;
  isFree: boolean;
  segmentCount: number;
  title: string;
}

export interface ActivationCheckInPayload {
  primaryStateId: string;
  secondaryStateId: string;
}

export interface ExpansionCheckInPayload {
  primaryStateId: string;
  secondaryStateId: string;
}

export interface ValueSystemSelectionPayload {
  highPoints: string[];
  lowPoints: string[];
}

export interface RootCauseSelectionPayload {
  causes: {
    label: string;
    source:
      | 'learned-emotional-strategy'
      | 'environmental-stressor'
      | 'protective-belief'
      | 'unmet-need';
  }[];
}

export type SomaticRegion = 'head' | 'face-throat' | 'heart' | 'chest' | 'stomach' | 'hands-legs';

export interface SomaticSelectionPayload {
  optionId: string;
  region: SomaticRegion;
}

export interface ReflectionSnapshot {
  action: string;
  emotionalState: string;
  pattern: string;
  presence: string;
  somatics: string;
}

export interface NotificationPreferences {
  dailyReminderEnabled: boolean;
  quietHoursEnd?: string;
  quietHoursStart?: string;
}

export interface DeviceRegistrationResponse {
  fcmTokens: string[];
}

export interface CurrentUser {
  _id: string;
  avatar?: string | null;
  badges?: string[];
  email: string;
  firebaseUid: string;
  isActive: boolean;
  name: string;
  points: number;
  region?: string | null;
  role: 'user' | 'admin';
  streakDays: number;
  timezone: string;
  userLevel: number;
}

export interface CurrentUserProfileResponse {
  user: CurrentUser;
}

export interface CurrentUserStats {
  activitySummary: {
    courseProgressUpdates: number;
    gamesCompleted: number;
    minutesWatched: number;
    totalActivities: number;
  };
  badges: string[];
  points: number;
  progression: {
    currentXp: number;
    nextLevelXp: number;
    progressPercentage: number;
    stateDirection: 'flat' | 'down' | 'up';
    stateTrend: 'steady' | 'declining' | 'improving';
  };
  streakDays: number;
  userLevel: number;
}

export interface CourseSummaryItem {
  _id: string;
  durationMinutes?: number | null;
  gameCount: number;
  pricing?: {
    amount: number;
    currency: string;
    displayPrice: string;
    region: string;
  } | null;
  shortDescription?: string | null;
  subtitle?: string | null;
  thumbnail?: string | null;
  title: string;
  trailerVideoId?: string | null;
  userProgress?: {
    expiresAt: string | null;
    gamesCompleted: number;
    gamesTotal: number;
    hasPurchase: boolean;
    percentComplete: number;
    planType: string | null;
  } | null;
}

export interface CourseListResponse {
  courses: CourseSummaryItem[];
}

export interface CourseDetailResponse extends CourseSummaryItem {
  games: Array<{
    gameId:
      | string
      | {
          _id: string;
          description?: string | null;
          key?: string;
          title?: string;
        };
    weight: number;
  }>;
  contentItems: Array<{
    _id: string;
    description?: string | null;
    durationMinutes?: number | null;
    isActive?: boolean;
    isFree?: boolean;
    order: number;
    refId: string;
    title: string;
    type: 'video' | 'game';
    userStatus?: 'completed' | 'not_started' | 'in_progress';
  }>;
  description: string;
  instructor?: string | null;
  isPublished?: boolean;
}

export interface CourseContentResponse {
  contentItems: Array<{
    _id: string;
    bunnyVideoId?: string | null;
    description?: string | null;
    durationMinutes?: number | null;
    interactiveCueCount?: number;
    isFree: boolean;
    order: number;
    refId: string;
    title: string;
    type: 'video' | 'game';
    userStatus?: 'completed' | 'not_started' | 'in_progress';
    videoId?: string | null;
  }>;
  courseId: string;
  progress: {
    completed: number;
    percentComplete: number;
    total: number;
  };
  title: string;
}

export type GameSubmissionType =
  | 'awareness_states'
  | 'somatic_states'
  | 'pattern_awareness'
  | 'reflect_act';

export interface SubmitGameInput {
  courseId: string;
  payload: Record<string, unknown>;
  step?: number;
  type: GameSubmissionType;
}

export interface SubmissionRecord {
  _id: string;
  completed?: boolean;
  courseId: string;
  createdAt: string;
  gameId: string;
  payload?: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  score?: {
    finalScore?: number;
    label?: string;
    scaleMax?: number;
  } | null;
  type: GameSubmissionType;
  updatedAt: string;
  userId: string;
}

export interface CourseSubmissionsResponse {
  courseId: string;
  finalCourseScore: {
    finalScore: number;
    scaleMax: number;
  } | null;
  submissions: SubmissionRecord[];
}

export interface SubmissionDetailResponse {
  submission: SubmissionRecord;
}

export interface GameResultResponse {
  generated: boolean;
  result: Record<string, unknown>;
  submission: SubmissionRecord | null;
}

export interface GameActivityDetailResponse {
  activity: Record<string, unknown>;
  game: {
    _id: string;
    description?: string | null;
    key: string;
    title: string;
  };
}

export interface RecordCourseVideoWatchInput {
  completed?: boolean;
  contentItemId?: string;
  positionSeconds?: number;
  watchedSeconds: number;
}

export interface MasterCourseResponse {
  bunnyVideoId: string | null;
  description: string | null;
  durationSeconds: number | null;
  playbackStatus: 'ready' | 'processing';
  streamEndpoint: string | null;
  thumbnail: string | null;
  title: string;
  updatedAt: string;
  videoId: string | null;
  videoUrl: string | null;
}

export interface VideoCue {
  _id: string;
  ctaLabel?: string;
  description?: string;
  gameId?: string;
  gameKey?: string;
  gameTitle?: string;
  isSkippable?: boolean;
  pauseVideo?: boolean;
  title?: string;
  triggerAtSeconds?: number;
  videoId: string;
}

export interface VideoCueListResponse {
  cues: VideoCue[];
}

export interface VideoStreamResponse {
  durationSeconds: number | null;
  expiresIn?: number;
  interactiveCues?: Array<{
    ctaLabel?: string;
    description?: string;
    gameId?: string;
    gameKey?: string;
    gameTitle?: string;
    isSkippable?: boolean;
    pauseVideo?: boolean;
    title?: string;
    triggerAtSeconds?: number;
  }>;
  streamUrl?: string;
  thumbnailUrl: string | null;
  title: string;
}

export interface DashboardMetric {
  icon: string;
  id: 'emotional_signal' | 'physiological_efficiency' | 'pattern_efficiency';
  score: number;
  subtitle: string;
  title: string;
  trend: 'baseline' | 'down' | 'up';
  unit: '%';
  weeklyChange: number;
}

export interface DashboardRecommendation {
  category: string;
  contentType: string;
  durationMinutes: number;
  id: string;
  stateMatchScore: number;
  thumbnailUrl: string | null;
  title: string;
}

export interface CurrentUserDashboard {
  activityEngagement: {
    observationTime: {
      changePercentage: number;
      minutes: number;
      trend: 'baseline' | 'down' | 'up';
    };
    reflectionTime: {
      changePercentage: number;
      minutes: number;
      trend: 'baseline' | 'down' | 'up';
    };
  };
  continueLearning: Array<{
    courseId: string;
    nextItem: null | {
      itemId: string;
      title: string;
      type: string;
      videoId: string | null;
    };
    percentComplete: number;
    thumbnailUrl: string | null;
    title: string;
  }>;
  header: {
    greeting: string;
    notifications: {
      unreadCount: number;
    };
    subtitle: string;
    user: {
      avatarUrl: string | null;
      id: string;
      name: string;
    };
  };
  metrics: DashboardMetric[];
  progression: {
    currentXp: number;
    level: number;
    nextLevelXp: number;
    progressPercentage: number;
    stateDirection: 'flat' | 'down' | 'up';
    stateTrend: 'steady' | 'declining' | 'improving';
    totalXp: number;
  };
  recommendations: DashboardRecommendation[];
}

export interface CurrentUserProgressResponse {
  courses: Array<{
    courseId: string;
    expiryDate: string | null;
    finalCourseScore: null | {
      finalScore: number;
      scaleMax: number;
    };
    lastCompletedAt: string | null;
    nextItem: null | {
      itemId: string;
      order: number;
      title: string;
      type: string;
    };
    planType: 'six_month' | 'annual';
    progress: {
      contentCompleted: number;
      contentTotal: number;
      gamesCompleted: number;
      gamesTotal: number;
      percentComplete: number;
    };
    status: 'pending' | 'active' | 'expired' | 'cancelled' | 'refunded';
    thumbnail: string | null;
    title: string;
  }>;
  summary: {
    activeCourses: number;
    averageCompletion: number;
    completedCourses: number;
    totalCourses: number;
  };
}

export interface PlatformFaqItem {
  _id: string;
  answer: string;
  category: string;
  isPublished: boolean;
  order: number;
  question: string;
}

export interface PlatformSettings {
  appLinks: {
    androidAppUrl?: string;
    iosAppUrl?: string;
    webAppUrl?: string;
  };
  contactAddress: string | null;
  faqItems: PlatformFaqItem[];
  footer: {
    copyrightText: string;
    links: Array<{
      label: string;
      url: string;
    }>;
    tagline: string;
  };
  homeBanner: {
    announcementText?: string;
    backgroundVariant?: string;
    eyebrow?: string;
    mobileImageUrl?: string;
    primaryCtaLabel?: string;
    primaryCtaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
    subtitle?: string;
    title?: string;
    trustBadgeText?: string;
  };
  legal: {
    communityGuidelines: string;
    cookiePolicy: string;
    privacyPolicy: string;
    refundPolicy: string;
    termsOfService: string;
  };
  platformName: string;
  seo: {
    defaultDescription: string;
    defaultTitle: string;
  };
  socialLinks: Record<string, string>;
  supportEmail: string | null;
  supportPhone: string | null;
  supportWhatsapp: string | null;
  updatedAt: string;
}

export interface LegalDocument {
  content: string;
  key: string;
  title: string;
  updatedAt?: string;
}

export interface CoursePricingResponse {
  amount1yr: number;
  amount6mo: number;
  currency: string;
  displayPrice1yr: string;
  displayPrice6mo: string;
  region: string;
}

export interface CommentAuthor {
  _id: string;
  avatar?: string | null;
  name: string;
}

export interface CommentRecord {
  _id: string;
  author?: CommentAuthor;
  body: string;
  contentItemId?: string | null;
  courseId?: string | null;
  createdAt: string;
  parentCommentId?: string | null;
}

export interface CommentListResponse {
  items: CommentRecord[];
  pagination: {
    limit: number;
    page: number;
    total: number;
  };
}

export interface CommentMutationResponse {
  comment: CommentRecord;
}

export type SupportTicketType =
  | 'refund_related'
  | 'account_access'
  | 'course_access'
  | 'video_access'
  | 'payment_issue'
  | 'game_issue'
  | 'technical_issue'
  | 'general_support';

export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CreateSupportTicketInput {
  attachments?: string[];
  courseId?: string;
  description: string;
  gameId?: string;
  priority?: SupportTicketPriority;
  purchaseId?: string;
  subject: string;
  type: SupportTicketType;
  videoId?: string;
}

export interface SupportTicketRecord {
  _id: string;
  attachments?: string[];
  closedAt: string | null;
  courseId: string | null;
  createdAt: string;
  description: string;
  gameId: string | null;
  lastReplyAt: string;
  lastReplyBy: 'admin' | 'user';
  messages: Array<{
    attachments: string[];
    body: string;
    createdAt: string;
    senderId: string | null;
    senderType: 'admin' | 'user';
  }>;
  priority: SupportTicketPriority;
  purchaseId: string | null;
  replies?: Array<{
    attachments: string[];
    authorId: string | null;
    authorType: 'admin' | 'user';
    body: string;
    createdAt: string;
  }>;
  resolvedAt: string | null;
  status: 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed';
  subject: string;
  tags: string[];
  ticketNumber: string;
  type: SupportTicketType;
  updatedAt: string;
  userId: string;
  videoId: string | null;
}

export interface SupportTicketDetailResponse {
  ticket: SupportTicketRecord;
}

export interface SupportTicketReplyInput {
  attachments?: string[];
  body: string;
}

export interface CreateGetInTouchInput {
  email: string;
  message: string;
  name: string;
  phoneCountryCode?: string;
  subject: string;
  topic:
    | 'refund_related'
    | 'account_access'
    | 'course_access'
    | 'video_access'
    | 'payment_issue'
    | 'game_issue'
    | 'technical_issue'
    | 'general_support'
    | 'partnership'
    | 'feedback';
  userId?: string;
}

export interface ContactRequestRecord {
  _id: string;
  createdAt: string;
  email: string;
  message: string;
  name: string;
  notes?: string | null;
  phoneCountryCode?: string | null;
  status: 'new' | 'reviewed' | 'replied' | 'closed';
  subject: string;
  topic: string;
  updatedAt: string;
  userId?: string | null;
}

export interface CreateGetInTouchResponse {
  request: ContactRequestRecord;
}

export interface SupportTicketListResponse {
  items: SupportTicketRecord[];
  pagination: {
    limit: number;
    page: number;
    total: number;
  };
}
