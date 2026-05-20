// ============================================
// Profile.jsx — User Profile Page
// ============================================
import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, setError } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '' });
  const showToast = (msg) => { setToast({ show: true, message: msg }); setTimeout(() => setToast({ show: false, message: '' }), 3000); };

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const { data } = await api.get('/users/profile');
        const userData = data.data || data;
        setProfile(userData);
        setUsername(userData.username || '');
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/';
        } else {
          setError(err.response?.data?.message || 'Lỗi tải thông tin');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, setError]);

  const handleSaveName = async () => {
    if (!username.trim()) { showToast('❌ Tên không được để trống'); return; }
    setSavingName(true);
    try {
      const { data } = await api.put('/users/profile', { username: username.trim() });
      const updated = data.data || data;
      setProfile(updated);
      // Cập nhật localStorage
      localStorage.setItem('listeningielts-user', JSON.stringify(updated));
      showToast('✅ Tên đã được cập nhật');
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Lỗi cập nhật'));
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) { showToast('❌ Vui lòng nhập đầy đủ'); return; }
    if (newPassword.length < 6) { showToast('❌ Mật khẩu mới ít nhất 6 ký tự'); return; }
    if (newPassword !== confirmPassword) { showToast('❌ Mật khẩu xác nhận không khớp'); return; }
    setChangingPw(true);
    try {
      await api.put('/users/change-password', { oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('✅ Mật khẩu đã được đổi thành công');
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Lỗi đổi mật khẩu'));
    } finally {
      setChangingPw(false);
    }
  };

  if (authLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const planLabel = profile?.plan === 'premium' ? '⭐ Premium' : profile?.plan === 'premium_plus' ? '👑 Premium+' : 'Free';
  const planColor = profile?.plan === 'premium' ? '#D97706' : profile?.plan === 'premium_plus' ? '#7C3AED' : 'var(--text-muted)';
  const initials = (profile?.username || 'U')[0].toUpperCase();

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>← Quay lại</Link>

      <div style={{ marginTop: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'var(--blue)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 12,
        }}>{initials}</div>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, color: 'var(--text-primary)', margin: 0 }}>
          {profile?.username}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '4px 0' }}>{profile?.email}</p>
        <span style={{
          padding: '3px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
          background: planColor + '18', color: planColor,
        }}>{planLabel}</span>
      </div>

      {/* ── Edit Name ── */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, marginBottom: '0.8rem', color: 'var(--text-primary)' }}>✏️ Tên hiển thị</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 14 }} />
          <button onClick={handleSaveName} disabled={savingName} className="btn-submit" style={{ margin: 0, whiteSpace: 'nowrap' }}>
            {savingName ? '...' : '💾 Lưu'}
          </button>
        </div>
      </div>

      {/* ── Change Password ── */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem' }}>
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, marginBottom: '0.8rem', color: 'var(--text-primary)' }}>🔒 Đổi mật khẩu</h3>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label>Mật khẩu cũ</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <button className="btn-submit" type="submit" disabled={changingPw}>
            {changingPw ? 'Đang đổi...' : '🔒 Đổi mật khẩu'}
          </button>
        </form>
      </div>

      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </div>
  );
}
