// ============================================
// EmptyState — Listening IELTS
// ============================================
export default function EmptyState({ icon = '🔍', message = 'Không có dữ liệu' }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <div>{message}</div>
    </div>
  );
}
