// ============================================
// Navbar — Listening IELTS
// ============================================
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import MobileMenu from './MobileMenu';
import PremiumBadge from '../premium/PremiumBadge';

export default function Navbar({ onOpenLogin, onOpenRegister, onOpenPremium }) {
  const { user, isAuthenticated, isPremium, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [themeOpen, setThemeOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const themeRef = useRef(null);
  const otherRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false);
      if (otherRef.current && !otherRef.current.contains(e.target)) setOtherOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
            <button className="btn-login" onClick={logout}>Logout</button>
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
        onLogout={logout}
        isAdmin={isAdmin}
       />
    </>
  );
}