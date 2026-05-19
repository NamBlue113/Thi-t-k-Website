// ============================================
// ExercisePage — Listening IELTS
// Dynamic: loads section từ /api/topics/:id/sections
// ============================================
import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ExercisePlayer from '../components/exercise/ExercisePlayer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { topicService } from '../services/topicService';

export default function ExercisePage({ onOpenPremium }) {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isPremium } = useAuth();

  const [sections, setSections] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topicTitle, setTopicTitle] = useState(location.state?.title || slug || 'Lesson');
  const [isVideo, setIsVideo] = useState(location.state?.mediaType === 'video');

  // ── LOAD SECTIONS ──
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // First find topic by slug or id
        const { data: topicsData } = await topicService.getAll();
        const topics = topicsData.data?.topics || [];
        const topic = topics.find(
          (t) => t.slug === slug || t._id === slug
        );

        if (!topic) {
          setError('Không tìm thấy chủ đề');
          setLoading(false);
          return;
        }

        // Premium check
        if (topic.isPremium && !isPremium) {
          onOpenPremium(topic.title);
          navigate('/');
          return;
        }

        setTopicTitle(topic.title);
        setIsVideo(topic.mediaType === 'video');

        // Load sections
        const { data: sectionsData } = await topicService.getSections(topic._id);
        if (!cancelled) {
          setSections(sectionsData.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Không thể tải bài tập');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug, isPremium, onOpenPremium, navigate]);

  // ── NEXT QUESTION ──
  const handleNextQuestion = useCallback(() => {
    setCurrentIdx((prev) => {
      const next = prev + 1;
      return next >= sections.length ? 0 : next;
    });
  }, [sections.length]);

  // ── KEYBOARD SHORTCUTS ──
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') navigate('/');
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  const currentSection = sections[currentIdx] || null;

  return (
    <div className="exercise-wrap">
      <div className="breadcrumb">
        <Link to="/">All topics</Link>
        <span>/</span>
        <span>{topicTitle}</span>
      </div>
      <h1>{topicTitle}</h1>

      {loading && <LoadingSpinner text="Đang tải bài tập..." />}
      {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}

      {!loading && !error && sections.length === 0 && (
        <div style={{ color: 'var(--text-muted)', padding: 30, textAlign: 'center' }}>
          Chủ đề này chưa có bài tập.
        </div>
      )}

      {!loading && !error && sections.length > 0 && (
        <>
          {/* Section navigation */}
          {sections.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              {sections.map((sec, i) => (
                <div
                  key={sec._id || i}
                  className={`section-item ${i === currentIdx ? 'open' : ''}`}
                  onClick={() => setCurrentIdx(i)}
                >
                  <span>{sec.title || `Section ${i + 1}`}</span>
                  <span className="arrow">▶</span>
                </div>
              ))}
            </div>
          )}

          <ExercisePlayer
            key={currentSection?._id || currentIdx}
            section={currentSection}
            onNextQuestion={handleNextQuestion}
            isVideo={isVideo}
          />
        </>
      )}
    </div>
  );
}
