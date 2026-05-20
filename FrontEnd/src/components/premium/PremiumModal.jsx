// ============================================
// PremiumModal — Listening IELTS
// Giá VND + Bank transfer mockup
// ============================================
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { transactionService } from '../../services/transactionService';

const PLAN_FEATURES = {
  free: [
    { text: '12 chủ đề cơ bản', check: true },
    { text: 'Audio exercises', check: true },
    { text: 'Dictation luyện nghe', check: true },
    { text: 'Other Lessons', check: false },
    { text: 'Lộ trình AI', check: false },
    { text: 'Download audio', check: false },
  ],
  premium: [
    { text: 'Tất cả gói FREE', check: true },
    { text: 'Other Lessons 🔓', check: true },
    { text: 'Lộ trình học AI', check: true },
    { text: 'Flashcards thông minh', check: true },
    { text: 'Download audio', check: false },
    { text: 'Priority support', check: false },
  ],
  premium_plus: [
    { text: 'Tất cả Premium', check: true },
    { text: 'Download audio', check: true },
    { text: 'Flashcards AI nâng cao', check: true },
    { text: 'Priority support 24/7', check: true },
    { text: 'Offline mode', check: true },
    { text: 'Mock IELTS test', check: true },
  ],
};

const BANK_INFO = {
  bank: 'BIDV (Ngân hàng Thương Mại CP đầu tư và phát triển)',
  account: '5601997860',
  holder: 'NGUYEN HOAI NAM',
  content: 'Nâng cấp {plan}',
};

