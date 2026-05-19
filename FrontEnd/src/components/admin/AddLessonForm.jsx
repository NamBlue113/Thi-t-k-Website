// ============================================
// AddLessonForm — Admin tạo bài học + nhúng câu hỏi
// POST /api/lessons
// ============================================
import { useState, useEffect } from 'react';
import { topicService } from '../../services/topicService';
import { lessonService } from '../../services/lessonService';

const EMPTY_SEGMENT = { startTime: '', endTime: '', content: '' };

const INITIAL = {
  topicId: '',
  title: '',
  description: '',
  youtubeUrl: '',
  fullTranscript: '',
  isPremium: false,
  segments: [{ ...EMPTY_SEGMENT }],
};

export default function AddLessonForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL);
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Tải danh sách topics cho dropdown
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await topicService.getAll();
        if (!cancelled) setTopics(data.data || []);
      } catch {
        if (!cancelled) setTopics([]);
      } finally {
        if (!cancelled) setLoadingTopics(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSegmentChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.segments];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, segments: updated };
    });
  };

  const addSegment = () => {
    setForm((prev) => ({
      ...prev,
      segments: [...prev.segments, { ...EMPTY_SEGMENT }],
    }));
  };

  const removeSegment = (index) => {
    if (form.segments.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      segments: prev.segments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.topicId || !form.title.trim() || !form.description.trim() || !form.youtubeUrl.trim() || !form.fullTranscript.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (Topic, Title, Description, YouTube URL, Transcript).');
      return;
    }

    // Validate segments
    for (let i = 0; i < form.segments.length; i++) {
      const seg = form.segments[i];
      if (!seg.startTime || !seg.endTime || !seg.content.trim()) {
        setError(`Phân đoạn #${i + 1}: vui lòng điền đầy đủ Start Time, End Time và Content.`);
        return;
      }
      if (Number(seg.startTime) >= Number(seg.endTime)) {
        setError(`Phân đoạn #${i + 1}: Start Time phải nhỏ hơn End Time.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        topicId: form.topicId,
        title: form.title.trim(),
        description: form.description.trim(),
        youtubeUrl: form.youtubeUrl.trim(),
        fullTranscript: form.fullTranscript.trim(),
        isPremium: form.isPremium,
        segments: form.segments.map((seg, i) => ({
          segmentId: i + 1,
          startTime: Number(seg.startTime),
          endTime: Number(seg.endTime),
          content: seg.content.trim(),
        })),
      };

      await lessonService.create(payload);
      setForm(INITIAL);
      onSuccess('✅ Bài học đã được tạo thành công!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi khi tạo bài học';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, marginBottom: '1.2rem', color: 'var(--text-primary)' }}>
        🎬 Tạo Bài học mới
      </h3>

      {error && (
        <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#FEF2F2', borderRadius: 8 }}>
          {error}
        </div>
      )}

      {/* Chọn Topic */}
      <div className="form-group">
        <label>Chủ đề (Topic) *</label>
        <select name="topicId" value={form.topicId} onChange={handleFieldChange} disabled={loadingTopics}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 14 }}
        >
          <option value="">{loadingTopics ? 'Đang tải...' : '-- Chọn chủ đề --'}</option>
          {topics.map((t) => (
            <option key={t._id} value={t._id}>{t.title} {t.isPremium ? '🔒' : ''}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="form-group">
        <label>Tiêu đề bài học *</label>
        <input type="text" name="title" placeholder="VD: Phân biệt âm /i:/ và /ɪ/" value={form.title} onChange={handleFieldChange} />
      </div>

      {/* Description */}
      <div className="form-group">
        <label>Mô tả *</label>
        <textarea name="description" rows={2} placeholder="Mô tả ngắn về bài học..." value={form.description} onChange={handleFieldChange}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 14, resize: 'vertical' }}
        />
      </div>

      {/* YouTube URL */}
      <div className="form-group">
        <label>Link YouTube *</label>
        <input type="text" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." value={form.youtubeUrl} onChange={handleFieldChange} />
      </div>

      {/* Full Transcript */}
      <div className="form-group">
        <label>Toàn văn (Full Transcript) *</label>
        <textarea name="fullTranscript" rows={4} placeholder="Nội dung transcript đầy đủ của video..." value={form.fullTranscript} onChange={handleFieldChange}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 14, resize: 'vertical' }}
        />
      </div>

      {/* Premium checkbox */}
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" name="isPremium" id="isPremium" checked={form.isPremium} onChange={handleFieldChange}
          style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--blue)' }}
        />
        <label htmlFor="isPremium" style={{ margin: 0, cursor: 'pointer', color: 'var(--text-primary)' }}>
          🔒 Đánh dấu là bài học Premium
        </label>
      </div>

      {/* ── SEGMENTS ── */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>
            ✂️ Phân đoạn câu hỏi (Segments)
          </h4>
          <button type="button" onClick={addSegment}
            style={{
              padding: '6px 14px', borderRadius: 8, border: '1px solid var(--blue)', background: 'transparent',
              color: 'var(--blue)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
            }}
          >
            + Thêm phân đoạn
          </button>
        </div>

        {form.segments.map((seg, index) => (
          <div key={index} style={{
            background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem',
            marginBottom: '0.8rem', position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)' }}>Phân đoạn #{index + 1}</span>
              {form.segments.length > 1 && (
                <button type="button" onClick={() => removeSegment(index)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 6px' }}
                  title="Xóa phân đoạn"
                >✕</button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Start Time (giây) *</label>
                <input type="number" step="0.1" min="0" placeholder="VD: 10.5"
                  value={seg.startTime} onChange={(e) => handleSegmentChange(index, 'startTime', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>End Time (giây) *</label>
                <input type="number" step="0.1" min="0" placeholder="VD: 15.2"
                  value={seg.endTime} onChange={(e) => handleSegmentChange(index, 'endTime', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 13 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Đáp án chuẩn (Content) *</label>
              <input type="text" placeholder="Câu trả lời đúng cho phân đoạn này..."
                value={seg.content} onChange={(e) => handleSegmentChange(index, 'content', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 13 }}
              />
            </div>
          </div>
        ))}

        {form.segments.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '1rem' }}>
            Chưa có phân đoạn nào. Bấm "Thêm phân đoạn" để bắt đầu.
          </p>
        )}
      </div>

      <button className="btn-submit" type="submit" disabled={submitting} style={{ marginTop: '1.2rem' }}>
        {submitting ? 'Đang nộp...' : '🚀 Hoàn tất nộp bài học'}
      </button>
    </form>
  );
}
