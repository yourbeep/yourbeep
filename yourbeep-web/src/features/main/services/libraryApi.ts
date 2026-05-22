import api from "@services/api";
import type { GameLibraryItem } from "./libraryTypes";

type RawCourseListItem = {
  _id: string;
  title: string;
  thumbnail?: string | null;
};

type RawPurchase = {
  courseId: string;
  accessGranted?: boolean;
  status?: string;
};

type RawCourseDetail = {
  _id: string;
  title: string;
  thumbnail?: string | null;
  games?: Array<{
    _id?: string;
    gameId?:
      | string
      | {
          _id?: string;
          title?: string;
          key?: string;
        };
    title?: string;
    type?: string;
    gameKey?: string;
  }>;
};

const fallbackCourseImage =
  "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80";

export const libraryApi = {
  async getGameLibrary(): Promise<GameLibraryItem[]> {
    const [courseResponse, purchasesResponse] = await Promise.all([
      api.get("/courses"),
      api.get("/users/me/purchases").catch(() => null),
    ]);

    const rawCourses = (courseResponse.data?.data?.courses ?? []) as RawCourseListItem[];
    const purchases = (purchasesResponse?.data?.data?.purchases ?? []) as RawPurchase[];
    const accessibleCourseIds = new Set(
      purchases
        .filter((purchase) => purchase.accessGranted && purchase.status === "active")
        .map((purchase) => String(purchase.courseId)),
    );

    const courseDetails = await Promise.all(
      rawCourses.map((course) =>
        api
          .get(`/courses/${course._id}`)
          .then((response) => response.data?.data as RawCourseDetail)
          .catch(() => null),
      ),
    );

    return courseDetails.flatMap((detail, index) => {
      if (!detail?.games?.length) {
        return [];
      }

      const rawCourse = rawCourses[index];
      const hasAccess = accessibleCourseIds.has(String(rawCourse._id));

      return detail.games.map((game, gameIndex) => ({
        id: String(
          (typeof game.gameId === "string" ? game.gameId : game.gameId?._id) ||
            game._id ||
            `${detail._id}-${gameIndex}`,
        ),
        title:
          game.title ||
          (typeof game.gameId === "string" ? undefined : game.gameId?.title) ||
          "Interactive Practice",
        gameKey:
          game.gameKey ||
          (typeof game.gameId === "string" ? undefined : game.gameId?.key) ||
          "guided_game",
        type: game.type || "game",
        courseId: String(detail._id),
        courseTitle: detail.title,
        courseThumbnail:
          detail.thumbnail || rawCourse.thumbnail || fallbackCourseImage,
        hasAccess,
        badgeLabel: hasAccess ? "Ready to play" : "Unlock with course",
      }));
    });
  },
};
