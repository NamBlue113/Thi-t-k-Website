// ============================================
// LeaderboardCard — Listening IELTS
// ============================================
const RANK_CLASSES = {
  1: 'rank-gold',
  2: 'rank-silver',
  3: 'rank-bronze',
};

const RANK_EMOJI = {
  1: '🏆',
  2: '',
  3: '',
};

const AVATAR_COLORS = [
  'linear-gradient(135deg,#FBBF24,#D97706)',
  '#EF4444',
  '#14B8A6',
  '#8B5CF6',
  '#3B82F6',
  '#F59E0B',
  '#EC4899',
  '#10B981',
];

export default function LeaderboardCard({ title, subtitle, badge, badgeClass, users = [] }) {
  return (
    <div className="lb-card">
      <div className="lb-header">
        <div>
          <div className="lb-title">{title}</div>
          <div className="lb-sub">
            Thời gian hoạt động: <span>{subtitle}</span>
          </div>
        </div>
        <span className={`lb-badge ${badgeClass}`}>{badge}</span>
      </div>
      <table className="lb-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Active time</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            const rank = i + 1;
            const initials = user.nickname
              ? user.nickname.slice(0, 2).toUpperCase()
              : '??';
            return (
              <tr key={i}>
                <td>
                  <span className={`rank-num ${RANK_CLASSES[rank] || 'rank-normal'}`}>
                    {rank}
                  </span>
                </td>
                <td>
                  <div className="user-cell">
                    <div
                      className="user-avatar"
                      style={{ background: AVATAR_COLORS[i] || '#6B7A99' }}
                    >
                      {initials}
                    </div>
                    {user.nickname || 'Unknown'}
                    {RANK_EMOJI[rank] ? ` ${RANK_EMOJI[rank]}` : ''}
                  </div>
                </td>
                <td>{user.activeTime || 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
