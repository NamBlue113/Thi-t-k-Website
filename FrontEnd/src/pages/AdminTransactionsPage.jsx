// ============================================
// AdminTransactionsPage — Duyệt nâng cấp Premium
// Chỉ Admin mới truy cập được
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Toast from '../components/ui/Toast';

export default function AdminTransactionsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null); // id đang xử lý
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await transactionService.getPending();
      setTransactions(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await transactionService.approve(id);
      showToast('✅ Đã duyệt và kích hoạt Premium cho user!');
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Lỗi duyệt'));
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      await transactionService.reject(id);
      showToast('🗑️ Đã từ chối yêu cầu.');
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Lỗi'));
    } finally {
      setProcessing(null);
    }
  };

  if (authLoading) {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Đang kiểm tra quyền...</div>;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>← Quay lại Admin</Link>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
          💰 Duyệt nâng cấp Premium
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Quản lý các yêu cầu nâng cấp tài khoản từ người dùng.
        </p>
      </div>

      {loading && <LoadingSpinner text="Đang tải..." />}
      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {!loading && !error && transactions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 15 }}>Không có yêu cầu nào đang chờ duyệt.</p>
        </div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            background: 'var(--surface)', borderRadius: 12,
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Người dùng</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Gói</th>
                <th style={thStyle}>Số tiền</th>
                <th style={thStyle}>Thời gian</th>
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.username}</span>
                  </td>
                  <td style={tdStyle}>{tx.email}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                      background: tx.packageType === 'premium_plus' ? '#FEF3C7' : '#DBEAFE',
                      color: tx.packageType === 'premium_plus' ? '#92400E' : '#1E40AF',
                    }}>
                      {tx.packageType === 'premium' ? '⭐ Premium' : '👑 Premium+'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--blue)' }}>
                    {tx.amount?.toLocaleString('vi-VN')}₫
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(tx.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleApprove(tx._id)}
                        disabled={processing === tx._id}
                        style={{
                          padding: '6px 14px', borderRadius: 6, border: 'none',
                          background: processing === tx._id ? '#94A3B8' : '#16A34A',
                          color: '#fff', cursor: processing === tx._id ? 'default' : 'pointer',
                          fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                        }}
                      >
                        {processing === tx._id ? '...' : '✓ Duyệt'}
                      </button>
                      <button
                        onClick={() => handleReject(tx._id)}
                        disabled={processing === tx._id}
                        style={{
                          padding: '6px 14px', borderRadius: 6, border: '1px solid #EF4444',
                          background: 'transparent', color: '#EF4444',
                          cursor: processing === tx._id ? 'default' : 'pointer',
                          fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                        }}
                      >
                        ✕ Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </div>
  );
}

const thStyle = {
  padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600,
  color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px',
};
const tdStyle = {
  padding: '12px 16px', fontSize: 14, color: 'var(--text-secondary)',
};
