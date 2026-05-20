// ============================================
// EditLessonForm — Admin sửa bài học
// Nạp sẵn dữ liệu cũ, cho phép sửa segments
// ============================================
import { useState, useEffect } from 'react';
import { topicService } from '../../services/topicService';
import { lessonService } from '../../services/lessonService';

const EMPTY_SEGMENT = { startTime: '', endTime: '', content: '' };

export default function EditLessonForm({ lesson, onSuccess, onCancel }) {
  const [form, setForm] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Khởi tạo form từ dữ liệu lesson
  useEffect(() => {
    if (!lesson) return;
    setForm({
      topicId: lesson.topicId?._id || lesson.topicId || '',
      title: lesson.title || '',
      description: lesson.description || '',
      youtubeUrl: lesson.youtubeUrl || '',
      fullTranscript: lesson.fullTranscript || '',
      isPremium: lesson.isPremium || false,
      segments: (lesson.segments || []).map((s) => ({
        startTime: s.startTime ?? '',
        endTime: s.endTime ?? '',
        content: s.content || '',
      })),
    });
  }, [lesson]);

  // Tải danh sách topics
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await topicService.getAll();
        if (!cancelled) setTopics(data.data || []);
      } catch { if (!cancelled) setTopics([]); }
      finally { if (!cancelled) setLoadingTopics(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!form) return null;

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSegmentChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.segments];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, segments: updated };
    });
  };

  const addSegment = () => {
    setForm((prev) => ({ ...prev, segments: [...prev.segments, { ...EMPTY_SEGMENT }] }));
  };

  const removeSegment = (index) => {
    if (form.segments.length <= 1) return;
    setForm((prev) => ({ ...prev, segments: prev.segments.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.topicId || !form.title.trim() || !form.description.trim() || !form.youtubeUrl.trim() || !form.fullTranscript.trim()) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    for (let i = 0; i < form.segments.length; i++) {
      const seg = form.segments[i];
      if (!seg.startTime || !seg.endTime || !seg.content.trim()) {
        setError(`Phân đoạn #${i + 1}: vui lòng điền đầy đủ.`);
        return;
      }
      if (Number(seg.startTime) >= Number(seg.endTime)) {
        setError(`Phân đoạn #${i + 1}: Start Time < End Time.`);
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

      await lessonService.update(lesson._id, payload);
      onSuccess('✅ Bài học đã được cập nhật!');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 14 };

  return (
    <form onSubmit={handleSubmit} style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 4 }}>
      <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, marginBottom: '1rem', color: 'var(--text-primary)' }}>
        ✏️ Sửa bài học: {lesson.title}
      </h3>

      {error && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#FEF2F2', borderRadius: 8 }}>{error}</div>}

      <div className="form-group">
        <label>Chủ đề *</label>
        <select name="topicId" value={form.topicId} onChange={handleFieldChange} disabled={loadingTopics} style={fieldStyle}>
          <option value="">{loadingTopics ? 'Đang tải...' : '-- Chọn chủ đề --'}</option>
          {topics.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
        </select>
      </div>
      <div className="form-group"><label>Tiêu đề *</label><input type="text" name="title" value={form.title} onChange={handleFieldChange} /></div>
      <div className="form-group"><label>Mô tả *</label><textarea name="description" rows={2} value={form.description} onChange={handleFieldChange} style={{ ...fieldStyle, resize: 'vertical' }} /></div>
      <div className="form-group"><label>YouTube URL *</label><input type="text" name="youtubeUrl" value={form.youtubeUrl} onChange={handleFieldChange} /></div>
      <div className="form-group"><label>Transcript *</label><textarea name="fullTranscript" rows={3} value={form.fullTranscript} onChange={handleFieldChange} style={{ ...fieldStyle, resize: 'vertical' }} /></div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" name="isPremium" id="editPremium" checked={form.isPremium} onChange={handleFieldChange} style={{ width: 18, height: 18, accentColor: 'var(--blue)' }} />
        <label htmlFor="editPremium" style={{ margin: 0, cursor: 'pointer' }}>🔒 Premium</label>
      </div>

      {/* Segments */}
      <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
          <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, margin: 0 }}>✂️ Phân đoạn</h4>
          <button type="button" onClick={addSegment} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid var(--blue)', background: 'transparent', color: 'var(--blue)', cursor: 'pointer', fontSize: 12 }}>+ Thêm</button>
        </div>
        {form.segments.map((seg, i) => (
          <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.7rem', marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)' }}>#{i + 1}</span>
              {form.segments.length > 1 && <button type="button" onClick={() => removeSegment(i)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 16 }}>✕</button>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 4 }}>
              <input type="number" step="0.1" placeholder="Start" value={seg.startTime} onChange={(e) => handleSegmentChange(i, 'startTime', e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: 12 }} />
              <input type="number" step="0.1" placeholder="End" value={seg.endTime} onChange={(e) => handleSegmentChange(i, 'endTime', e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: 12 }} />
            </div>
            <input type="text" placeholder="Đáp án chuẩn" value={seg.content} onChange={(e) => handleSegmentChange(i, 'content', e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: 12 }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: '1rem' }}>
        <button className="btn-submit" type="submit" disabled={submitting}>{submitting ? 'Đang lưu...' : '💾 Cập nhật'}</button>
        <button type="button" onClick={onCancel} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Hủy</button>
      </div>
    </form>
  );
}
