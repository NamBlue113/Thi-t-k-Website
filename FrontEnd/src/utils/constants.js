// ============================================
// Constants — Listening IELTS
// ============================================

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const STORAGE_KEYS = {
  TOKEN: 'listeningielts-token',
  USER: 'listeningielts-user',
  THEME: 'listeningielts-theme',
  PREMIUM: 'listeningielts-premium',
};

export const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'beginner', label: 'Beginner (A1–A2)' },
  { value: 'intermediate', label: 'Intermediate (B1–B2)' },
  { value: 'advanced', label: 'Advanced (C1–C2)' },
  { value: 'video', label: 'Video' },
];

export const PLANS = {
  FREE: { name: 'FREE', price: '$0', period: '/tháng' },
  PREMIUM: { name: 'PREMIUM', price: '$4.99', period: '/tháng' },
  PREMIUM_PLUS: { name: 'PREMIUM+', price: '$9.99', period: '/tháng' },
};
