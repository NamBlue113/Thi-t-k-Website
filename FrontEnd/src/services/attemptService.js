// ============================================
// Attempt Service — Listening IELTS
// ============================================
import api from '../api/axiosInstance';

export const attemptService = {
  check: (sectionId, answer) =>
    api.post('/attempts/check', { sectionId, answer }),
};
