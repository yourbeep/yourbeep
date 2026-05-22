import api from "@services/api";
import type { MainDashboardData } from "@store/slices/main/mainTypes";

export const mainApi = {
  getDashboard: async () => {
    const response = await api.get("/users/me/dashboard");
    return response.data?.data as MainDashboardData;
  },
};
