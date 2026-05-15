// ============================================
// AI Service — Listening IELTS
// ============================================
import api from '../api/axiosInstance';

export const aiService = {
  chat: (message) => api.post('/ai/chat', { message }),
};
