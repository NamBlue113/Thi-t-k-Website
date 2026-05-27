// ============================================
// Note Service — Listening IELTS
// Spaced Repetition notes
// ============================================
import api from '../api/axiosInstance';

export const noteService = {
  save: (data) => api.post('/notes', data),

  getDue: () => api.get('/notes/due'),

  markReviewed: (id) => api.put(`/notes/${id}/reviewed`),

  delete: (id) => api.delete(`/notes/${id}`),
};
