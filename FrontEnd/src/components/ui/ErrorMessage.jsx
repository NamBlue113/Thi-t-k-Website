// ============================================
// ErrorMessage — Listening IELTS
// ============================================
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
      <div>{message || 'Đã có lỗi xảy ra'}</div>
      {onRetry && (
        <button onClick={onRetry}>Thử lại</button>
      )}
    </div>
  );
}
