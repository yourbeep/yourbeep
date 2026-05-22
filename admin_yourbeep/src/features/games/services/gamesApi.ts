import api from "../../../services/api";

type GameUpsertPayload = {
  key?: string;
  title: string;
  description?: string;
};

export const gamesApi = {
  listGames: () => api.get("/admin/games"),
  createGame: (payload: GameUpsertPayload) => api.post("/admin/games", payload),
  updateGame: (gameId: string, payload: GameUpsertPayload) =>
    api.put(`/admin/games/${gameId}`, payload),
  deleteGame: (gameId: string) => api.delete(`/admin/games/${gameId}`),
  restoreGame: (gameId: string) => api.post(`/admin/games/${gameId}/restore`),
};
