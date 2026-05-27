// ============================================
// AddTopicForm — Admin tạo chủ đề mới
// POST /api/topics
// ============================================
import { useState } from 'react';
import { topicService } from '../../services/topicService';

const INITIAL = {
  title: '',
  slug: '',
  description: '',
  mediaType: 'audio',
};

export default function AddTopicForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.slug.trim() || !form.mediaType) {
      setError('Vui lòng điền đầy đủ Title, Slug và chọn Media Type.');
      return;
    }

    setSubmitting(true);
    try {
      await topicService.create({
        title: form.title.trim(),
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        description: form.description.trim(),
        mediaType: form.mediaType,
      });
      setForm(INITIAL);
      onSuccess('✅ Chủ đề đã được tạo thành công!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi khi tạo chủ đề';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, marginBottom: '1.2rem', color: 'var(--text-primary)' }}>
        📚 Tạo Chủ đề mới
      </h3>

      {error && (
        <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#FEF2F2', borderRadius: 8 }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label>Tiêu đề (Title) *</label>
        <input type="text" name="title" placeholder="VD: Stories for Kids" value={form.title} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Slug *</label>
        <input type="text" name="slug" placeholder="VD: stories-for-kids" value={form.slug} onChange={handleChange} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dùng để tạo URL thân thiện. Chỉ chứa chữ thường và dấu gạch ngang.</span>
      </div>

      <div className="form-group">
        <label>Mô tả (Description)</label>
        <textarea name="description" rows={3} placeholder="Mô tả ngắn về chủ đề..." value={form.description} onChange={handleChange}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 14, resize: 'vertical' }}
        />
      </div>

      <div className="form-group">
        <label>Loại phương tiện (Media Type) *</label>
        <select name="mediaType" value={form.mediaType} onChange={handleChange}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 14 }}
        >
          <option value="audio">🎵 Audio</option>
          <option value="video">🎬 Video</option>
        </select>
      </div>

      <button className="btn-submit" type="submit" disabled={submitting} style={{ marginTop: 8 }}>
        {submitting ? 'Đang lưu...' : '💾 Lưu Chủ đề'}
      </button>
    </form>
  );
}
