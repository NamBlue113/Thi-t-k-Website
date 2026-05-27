// ============================================
// TopicDetailPage — Danh sách bài học + Admin Sửa/Xóa
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { topicService } from '../services/topicService';
import { lessonService } from '../services/lessonService';
import { useAuth } from '../context/AuthContext';
import { getThumbColor, getTopicEmoji } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EditLessonForm from '../components/admin/EditLessonForm';
import Toast from '../components/ui/Toast';

export default function TopicDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [topic, setTopic] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin state
  const [editingLesson, setEditingLesson] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: topicRes } = await topicService.getById(slug);
      setTopic(topicRes.data || topicRes);
      const { data: lessonRes } = await lessonService.getAll({ topicSlug: slug });
      setLessons(lessonRes.data || []);
    } catch (err) {
      if (err.response?.status === 404) setError('Không tìm thấy chủ đề này.');
      else setError(err.response?.data?.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await lessonService.delete(deletingId);
      showToast('🗑️ Bài học đã được xóa');
      setDeletingId(null);
      loadData();
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Lỗi khi xóa'));
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSuccess = (msg) => {
    setEditingLesson(null);
    showToast(msg);
    loadData();
  };

  if (loading) return <LoadingSpinner text="Đang tải..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!topic) return <ErrorMessage message="Không tìm thấy chủ đề." />;

  const isVideo = topic.mediaType === 'video';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: '1.5rem' }}>← Quay lại All Topics</Link>

      {/* Topic Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.8rem', padding: '1.5rem', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, background: getThumbColor(0), flexShrink: 0 }}>{getTopicEmoji(topic.title)}</div>
        <div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {topic.title}
            {isVideo && <span className="badge-video" style={{ marginLeft: 8 }}>Video</span>}
            {topic.isPremium && <span className="badge-premium-only" style={{ marginLeft: 8 }}>Premium</span>}
          </h1>
          {topic.description && <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '6px 0 0' }}>{topic.description}</p>}
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            <span>📚 <strong>{topic.lessonCount || lessons.length}</strong> bài học</span>
            {topic.levels?.length > 0 && <span>📊 {topic.levels.join('–')}</span>}
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, color: 'var(--text-primary)', marginBottom: '1rem' }}>📖 Danh sách bài học</h2>

      {lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 15, marginBottom: 16 }}>Chủ đề này chưa có bài học nào.</p>
          {isAdmin ? <Link to="/admin" style={{ padding: '8px 20px', borderRadius: 8, background: 'var(--blue)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>⚙️ Thêm bài học ngay</Link> : <p style={{ fontSize: 13 }}>Vui lòng quay lại sau.</p>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lessons.map((lesson, i) => (
            <div key={lesson._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.3rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, transition: 'border-color 0.15s, box-shadow 0.15s' }}>
              <div
                onClick={() => navigate(`/exercise/${lesson._id}`, { state: { title: lesson.title, mediaType: topic?.mediaType || 'video' } })}
                style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, cursor: 'pointer' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: getThumbColor(i), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{lesson.title}{lesson.isPremium && <span className="badge-premium-only" style={{ marginLeft: 6, fontSize: 10 }}>Premium</span>}</div>
                  {lesson.description && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{lesson.description.length > 80 ? lesson.description.slice(0, 80) + '...' : lesson.description}</div>}
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto', marginRight: 12 }}>{lesson.segments?.length || 0} phân đoạn</span>
              </div>

              {/* Admin buttons */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setEditingLesson(lesson)} style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid var(--blue)', background: 'transparent', color: 'var(--blue)', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit' }}>✏️ Sửa</button>
                  <button onClick={() => setDeletingId(lesson._id)} style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid #EF4444', background: 'transparent', color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit' }}>🗑️ Xóa</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingLesson && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setEditingLesson(null); }}>
          <div className="modal" style={{ maxWidth: 600, maxHeight: '85vh', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingLesson(null)}>✕</button>
            <EditLessonForm lesson={editingLesson} onSuccess={handleEditSuccess} onCancel={() => setEditingLesson(null)} />
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deletingId && (
        <div className="modal-overlay open" onClick={() => setDeletingId(null)}>
          <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, marginBottom: 12 }}>🗑️ Xác nhận xóa</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>Bạn có chắc muốn xóa bài học này? Hành động này không thể hoàn tác.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={handleDelete} disabled={deleting} style={{ padding: '8px 24px', borderRadius: 8, border: 'none', background: '#EF4444', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 500 }}>{deleting ? 'Đang xóa...' : 'Xóa'}</button>
              <button onClick={() => setDeletingId(null)} style={{ padding: '8px 24px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </div>
  );
}
