// ============================================
// AdminPage — Listening IELTS
// Chỉ hiển thị khi user.role === 'admin'
// ============================================
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddTopicForm from '../components/admin/AddTopicForm';
import AddLessonForm from '../components/admin/AddLessonForm';
import Toast from '../components/ui/Toast';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('topic');
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Chặn truy cập nếu đang load hoặc không phải admin
  if (loading) {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Đang kiểm tra quyền...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
          ⚙️ Quản trị Admin
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Xin chào, <strong>{user?.username}</strong> — Bạn đang ở trang quản trị.
        </p>
        <div style={{ marginTop: 10 }}>
          <Link to="/admin/transactions" style={{
            padding: '7px 18px', borderRadius: 8, background: '#FEF3C7',
            color: '#92400E', textDecoration: 'none', fontSize: 13, fontWeight: 500,
            display: 'inline-block',
          }}>
            💰 Duyệt nâng cấp Premium
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        <button
          onClick={() => setActiveTab('topic')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'topic' ? 'var(--blue)' : 'transparent',
            color: activeTab === 'topic' ? '#fff' : 'var(--text-secondary)',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          📚 Thêm Chủ đề
        </button>
        <button
          onClick={() => setActiveTab('lesson')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'lesson' ? 'var(--blue)' : 'transparent',
            color: activeTab === 'lesson' ? '#fff' : 'var(--text-secondary)',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          🎬 Thêm Bài học
        </button>
      </div>

      {/* Form area */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '2rem',
      }}>
        {activeTab === 'topic' ? (
          <AddTopicForm onSuccess={(msg) => showToast(msg)} />
        ) : (
          <AddLessonForm onSuccess={(msg) => showToast(msg)} />
        )}
      </div>

      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </div>
  );
}
