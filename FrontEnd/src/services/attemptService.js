// ============================================
// Attempt Service — Listening IELTS
// Lưu kết quả làm bài
// ============================================
import api from '../api/axiosInstance';

export const attemptService = {
  check: (sectionId, answer) =>
    api.post('/attempts/check', { sectionId, answer }),

  submit: (data) =>
    api.post('/attempts', data),
};
