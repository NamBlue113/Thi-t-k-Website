// ============================================
// Lesson Service — Listening IELTS
// Lấy bài học kèm mảng segments nhúng
// ============================================
import api from '../api/axiosInstance';

export const lessonService = {
  getById: (id) => api.get(`/lessons/${id}`),

  getAll: (params = {}) => api.get('/lessons', { params }),

  create: (data) => api.post('/lessons', data),

  update: (id, data) => api.put(`/lessons/${id}`, data),

  delete: (id) => api.delete(`/lessons/${id}`),
};
