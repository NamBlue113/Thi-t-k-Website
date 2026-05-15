// ============================================
// LoadingSpinner — Listening IELTS
// ============================================
export default function LoadingSpinner({ text = 'Đang tải...' }) {
  return (
    <div className="loading-spinner">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 12px' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{text}</div>
      </div>
    </div>
  );
}
