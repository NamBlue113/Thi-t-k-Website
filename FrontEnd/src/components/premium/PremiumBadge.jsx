// ============================================
// PremiumBadge — Listening IELTS
// ============================================
import { useAuth } from '../../context/AuthContext';

export default function PremiumBadge() {
  const { isPremium } = useAuth();

  if (!isPremium) return null;

  return (
    <div className="premium-user-badge">
      ⭐ Premium
    </div>
  );
}
