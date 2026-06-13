// ============================================
// MobileMenu — Listening IELTS
// ============================================
import { Link } from 'react-router-dom';

export default function MobileMenu({
  open, onClose, isPremium, isAuthenticated,
  theme, onSetTheme, onOpenLogin, onOpenRegister,
  onOpenPremium, onLogout, isAdmin,
}) {
  return (
    <>
      <div className={`mobile-menu-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo">
            <div className="logo-mark">🎧</div>
            <span className="logo-text">Dictation<span>English</span></span>
          </div>
          <button className="mobile-menu-close" onClick={onClose}>✕</button>
        </div>

        <div className="mobile-nav">
          <Link to="/" onClick={onClose}>🎧 All exercises</Link>
          <Link to="/top-users" onClick={onClose}>🏆 Top users</Link>
          {isAdmin && (
            <Link to="/admin" onClick={onClose} style={{ color: 'var(--blue)', fontWeight: 600 }}>⚙️ Admin</Link>
          )}
          <a
            className="locked-link"
            onClick={() => {
              onClose();
              if (isPremium) {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              } else {
                onOpenPremium('');
              }
            }}
          >
            {isPremium ? '⭐' : '🔒'} Other lessons
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
              background: isPremium ? 'linear-gradient(135deg,#D97706,#F59E0B)' : 'var(--blue)',
              color: 'white',
            }}>
              {isPremium ? '⭐ Premium' : 'Premium'}
            </span>
          </a>
        </div>

        <div className="mobile-menu-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={onClose} style={{ display: 'block', width: '100%', textAlign: 'center', padding: '11px 0', fontSize: 15, borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border)', marginBottom: 8 }}>👤 Trang cá nhân</Link>
              <button className="btn-logout mobile-full" onClick={() => { onLogout(); onClose(); }}>🚪 Đăng xuất</button>
            </>
          ) : (
            <>
              <button className="btn-login mobile-full" onClick={() => { onClose(); onOpenLogin(); }}>Login</button>
              <button className="btn-register mobile-full" onClick={() => { onClose(); onOpenRegister(); }}>Register</button>
            </>
          )}
        </div>

        <div className="mobile-menu-theme">
          <span>Theme</span>
          <div className="mobile-theme-btns">
            <button className={`mobile-theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => onSetTheme('light')}>☀️ Light</button>
            <button className={`mobile-theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => onSetTheme('dark')}>🌙 Dark</button>
          </div>
        </div>
      </div>
    </>
  );
}