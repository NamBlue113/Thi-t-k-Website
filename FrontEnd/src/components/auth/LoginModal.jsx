// ============================================
// LoginModal — Listening IELTS
// Giữ nguyên HTML/CSS class từ Listening IELTS.html cũ
// ============================================
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const { login, error: authError, setError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (result.success) {
      setEmail('');
      setPassword('');
      onClose();
    }
  };

  const displayError = localError || authError;

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>&#10005;</button>
        <h2>Login</h2>

        <button className="btn-google">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Đăng nhập bằng Google
        </button>

        <div className="divider">
          <div className="divider-line"></div>
          <span>Or enter your password</span>
          <div className="divider-line"></div>
        </div>

        {displayError && (
          <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username or Email</label>
            <input
              type="text"
              placeholder="Nhập email hoặc tên đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn-submit" type="submit" disabled={submitting || loading}>
            {submitting || loading ? 'Đang đăng nhập...' : 'Submit'}
          </button>
        </form>

        <div className="modal-footer-links">
          Forgot your password? <a href="#">Click here</a><br />
          Haven&apos;t had an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>
            Register here
          </a>
        </div>
      </div>
    </div>
  );
}
