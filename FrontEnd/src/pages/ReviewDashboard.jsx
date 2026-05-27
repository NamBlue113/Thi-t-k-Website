// ============================================
// ReviewDashboard — Ôn tập Spaced Repetition
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { noteService } from '../services/noteService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const DIFF_LABELS = { 1: '😊 Dễ', 2: '🤔 TB', 3: '😰 Khó' };
const DIFF_COLORS = { 1: '#16A34A', 2: '#D97706', 3: '#DC2626' };

export default function ReviewDashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await noteService.getDue();
      setNotes(data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Vui lòng đăng nhập để xem bài ôn tập.');
      } else {
        setError(err.response?.data?.message || 'Không thể tải danh sách ôn tập');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const handleMarkReviewed = async (id) => {
    try {
      await noteService.markReviewed(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch { /* ignore */ }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 700, margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <p style={{ fontSize: 16 }}>Vui lòng đăng nhập để xem bài ôn tập.</p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner text="Đang tải danh sách ôn tập..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadNotes} />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
        📝 Bài học cần ôn tập
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: '1.5rem' }}>
        Các câu hỏi đã đến hạn ôn tập theo phương pháp Spaced Repetition.
      </p>

      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>Không có bài nào cần ôn tập!</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Hãy luyện tập thêm và ghi chú các câu khó để hệ thống nhắc bạn ôn lại.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notes.map((note, i) => (
            <div key={note._id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.3rem', background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
                    {note.lessonId?.title || 'Bài học'}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                    background: DIFF_COLORS[note.difficultyLevel] + '20',
                    color: DIFF_COLORS[note.difficultyLevel],
                  }}>
                    {DIFF_LABELS[note.difficultyLevel]}
                  </span>
                </div>
                {note.segmentContent && (
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    "{note.segmentContent.length > 60 ? note.segmentContent.slice(0, 60) + '...' : note.segmentContent}"
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Phân đoạn #{note.segmentId} · Hạn ôn: {new Date(note.nextReviewDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => navigate(`/exercise/${note.lessonId?._id}`, { state: { title: note.lessonId?.title } })}
                  style={{
                    padding: '6px 14px', borderRadius: 6, border: '1px solid var(--blue)',
                    background: 'transparent', color: 'var(--blue)', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                  }}
                >
                  ▶ Luyện
                </button>
                <button
                  onClick={() => handleMarkReviewed(note._id)}
                  style={{
                    padding: '6px 14px', borderRadius: 6, border: '1px solid #16A34A',
                    background: 'transparent', color: '#16A34A', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                  }}
                >
                  ✓ Xong
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
