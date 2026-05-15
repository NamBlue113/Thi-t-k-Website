// ============================================
// RegisterModal — Listening IELTS
// ============================================
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterModal({ open, onClose, onSwitchToLogin }) {
  const { register, loading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(nickname, email, password);
    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Create an account</h2>

        <button className="btn-google">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign up with Google
        </button>

        <div className="divider">
          <div className="divider-line" /><span>Or enter your information</span><div className="divider-line" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nickname</label>
            <input type="text" placeholder="Enter your nickname"
              value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 8 }}>{error}</div>}
          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Submit'}
          </button>
        </form>

        <div className="modal-footer-links">
          Already have an account?{' '}
          <a onClick={() => { onClose(); onSwitchToLogin(); }}>Login here</a>
        </div>
      </div>
    </div>
  );
}
