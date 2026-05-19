// ============================================
// Topic Service — Listening IELTS
// ============================================
import api from '../api/axiosInstance';

export const topicService = {
  getAll: (params = {}) => api.get('/topics', { params }),

  getById: (id) => api.get(`/topics/${id}`),

  create: (data) => api.post('/topics', data),

  getSections: (topicId) => api.get(`/topics/${topicId}/sections`),
};