export default function PremiumModal({ open, onClose, lockedContent = '' }) {
  const { isPremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');

  if (!open) return null;

  const handleRequestUpgrade = async (plan) => {
    setRequesting(true);
    setRequestMsg('');
    try {
      const amount = plan === 'premium' ? 50000 : 100000;
      await transactionService.request({ packageType: plan, amount });
      setRequestMsg('✅ Yêu cầu đã được gửi tới Admin, vui lòng chờ duyệt!');
      setTimeout(() => {
        setSelectedPlan(null);
        setRequestMsg('');
        onClose();
      }, 2500);
    } catch (err) {
      setRequestMsg('❌ ' + (err.response?.data?.message || 'Lỗi gửi yêu cầu'));
      setTimeout(() => setRequestMsg(''), 4000);
    } finally {
      setRequesting(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="premium-modal-overlay" onClick={onClose}>
      <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pm-header">
          <div>
            <div className="pm-icon-wrap">
              <span style={{ fontSize: 22 }}>🔓</span>
              <div className="pm-title">Mở khóa Premium</div>
            </div>
            <div className="pm-sub">
              {lockedContent
                ? `"${lockedContent}" yêu cầu tài khoản Premium`
                : 'Truy cập toàn bộ kho bài học không giới hạn'}
            </div>
          </div>
          <button className="pm-close" onClick={onClose}>✕</button>
        </div>

        {/* Bank Transfer Info */}
        {selectedPlan ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏦</div>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, marginBottom: 4 }}>
              {selectedPlan === 'premium' ? 'Gói PREMIUM' : 'Gói PREMIUM+'}
            </h3>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--blue)', marginBottom: 16 }}>
              {selectedPlan === 'premium' ? '50.000₫' : '100.000₫'}
            </div>

            <div style={{
              background: 'var(--bg)', borderRadius: 12, padding: '1rem',
              textAlign: 'left', fontSize: 13, marginBottom: 16,
              border: '1px solid var(--border)',
            }}>
              <div style={{ marginBottom: 8, fontWeight: 600, color: 'var(--text-primary)' }}>📋 Thông tin chuyển khoản:</div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <strong>Ngân hàng:</strong> {BANK_INFO.bank}<br />
                <strong>Số TK:</strong> {BANK_INFO.account}<br />
                <strong>Chủ TK:</strong> {BANK_INFO.holder}<br />
                <strong>Nội dung CK:</strong> <span style={{ color: 'var(--blue)', fontWeight: 600 }}>{BANK_INFO.content.replace('{plan}', selectedPlan === 'premium' ? 'PREMIUM' : 'PREMIUM+')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleRequestUpgrade(selectedPlan)}
                disabled={requesting}
                style={{
                  padding: '10px 24px', borderRadius: 8, border: 'none',
                  background: requesting ? '#94A3B8' : 'var(--blue)', color: '#fff', cursor: requesting ? 'default' : 'pointer',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                }}
              >
                {requesting ? 'Đang gửi...' : '📤 Tôi đã chuyển khoản'}
              </button>
              <button
                onClick={() => { setSelectedPlan(null); setRequestMsg(''); }}
                disabled={requesting}
                style={{
                  padding: '10px 24px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'transparent', color: 'var(--text-secondary)', cursor: requesting ? 'default' : 'pointer',
                  fontFamily: 'inherit', fontSize: 14,
                }}
              >
                ← Quay lại
              </button>
            </div>
            {requestMsg && (
              <p style={{
                fontSize: 13, marginTop: 10, padding: '8px 14px', borderRadius: 8,
                background: requestMsg.startsWith('✅') ? '#DCFCE7' : '#FEF2F2',
                color: requestMsg.startsWith('✅') ? '#166534' : '#991B1B',
              }}>{requestMsg}</p>
            )}
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              * Admin sẽ duyệt yêu cầu của bạn trong thời gian sớm nhất.
            </p>
          </div>
        ) : (
          <>
            <div className="pm-plans">
              {/* FREE */}
              <div className="pm-plan">
                <div className="pm-plan-name free-name">FREE</div>
                <div className="pm-plan-price">0₫</div>
                <div className="pm-plan-period">/tháng</div>
                <div className="pm-divider" />
                <ul className="pm-features">
                  {PLAN_FEATURES.free.map((f, i) => (
                    <li key={i} className={f.check ? 'check' : 'cross'}>{f.text}</li>
                  ))}
                </ul>
                <button className="pm-btn pm-btn-free" disabled style={{ opacity: 0.6, cursor: 'default' }}>
                  Đang dùng
                </button>
              </div>

              {/* PREMIUM */}
              <div className="pm-plan featured">
                <div className="pm-plan-badge">Phổ biến nhất</div>
                <div className="pm-plan-name premium-name">PREMIUM</div>
                <div className="pm-plan-price">50.000₫</div>
                <div className="pm-plan-period">/tháng</div>
                <div className="pm-divider" />
                <ul className="pm-features">
                  {PLAN_FEATURES.premium.map((f, i) => (
                    <li key={i} className={f.check ? 'check' : 'cross'}>{f.text}</li>
                  ))}
                </ul>
                <button
                  className="pm-btn pm-btn-premium"
                  onClick={() => handleSelectPlan('premium')}
                  disabled={isPremium}
                >
                  {isPremium ? '✓ Đã kích hoạt' : '✨ Chọn gói này'}
                </button>
              </div>

              {/* PREMIUM+ */}
              <div className="pm-plan">
                <div className="pm-plan-name plus-name">PREMIUM+</div>
                <div className="pm-plan-price">100.000₫</div>
                <div className="pm-plan-period">/tháng</div>
                <div className="pm-divider" />
                <ul className="pm-features">
                  {PLAN_FEATURES.premium_plus.map((f, i) => (
                    <li key={i} className={f.check ? 'check' : 'cross'}>{f.text}</li>
                  ))}
                </ul>
                <button
                  className="pm-btn pm-btn-plus"
                  onClick={() => handleSelectPlan('premium_plus')}
                  disabled={isPremium}
                >
                  {isPremium ? '✓ Đã kích hoạt' : '⭐ Chọn gói này'}
                </button>
              </div>
            </div>

            <div className="pm-locked-info">
              <span style={{ fontSize: 20 }}>🔒</span>
              <p>
                Nội dung bị khóa: <strong>{lockedContent || 'Other Lessons'}</strong> — Gồm Business English, Academic Writing, Pronunciation Coach và nhiều hơn nữa. Nâng cấp để truy cập ngay.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
