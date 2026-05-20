// ============================================
// ForgotPasswordModal — 3 bước khôi phục mật khẩu
// ============================================
import { useState } from 'react';
import api from '../../api/axiosInstance';

export default function ForgotPasswordModal({ open, onClose, onSwitchToLogin }) {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const reset = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setMsg('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Bước 1: Gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setMsg('❌ Vui lòng nhập email'); return; }
    setLoading(true);
    setMsg('');
    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      setMsg('✅ Mã OTP đã được gửi vào Email của bạn');
      setStep(2);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Lỗi gửi OTP'));
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) { setMsg('❌ Vui lòng nhập đủ 6 số OTP'); return; }
    setLoading(true);
    setMsg('');
    try {
      await api.post('/auth/verify-otp', { email: email.trim().toLowerCase(), otpCode: otp.trim() });
      setMsg('');
      setStep(3);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Mã OTP không đúng'));
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) { setMsg('❌ Mật khẩu phải ít nhất 6 ký tự'); return; }
    if (newPassword !== confirmPassword) { setMsg('❌ Mật khẩu xác nhận không khớp'); return; }
    setLoading(true);
    setMsg('');
    try {
      await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        otpCode: otp.trim(),
        newPassword,
      });
      setMsg('✅ Đổi mật khẩu thành công!');
      setTimeout(() => {
        reset();
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Lỗi đặt lại mật khẩu'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={`modal-overlay${open ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={handleClose}>&#10005;</button>
        <h2>🔐 Quên mật khẩu</h2>

        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: '1.5rem' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
              background: step >= s ? 'var(--blue)' : 'var(--bg)',
              color: step >= s ? '#fff' : 'var(--text-muted)',
              border: step >= s ? 'none' : '1px solid var(--border)',
            }}>{s}</div>
          ))}
        </div>

        {msg && (
          <div style={{
            marginBottom: 12, padding: '8px 14px', borderRadius: 8, fontSize: 13,
            background: msg.startsWith('✅') ? '#DCFCE7' : '#FEF2F2',
            color: msg.startsWith('✅') ? '#166534' : '#991B1B',
          }}>{msg}</div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Email của bạn</label>
              <input type="email" placeholder="Nhập email đã đăng ký" value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Đang gửi...' : '📧 Gửi mã OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              Mã OTP 6 số đã được gửi đến <strong>{email}</strong>
            </p>
            <div className="form-group">
              <label>Mã OTP</label>
              <input type="text" placeholder="Nhập 6 số" maxLength={6} value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{ textAlign: 'center', fontSize: 24, letterSpacing: 6, fontWeight: 700 }} />
            </div>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Đang kiểm tra...' : '✓ Xác thực'}
            </button>
            <button type="button" onClick={() => { setStep(1); setMsg(''); setOtp(''); }}
              style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, width: '100%' }}>
              ← Nhập lại email
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input type="password" placeholder="Ít nhất 6 ký tự" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu mới</label>
              <input type="password" placeholder="Nhập lại mật khẩu" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Đang cập nhật...' : '🔒 Đặt lại mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
