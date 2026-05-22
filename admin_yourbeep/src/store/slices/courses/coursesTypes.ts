export type AdminGame = {
  _id: string;
  key: string;
  title: string;
  description?: string | null;
  isActive: boolean;
};

export type AdminCourse = {
  _id: string;
  title: string;
  subtitle?: string | null;
  description: string;
  shortDescription?: string | null;
  thumbnail?: string | null;
  trailerVideoId?: string | null;
  games: Array<{
    gameId: string;
    weight: number;
  }>;
  instructor?: {
    name: string;
    bio?: string | null;
    avatar?: string | null;
  } | null;
  durationMinutes?: number | null;
  isSeeded?: boolean;
  isActive: boolean;
  isPublished: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type CoursesState = {
  courses: AdminCourse[];
  games: AdminGame[];
  hasLoadedCourses: boolean;
  hasLoadedGames: boolean;
  loadingCourses: boolean;
  loadingGames: boolean;
  error: string | null;
};
