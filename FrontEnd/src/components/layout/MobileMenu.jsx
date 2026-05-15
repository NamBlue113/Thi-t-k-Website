// ============================================
// MobileMenu — Listening IELTS
// ============================================
import { Link } from 'react-router-dom';

export default function MobileMenu({
  open, onClose, isPremium, isAuthenticated,
  theme, onSetTheme, onOpenLogin, onOpenRegister,
  onOpenPremium, onLogout,
}) {
  return (
    <>
      <div className={`mobile-menu-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo">
            <div className="logo-mark">🎧</div>
            <span className="logo-text">Listening<span>IELTS</span></span>
          </div>
          <button className="mobile-menu-close" onClick={onClose}>✕</button>
        </div>

        <nav className="mobile-nav">
          <Link to="/" onClick={onClose}>🎧 All exercises</Link>
          <Link to="/top-users" onClick={onClose}>🏆 Top users</Link>
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
        </nav>

        <div className="mobile-menu-actions">
          {isAuthenticated ? (
            <button className="btn-login mobile-full" onClick={() => { onLogout(); onClose(); }}>Logout</button>
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
