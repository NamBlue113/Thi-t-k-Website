// ============================================
// TopUsersPage — Listening IELTS
// ============================================
import LeaderboardCard from '../components/leaderboard/LeaderboardCard';

// Static mock data (can be replaced with API later)
const WEEKLY_USERS = [
  { nickname: 'Alexander', activeTime: '21+ hours' },
  { nickname: 'Lạc Gia', activeTime: '21+ hours' },
  { nickname: 'IELTSCONGVU', activeTime: '21+ hours' },
  { nickname: 'MinhNguyen', activeTime: '18+ hours' },
  { nickname: 'HuongTran', activeTime: '15+ hours' },
];

const MONTHLY_USERS = [
  { nickname: 'IELTSCONGVU', activeTime: '90+ hours' },
  { nickname: 'Alexander', activeTime: '78+ hours' },
  { nickname: 'MinhNguyen', activeTime: '65+ hours' },
  { nickname: 'Lạc Gia', activeTime: '60+ hours' },
  { nickname: 'HuongTran', activeTime: '52+ hours' },
];

export default function TopUsersPage() {
  return (
    <div className="top-users-wrap">
      <h2>🏆 Bảng xếp hạng người dùng năng động</h2>
      <div className="leaderboard-grid">
        <LeaderboardCard
          title="Top 30 users (7 ngày qua)"
          subtitle="0 giờ"
          badge="LAST 7 DAYS"
          badgeClass="badge-orange"
          users={WEEKLY_USERS}
        />
        <LeaderboardCard
          title="Top 30 users (30 ngày qua)"
          subtitle="0 giờ"
          badge="LAST 30 DAYS"
          badgeClass="badge-blue-lb"
          users={MONTHLY_USERS}
        />
      </div>
    </div>
  );
}
