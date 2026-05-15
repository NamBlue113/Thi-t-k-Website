// ============================================
// NotFoundPage — Listening IELTS
// ============================================
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      textAlign: 'center', padding: '5rem 2rem',
      color: 'var(--text-secondary)',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 28, marginBottom: 12, color: 'var(--text-primary)' }}>
        404 — Page Not Found
      </h1>
      <p style={{ marginBottom: 24 }}>Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
      <Link to="/" className="btn-start" style={{ textDecoration: 'none' }}>
        ← Về trang chủ
      </Link>
    </div>
  );
}
