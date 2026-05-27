// ============================================
// Transaction Service — Premium upgrade requests
// ============================================
import api from '../api/axiosInstance';

export const transactionService = {
  request: (data) => api.post('/transactions/request', data),

  getPending: () => api.get('/transactions/pending'),

  approve: (id) => api.post(`/transactions/approve/${id}`),

  reject: (id) => api.post(`/transactions/reject/${id}`),
};
