// ============================================
// Toast — Listening IELTS
// ============================================
import { useEffect, useState } from 'react';

export default function Toast({ message, show, duration = 3500, onHide }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onHide) onHide();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, duration, onHide]);

  if (!message) return null;

  return (
    <div className={`unlock-toast ${visible ? 'show' : ''}`}>{message}</div>
  );
}
