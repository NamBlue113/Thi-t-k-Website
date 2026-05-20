// ============================================
// Navbar — Listening IELTS
// ============================================
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import MobileMenu from './MobileMenu';
import PremiumBadge from '../premium/PremiumBadge';

export default function Navbar({ onOpenLogin, onOpenRegister, onOpenPremium }) {
  const { user, isAuthenticated, isPremium, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [themeOpen, setThemeOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const themeRef = useRef(null);
  const otherRef = useRef(null);

  // ── BODY SCROLL LOCK KHI MOBILE MENU MỞ ──
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [mobileOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false);
      if (otherRef.current && !otherRef.current.contains(e.target)) setOtherOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const otherLessons = [
    'Business English', 'Academic Writing', 'Pronunciation Coach',
    'Idioms & Phrases', 'Grammar in Use', 'Business Podcast',
  ];

  return (
    <>
      <nav>
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <div className="logo-mark">🎧</div>
          <span className="logo-text">
            Listening<span>IELTS</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={isActive('/')}>All exercises</Link>
          <Link to="/top-users" className={isActive('/top-users')}>Top users</Link>
          {isAdmin && (
            <Link to="/admin" className={isActive('/admin')} style={{ color: 'var(--blue)', fontWeight: 600 }}>
              ⚙️ Admin
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/review" className={isActive('/review')}>📝 Ôn tập</Link>
          )}
          {/* Other Lessons Dropdown */}
          <div className="other-lessons-wrap" ref={otherRef}>
            <a className="nav-other-btn" onClick={() => setOtherOpen(!otherOpen)}>
              Other lessons{' '}
              <span style={{ fontSize: 11 }}>{isPremium ? '⭐' : '🔒'}</span> ▾
            </a>
            {otherOpen && (
              <div className="other-dropdown open">
                <div className="other-dropdown-header">
                  {isPremium ? 'Tất cả bài học đã mở khóa ✓' : 'Cần Premium để truy cập'}
                </div>
                {otherLessons.map((name) => (
                  <div
                    key={name}
                    className={`other-item ${!isPremium ? 'locked' : ''}`}
                    onClick={() => {
                      setOtherOpen(false);
                      if (isPremium) {
                        // Navigate to exercise
                        window.dispatchEvent(new CustomEvent('open-exercise', { detail: { title: name } }));
                      } else {
                        onOpenPremium(name);
                      }
                    }}
                  >
                    {name}
                    {!isPremium && <span className="lock-badge">🔒</span>}
                    {isPremium && <span className="unlock-badge">MỚI</span>}
                  </div>
                ))}
                {!isPremium && (
                  <div className="upgrade-cta" onClick={() => { setOtherOpen(false); onOpenPremium(''); }}>
                    ⭐ Nâng cấp Premium ngay
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="nav-right">
          <PremiumBadge />
          {isAuthenticated ? (
            <div className="user-menu-wrap" ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--blue)',
                  background: 'var(--blue)', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
                }}
                title="Tài khoản"
              >
                {(user?.username || 'U')[0].toUpperCase()}
              </button>
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '6px 4px', minWidth: 180,
                  boxShadow: '0 8px 28px rgba(0,0,0,0.12)', zIndex: 99,
                }}>
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                    style={{ display: 'block', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', color: 'var(--text-primary)', fontSize: 14 }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >👤 Trang cá nhân</Link>
                  <button onClick={handleLogout}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', borderRadius: 8, border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn-login" onClick={onOpenLogin}>Login</button>
              <button className="btn-register" onClick={onOpenRegister}>Register</button>
            </>
          )}

          <div className="theme-dropdown-wrap" ref={themeRef}>
            <button className="btn-theme" onClick={() => setThemeOpen(!themeOpen)} title="Chuyển giao diện">
              <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            </button>
            {themeOpen && (
              <div className="theme-dropdown open">
                <div className={`theme-option ${theme === 'light' ? 'active' : ''}`} onClick={() => { setTheme('light'); setThemeOpen(false); }}>
                  <span>☀️</span> Light
                </div>
                <div className={`theme-option ${theme === 'dark' ? 'active' : ''}`} onClick={() => { setTheme('dark'); setThemeOpen(false); }}>
                  <span>🌙</span> Dark
                </div>
              </div>
            )}
          </div>

          <button className={`btn-hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isPremium={isPremium}
        isAuthenticated={isAuthenticated}
        theme={theme}
        onSetTheme={setTheme}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        onOpenPremium={onOpenPremium}
        onLogout={handleLogout}
        isAdmin={isAdmin}
       />
    </>
  );
}