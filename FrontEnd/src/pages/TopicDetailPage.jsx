// ============================================
// TopicDetailPage — Hiển thị danh sách bài học của 1 chủ đề
// ============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { topicService } from '../services/topicService';
import { lessonService } from '../services/lessonService';
import { useAuth } from '../context/AuthContext';
import { getThumbColor, getTopicEmoji } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function TopicDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [topic, setTopic] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Load topic info
        const { data: topicRes } = await topicService.getById(slug);
        const topicData = topicRes.data || topicRes;
        if (!cancelled) setTopic(topicData);

        // Load lessons for this topic
        const { data: lessonRes } = await lessonService.getAll({ topicSlug: slug });
        const lessonList = lessonRes.data || [];
        if (!cancelled) setLessons(lessonList);
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) {
            setError('Không tìm thấy chủ đề này.');
          } else {
            setError(err.response?.data?.message || 'Không thể tải dữ liệu');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <LoadingSpinner text="Đang tải..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!topic) return <ErrorMessage message="Không tìm thấy chủ đề." />;

  const isVideo = topic.mediaType === 'video';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>
          ← Quay lại All Topics
        </Link>
      </div>

      {/* Topic Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.8rem',
        padding: '1.5rem', background: 'var(--surface)', borderRadius: 14,
        border: '1px solid var(--border)',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 14, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 28,
          background: getThumbColor(0), flexShrink: 0,
        }}>
          {getTopicEmoji(topic.title)}
        </div>
        <div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {topic.title}
            {isVideo && <span className="badge-video" style={{ marginLeft: 8 }}>Video</span>}
            {topic.isPremium && <span className="badge-premium-only" style={{ marginLeft: 8 }}>Premium</span>}
          </h1>
          {topic.description && (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '6px 0 0' }}>{topic.description}</p>
          )}
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            <span>📚 <strong>{topic.lessonCount || lessons.length}</strong> bài học</span>
            {topic.levels?.length > 0 && <span>📊 {topic.levels.join('–')}</span>}
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, color: 'var(--text-primary)', marginBottom: '1rem' }}>
        📖 Danh sách bài học
      </h2>

      {lessons.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)',
          background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 15, marginBottom: 16 }}>Chủ đề này chưa có bài học nào.</p>
          {isAdmin ? (
            <Link to="/admin" style={{
              padding: '8px 20px', borderRadius: 8, background: 'var(--blue)',
              color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500,
              display: 'inline-block',
            }}>
              ⚙️ Thêm bài học ngay
            </Link>
          ) : (
            <p style={{ fontSize: 13 }}>Vui lòng quay lại sau.</p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lessons.map((lesson, i) => (
            <div
              key={lesson._id}
              onClick={() => navigate(`/exercise/${lesson._id}`, {
                state: { title: lesson.title },
              })}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.3rem', background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 10,
                cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--blue)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,111,212,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: getThumbColor(i),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
                    {lesson.title}
                    {lesson.isPremium && <span className="badge-premium-only" style={{ marginLeft: 6, fontSize: 10 }}>Premium</span>}
                  </div>
                  {lesson.description && (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                      {lesson.description.length > 80 ? lesson.description.slice(0, 80) + '...' : lesson.description}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {lesson.segments?.length || 0} phân đoạn
                </span>
                <span style={{ color: 'var(--blue)', fontSize: 18 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
