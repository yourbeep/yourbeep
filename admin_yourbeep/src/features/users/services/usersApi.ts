import api from "../../../services/api";
import type { AdminUserDetail } from "../../../store/slices/users";

export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail> {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data?.data?.user as AdminUserDetail;
}
