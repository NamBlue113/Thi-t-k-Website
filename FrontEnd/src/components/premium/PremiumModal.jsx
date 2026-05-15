// ============================================
// PremiumModal — Listening IELTS
// ============================================
import { useAuth } from '../../context/AuthContext';

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

export default function PremiumModal({ open, onClose, lockedContent = '' }) {
  const { isPremium, activatePremium } = useAuth();

  if (!open) return null;

  const handleActivate = () => {
    activatePremium('premium');
    onClose();
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

        <div className="pm-plans">
          {/* FREE */}
          <div className="pm-plan">
            <div className="pm-plan-name free-name">FREE</div>
            <div className="pm-plan-price">$0</div>
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
            <div className="pm-plan-price">$4.99</div>
            <div className="pm-plan-period">/tháng</div>
            <div className="pm-divider" />
            <ul className="pm-features">
              {PLAN_FEATURES.premium.map((f, i) => (
                <li key={i} className={f.check ? 'check' : 'cross'}>{f.text}</li>
              ))}
            </ul>
            <button className="pm-btn pm-btn-premium" onClick={handleActivate} disabled={isPremium}>
              {isPremium ? '✓ Đã kích hoạt' : '✨ Chọn gói này'}
            </button>
          </div>

          {/* PREMIUM+ */}
          <div className="pm-plan">
            <div className="pm-plan-name plus-name">PREMIUM+</div>
            <div className="pm-plan-price">$9.99</div>
            <div className="pm-plan-period">/tháng</div>
            <div className="pm-divider" />
            <ul className="pm-features">
              {PLAN_FEATURES.premium_plus.map((f, i) => (
                <li key={i} className={f.check ? 'check' : 'cross'}>{f.text}</li>
              ))}
            </ul>
            <button className="pm-btn pm-btn-plus" onClick={handleActivate} disabled={isPremium}>
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
      </div>
    </div>
  );
}
