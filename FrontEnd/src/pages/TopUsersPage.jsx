// ============================================
// TopUsersPage — Listening IELTS
// Fetch leaderboard từ API
// Giữ nguyên HTML/CSS class từ topuser.html cũ
// ============================================
import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function TopUsersPage() {
  const [users7d, setUsers7d] = useState([]);
  const [users30d, setUsers30d] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const { data } = await api.get('/users/leaderboard');
        if (!cancelled) {
          setUsers7d(data.data?.last7Days || []);
          setUsers30d(data.data?.last30Days || []);
        }
      } catch {
        if (!cancelled) {
          setError('Không thể tải bảng xếp hạng');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="top-users-wrap"><LoadingSpinner text="Đang tải bảng xếp hạng..." /></div>;
  if (error) return <div className="top-users-wrap"><ErrorMessage message={error} /></div>;

  return (
    <div className="top-users-wrap">
      <h2>🏆 Bảng xếp hạng người dùng năng động</h2>
      <div className="leaderboard-grid">
        {/* 7 Days */}
        <div className="lb-card">
          <div className="lb-header">
            <div>
              <div className="lb-title">Top 30 users (7 ngày qua)</div>
              <div className="lb-sub">Thời gian hoạt động: <span>0 giờ</span></div>
            </div>
            <span className="lb-badge badge-orange">LAST 7 DAYS</span>
          </div>
          <table className="lb-table">
            <thead><tr><th>#</th><th>Username</th><th>Active time</th></tr></thead>
            <tbody>
              {users7d.map((u, i) => (
                <tr key={u._id || i}>
                  <td>
                    <span className={`rank-num ${i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : 'rank-normal'}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: getAvatarBg(i) }}>{getInitials(u.nickname || u.username)}</div>
                      {u.nickname || u.username}
                      {i === 0 && ' 🏆'}
                    </div>
                  </td>
                  <td>{u.activeTime || u.time || '—'}</td>
                </tr>
              ))}
              {users7d.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>Chưa có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 30 Days */}
        <div className="lb-card">
          <div className="lb-header">
            <div>
              <div className="lb-title">Top 30 users (30 ngày qua)</div>
              <div className="lb-sub">Thời gian hoạt động: <span>0 giờ</span></div>
            </div>
            <span className="lb-badge badge-blue-lb">LAST 30 DAYS</span>
          </div>
          <table className="lb-table">
            <thead><tr><th>#</th><th>Username</th><th>Active time</th></tr></thead>
            <tbody>
              {users30d.map((u, i) => (
                <tr key={u._id || i}>
                  <td>
                    <span className={`rank-num ${i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : 'rank-normal'}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: getAvatarBg(i + 10) }}>{getInitials(u.nickname || u.username)}</div>
                      {u.nickname || u.username}
                      {i === 0 && ' 🏆'}
                    </div>
                  </td>
                  <td>{u.activeTime || u.time || '—'}</td>
                </tr>
              ))}
              {users30d.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>Chưa có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || '').toUpperCase();
}

const AVATAR_COLORS = ['#FBBF24','#EF4444','#14B8A6','#8B5CF6','#3B82F6','#EC4899','#F97316','#06B6D4'];
function getAvatarBg(i) {
  return AVATAR_COLORS[i % AVATAR_COLORS.length];
}
