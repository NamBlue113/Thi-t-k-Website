// ============================================
// Speech Service — Listening IELTS
// ============================================
import api from '../api/axiosInstance';

export const speechService = {
  analyze: (formData) =>
    api.post('/speech/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
