import api from "../../../services/api";

export const testimonialsApi = {
  listTestimonials: (params) => api.get("/admin/testimonials", { params }),
  getTestimonial: (testimonialId) => api.get(`/admin/testimonials/${testimonialId}`),
  createTestimonial: (payload) => api.post("/admin/testimonials", payload),
  updateTestimonial: (testimonialId, payload) =>
    api.patch(`/admin/testimonials/${testimonialId}`, payload),
  hideTestimonial: (testimonialId) => api.delete(`/admin/testimonials/${testimonialId}`),
};
