import api from "../../../services/api";
import type { UpdateAdminProfilePayload } from "../../../store/slices/profile";

export const profileApi = {
  getCurrentProfile: () => api.get("/users/me"),
  updateCurrentProfile: (payload: UpdateAdminProfilePayload) =>
    api.patch("/users/me", payload),
};
