// ============================================
// ExercisePage — Listening IELTS
// YouTube IFrame + Segment sync từ ipframe.js cũ
// Giữ nguyên HTML/CSS class từ Listening IELTS.html
// ============================================
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { lessonService } from '../services/lessonService';
import { attemptService } from '../services/attemptService';
import { noteService } from '../services/noteService';
import { normalizeText, extractYoutubeId, maskAnswer } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

// ── Google Fonts (inject once) ──
const FONTS_LOADED = '__listening_fonts__';
if (!window[FONTS_LOADED]) {
  window[FONTS_LOADED] = true;
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@400;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

export default function ExercisePage({ onOpenPremium }) {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isPremium } = useAuth();

  // Lưu mediaType để phân biệt audio/video
  const [mediaType, setMediaType] = useState(location.state?.mediaType || 'video');
  const [lesson, setLesson] = useState(null);
  const [segments, setSegments] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topicTitle, setTopicTitle] = useState(location.state?.title || 'Lesson');

  // ── YouTube player state ──
  const [player, setPlayer] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const playerRef = useRef(null);
  const pauseIntervalRef = useRef(null);

  // ── Answer state ──
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [allDone, setAllDone] = useState(false);

  // ── Note state ──
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteMsg, setNoteMsg] = useState('');

  // ── LOAD LESSON ──
  useEffect(() => {
    let cancelled = false;

    // Kiểm tra slug có phải ObjectId (24 ký tự hex) hay là topic slug
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(slug);

    async function load() {
      setLoading(true);
      setError(null);
      try {
        let lessonData;

        if (isObjectId) {
          // Load trực tiếp bằng lesson ID
          const { data } = await lessonService.getById(slug);
          lessonData = data.data || data;
        } else {
          // Load bằng topic slug: tìm lessons thuộc topic đó
          const { data } = await lessonService.getAll({ topicSlug: slug });
          const lessons = data.data || [];
          if (lessons.length === 0) {
            if (!cancelled) setError('Chủ đề này chưa có bài học nào. Vui lòng thêm bài học từ trang Admin.');
            return;
          }
          // Dùng bài học đầu tiên, nhưng cần load đầy đủ segments
          const firstLesson = lessons[0];
          const { data: detail } = await lessonService.getById(firstLesson._id);
          lessonData = detail.data || detail;
        }

        if (!cancelled && lessonData) {
          setLesson(lessonData);
          setTopicTitle(lessonData.title || location.state?.title || 'Lesson');
          const segs = lessonData.segments || [];
          setSegments(segs);
          // Cập nhật mediaType từ lesson hoặc giữ nguyên từ location state
          setMediaType(lessonData.mediaType || location.state?.mediaType || 'video');

          // Extract YouTube ID
          if (lessonData.youtubeUrl) {
            const ytId = extractYoutubeId(lessonData.youtubeUrl);
            if (ytId) setVideoId(ytId);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Không thể tải bài học');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  // ── INIT YOUTUBE PLAYER ──
  useEffect(() => {
    if (!videoId) return;

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };

      // If YT API already loaded via another script
      if (window.YT && window.YT.Player) {
        createPlayer();
      }
    } else {
      createPlayer();
    }

    function createPlayer() {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) { /* ignore */ }
      }

      playerRef.current = new window.YT.Player('youtube-player', {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            setPlayer(playerRef.current);
          },
          onStateChange: (event) => {
            // YT.PlayerState.ENDED = 0
            if (event.data === 0 && segments.length > 0) {
              handleSegmentEnd();
            }
          },
        },
      });
    }

    return () => {
      if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
    };
  }, [videoId]);

  // ── PLAY CURRENT SEGMENT ──
  const playCurrentSegment = useCallback(() => {
    if (!player || !playerReady || !segments.length || currentIdx >= segments.length) return;
    const seg = segments[currentIdx];
    if (!seg) return;

    if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);

    player.seekTo(seg.startTime || 0, true);
    player.playVideo();

    // Auto-pause at segment end
    if (seg.endTime) {
      pauseIntervalRef.current = setInterval(() => {
        try {
          const t = player.getCurrentTime();
          if (t >= seg.endTime) {
            player.pauseVideo();
            clearInterval(pauseIntervalRef.current);
            pauseIntervalRef.current = null;
          }
        } catch {
          clearInterval(pauseIntervalRef.current);
          pauseIntervalRef.current = null;
        }
      }, 200);
    }
  }, [player, playerReady, segments, currentIdx]);

  // ── Handle segment auto-end ──
  const handleSegmentEnd = useCallback(() => {
    // Auto-pause handled by interval; do nothing extra
  }, []);

  // ── PLAY SEGMENT BUTTON ──
  const handlePlay = useCallback(() => {
    // KHÔNG xóa answer khi replay — giữ lại nội dung user đã gõ
    setResult(null);
    playCurrentSegment();
  }, [playCurrentSegment]);

  // ── CHECK ANSWER ──
  const handleCheck = useCallback(async () => {
    if (!answer.trim()) return;

    setSubmitting(true);
    setResult(null);
    const seg = segments[currentIdx];
    if (!seg) { setSubmitting(false); return; }

    const normAnswer = normalizeText(answer);
    const normExpected = normalizeText(seg.content || '');

    if (normAnswer === normExpected) {
      setResult({ correct: true, expected: seg.content });

      // Submit to backend
      try {
        await attemptService.submit({
          lessonId: lesson?._id,
          segmentId: seg._id,
          answer: answer.trim(),
          correct: true,
        });
      } catch { /* silent */ }
    } else {
      // Mask: show correct words, hide everything from first error onward
      const masked = maskAnswer(seg.content, answer.trim());
      setResult({ correct: false, expected: seg.content, masked });
    }

    setSubmitting(false);
  }, [answer, segments, currentIdx, lesson]);

  // ── NEXT SEGMENT ──
  const handleNext = useCallback(() => {
    const next = currentIdx + 1;
    if (next < segments.length) {
      setResult(null);
      setAnswer('');
      setCurrentIdx(next);
    } else {
      setAllDone(true);

      // Submit final attempt
      if (lesson?._id) {
        const correctCount = segments.reduce((sum, s) => sum + (s._correct ? 1 : 0), 0);
        attemptService.submit({
          lessonId: lesson._id,
          score: segments.length > 0 ? Math.round((correctCount / segments.length) * 100) : 0,
          accuracy: segments.length > 0 ? Math.round((correctCount / segments.length) * 100) : 0,
          completed: true,
        }).catch(() => {});
      }
    }
  }, [currentIdx, segments, lesson]);

  // ── SKIP ──
  const handleSkip = useCallback(() => {
    setResult(null);
    setAnswer('');
    handleNext();
  }, [handleNext]);

  // ── PREVIOUS SEGMENT ──
  const handlePrev = useCallback(() => {
    if (currentIdx <= 0) return;
    setResult(null);
    setAnswer('');
    setCurrentIdx((prev) => prev - 1);
    if (player) player.pauseVideo();
  }, [currentIdx, player]);

  // ── SAVE NOTE ──
  const handleSaveNote = async (level) => {
    if (!lesson?._id || !currentSegment) return;
    setNoteSaving(true);
    setNoteMsg('');
    try {
      await noteService.save({
        lessonId: lesson._id,
        segmentId: currentSegment.segmentId || currentIdx + 1,
        segmentContent: currentSegment.content || '',
        difficultyLevel: level,
      });
      const label = level === 1 ? 'Dễ (7 ngày)' : level === 2 ? 'TB (3 ngày)' : 'Khó (1 ngày)';
      setNoteMsg(`✅ Đã lưu: ${label}`);
      setNoteOpen(false);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setNoteMsg('⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (status >= 500) {
        setNoteMsg('⚠️ Lỗi máy chủ. Vui lòng thử lại sau.');
      } else if (status === 400) {
        setNoteMsg('⚠️ ' + (err.response?.data?.message || 'Dữ liệu không hợp lệ'));
      } else {
        setNoteMsg('❌ ' + (err.response?.data?.message || 'Lỗi khi lưu ghi chú'));
      }
    } finally {
      setNoteSaving(false);
      setTimeout(() => setNoteMsg(''), 3000);
    }
  };

  // ── KEYBOARD ──
  useEffect(() => {
    function handleKey(e) {
      // Không xử lý phím tắt khi đang gõ trong input/textarea/select
      const tag = document.activeElement?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if (e.key === 'Escape') { navigate('/'); return; }

      // Enter: Check (chỉ khi đang focus textarea)
      if (e.key === 'Enter' && !e.shiftKey && tag === 'TEXTAREA') {
        e.preventDefault();
        handleCheck();
        return;
      }

      // Space: Replay segment (không kích hoạt khi đang gõ)
      if (e.key === ' ' && !isInput) {
        e.preventDefault();
        handlePlay();
        return;
      }

      // F: Previous segment
      if ((e.key === 'f' || e.key === 'F') && !isInput) {
        e.preventDefault();
        handlePrev();
        return;
      }

      // J: Next segment
      if ((e.key === 'j' || e.key === 'J') && !isInput) {
        e.preventDefault();
        handleNext();
        return;
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate, handleCheck, handlePlay, handleNext, handlePrev]);

  const currentSegment = segments[currentIdx] || null;
  const isAudio = mediaType === 'audio';

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

      {!loading && !error && segments.length === 0 && (
        <div style={{ color: 'var(--text-muted)', padding: 30, textAlign: 'center' }}>
          Chủ đề này chưa có bài tập.
        </div>
      )}

      {!loading && !error && segments.length > 0 && (
        <>
          {/* SECTION NAVIGATION (accordion style from old HTML) */}
          {segments.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              {segments.map((seg, i) => (
                <div
                  key={seg._id || i}
                  className={`section-item ${i === currentIdx ? 'open' : ''}`}
                  onClick={() => {
                    setCurrentIdx(i);
                    setResult(null);
                    setAnswer('');
                  }}
                >
                  <span>{seg.title || `Section ${i + 1}`}</span>
                  <span className="arrow">▶</span>
                </div>
              ))}
            </div>
          )}

          {/* SECTION DETAIL */}
          <div className="section-detail open" style={{ display: 'block' }}>
            {/* YouTube Player — Video mode */}
            {videoId && !isAudio && (
              <>
                <div className="yt-wrap" id="yt-wrap" style={{ display: 'block', position: 'relative' }}>
                  <div id="youtube-player" style={{ width: '100%', height: '100%' }}></div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <button className="btn-check" style={{ background: 'var(--blue)' }} onClick={handlePlay} title="Phím tắt: Space">▶ Play Segment</button>
                  <button className="btn-skip" onClick={() => { if (player) player.pauseVideo(); }}>⏸ Pause</button>
                </div>
              </>
            )}

            {/* Audio-only mode */}
            {videoId && isAudio && (
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '1rem 1.3rem', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 12, position: 'relative',
              }}>
                <span style={{ fontSize: 24 }}>🎵</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>Audio Mode</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Đang phát âm thanh (không hiển thị video)</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={handlePlay} title="Phím tắt: Space" style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500 }}>▶ Play</button>
                  <button onClick={() => { if (player) player.pauseVideo(); }} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>⏸ Pause</button>
                </div>
                <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                  <div id="youtube-player" style={{ width: 1, height: 1 }}></div>
                </div>
              </div>
            )}

            {/* No video at all */}
            {!videoId && (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 14, fontSize: 14 }}>
                🎵 Audio-only lesson — bấm ▶ Play để nghe
              </div>
            )}

            {/* Segment info */}
            <div style={{ marginBottom: 12 }}>
              <strong>
                {currentSegment?.title || `Segment ${currentIdx + 1}/${segments.length}`}
              </strong>
              {currentSegment?.startTime != null && (
                <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: 13 }}>
                  ({formatTimeDisplay(currentSegment.startTime)}
                  {currentSegment.endTime != null ? ` – ${formatTimeDisplay(currentSegment.endTime)}` : ''})
                </span>
              )}
            </div>

            {/* Answer Input */}
            <textarea
              placeholder="Type what you hear..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={allDone}
            />

            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn-check" onClick={handleCheck} disabled={submitting || !answer.trim() || allDone} title="Phím tắt: Enter">
                {submitting ? 'Đang kiểm tra...' : 'Check'}
              </button>

              {/* Note Button */}
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setNoteOpen(!noteOpen)} disabled={allDone}
                  style={{
                    padding: '9px 16px', borderRadius: 8, border: '1px solid #F59E0B',
                    background: noteOpen ? '#FEF3C7' : 'transparent', color: '#92400E',
                    cursor: allDone ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                    opacity: allDone ? 0.5 : 1,
                  }}
                >📝 Note</button>
                {noteOpen && (
                  <div style={{
                    position: 'absolute', bottom: '100%', left: 0, marginBottom: 6,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '6px 2px', zIndex: 50,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 180,
                  }}>
                    {[
                      { level: 1, label: '😊 Dễ', sub: 'Ôn sau 7 ngày', color: '#16A34A' },
                      { level: 2, label: '🤔 Trung bình', sub: 'Ôn sau 3 ngày', color: '#D97706' },
                      { level: 3, label: '😰 Khó', sub: 'Ôn sau 1 ngày', color: '#DC2626' },
                    ].map((opt) => (
                      <button key={opt.level} type="button"
                        onClick={() => handleSaveNote(opt.level)} disabled={noteSaving}
                        style={{
                          display: 'block', width: '100%', padding: '7px 12px', border: 'none',
                          background: 'transparent', cursor: 'pointer', textAlign: 'left',
                          fontFamily: 'inherit', fontSize: 13, borderRadius: 6,
                          color: 'var(--text-primary)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontWeight: 600, color: opt.color }}>{opt.label}</span>{' '}
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>— {opt.sub}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="btn-skip" onClick={handleSkip} disabled={allDone}>
                Skip
              </button>

              {/* Prev / Next */}
              <button onClick={handlePrev} disabled={currentIdx <= 0 || allDone} title="Phím tắt: F"
                style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: currentIdx <= 0 ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: 13, opacity: currentIdx <= 0 ? 0.4 : 1 }}
              >◀ Prev</button>
              <button onClick={handleNext} disabled={allDone} title="Phím tắt: J"
                style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}
              >Next ▶</button>
            </div>

            {/* Result */}
            {result && (
              <div style={{ marginTop: 16 }}>
                {result.correct ? (
                  <div style={{
                    background: '#DCFCE7', color: '#166534',
                    padding: '14px 18px', borderRadius: 10,
                    fontSize: 14, fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    ✅ Chính xác! — <span style={{ fontWeight: 600 }}>{result.expected}</span>
                  </div>
                ) : (
                  <div style={{
                    background: '#FEE2E2', color: '#991B1B',
                    padding: '14px 18px', borderRadius: 10,
                    fontSize: 14, fontWeight: 500
                  }}>
                    ❌ Chưa đúng. Gợi ý: <span style={{ fontWeight: 600 }}>{result.masked || '***'}</span>
                  </div>
                )}
                {!allDone && (
                  <button
                    className="btn-check"
                    style={{ marginTop: 10, background: '#059669' }}
                    onClick={handleNext}
                  >
                    {currentIdx < segments.length - 1 ? 'Next →' : 'Finish'}
                  </button>
                )}
              </div>
            )}

            {/* Note message */}
            {noteMsg && (
              <div style={{
                marginTop: 8, padding: '8px 14px', borderRadius: 8,
                background: noteMsg.startsWith('✅') ? '#DCFCE7' : '#FEF2F2',
                color: noteMsg.startsWith('✅') ? '#166534' : '#991B1B', fontSize: 13,
              }}>{noteMsg}</div>
            )}

            {/* All done */}
            {allDone && (
              <div style={{
                marginTop: 24, textAlign: 'center',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 14, padding: 30
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <h2 style={{ fontFamily: 'Sora, sans-serif', marginBottom: 8 }}>Bài tập hoàn thành!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                  Bạn đã hoàn thành tất cả {segments.length} câu hỏi.
                </p>
                <button
                  className="btn-check"
                  style={{ background: 'var(--blue)', padding: '12px 28px' }}
                  onClick={() => navigate('/')}
                >
                  ← Về trang chủ
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function formatTimeDisplay(seconds) {
  if (seconds == null) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
