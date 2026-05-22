import api from "../../../services/api";

export const listCourses = async () => {
  const response = await api.get("/admin/courses");
  return response.data?.data?.items ?? [];
};

export const listGames = async () => {
  const response = await api.get("/admin/games");
  return response.data?.data?.items ?? [];
};

export const getCourseDetail = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data?.data;
};

export const createCourseDraft = async (payload) => {
  const response = await api.post("/admin/courses", payload);
  return response.data?.data?.course;
};

export const updateCourseDraft = async (courseId, payload) => {
  const response = await api.put(`/admin/courses/${courseId}`, payload);
  return response.data?.data?.course;
};

export const listCoursePricing = async (courseId) => {
  const response = await api.get(`/admin/commerce/courses/${courseId}/pricing`);
  return response.data?.data?.items ?? [];
};

export const upsertCoursePricing = async (courseId, payload) => {
  const response = await api.put(`/admin/commerce/courses/${courseId}/pricing`, payload);
  return response.data?.data?.pricing;
};

export const deleteCoursePricing = async (courseId, region) => {
  const response = await api.delete(`/admin/commerce/courses/${courseId}/pricing/${region}`);
  return response.data?.data?.pricing;
};

export const createCourseVideoUploadUrl = async (courseId, payload) => {
  const response = await api.post(`/admin/courses/${courseId}/videos/upload-url`, payload);
  return response.data?.data;
};

export const getAdminCourseVideoStream = async (videoId) => {
  const response = await api.get(`/admin/videos/${videoId}/stream`);
  return response.data?.data;
};

export const createCourseTrailerUploadUrl = async (courseId, payload) => {
  const response = await api.post(`/admin/courses/${courseId}/trailer/upload-url`, payload);
  return response.data?.data;
};

export const getCourseTrailerStream = async (courseId) => {
  const response = await api.get(`/admin/courses/${courseId}/trailer/stream`);
  return response.data?.data;
};

export const uploadVideoToBunny = async ({ uploadUrl, headers, file }) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers,
    body: file,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Video upload failed.");
  }

  return true;
};

export const updateAdminVideo = async (videoId, payload) => {
  const response = await api.patch(`/admin/videos/${videoId}`, payload);
  return response.data?.data?.video;
};

export const deleteAdminVideo = async (videoId) => {
  const response = await api.delete(`/admin/videos/${videoId}`);
  return response.data?.data?.video;
};

export const listCourseContent = async (courseId) => {
  const response = await api.get(`/admin/courses/${courseId}/content`);
  return response.data?.data?.items ?? [];
};

export const createCourseContentItem = async (courseId, payload) => {
  const response = await api.post(`/admin/courses/${courseId}/content`, payload);
  return response.data?.data?.item;
};

export const updateCourseContentItem = async (itemId, payload) => {
  const response = await api.put(`/admin/content/${itemId}`, payload);
  return response.data?.data?.item;
};

export const deleteCourseContentItem = async (itemId) => {
  const response = await api.delete(`/admin/content/${itemId}`);
  return response.data?.data?.item;
};

export const reorderCourseContentItems = async (courseId, payload) => {
  const response = await api.put(`/admin/courses/${courseId}/content/reorder`, payload);
  return response.data?.data?.items ?? [];
};

export const listVideoCues = async (videoId) => {
  const response = await api.get(`/admin/videos/${videoId}/cues`);
  return response.data?.data?.items ?? [];
};

export const createVideoCue = async (videoId, payload) => {
  const response = await api.post(`/admin/videos/${videoId}/cues`, payload);
  return response.data?.data?.cue;
};

export const updateVideoCue = async (cueId, payload) => {
  const response = await api.put(`/admin/video-cues/${cueId}`, payload);
  return response.data?.data?.cue;
};

export const deleteVideoCue = async (cueId) => {
  const response = await api.delete(`/admin/video-cues/${cueId}`);
  return response.data?.data?.cue;
};
