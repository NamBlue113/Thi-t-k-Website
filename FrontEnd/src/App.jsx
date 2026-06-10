// ============================================
// App — Listening IELTS Root Component
// ============================================
import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import ForgotPasswordModal from './components/auth/ForgotPasswordModal';
import PremiumModal from './components/premium/PremiumModal';
import Toast from './components/ui/Toast';
import AIChatbox from './components/ui/AIChatbox';
import './styles/index.css';

function AppShell() {
  const { isPremium } = useAuth();
  const { theme } = useTheme();

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [lockedContent, setLockedContent] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  // ── APPLY PREMIUM CLASS TO BODY ──
  useEffect(() => {
    if (isPremium) {
      document.body.classList.add('is-premium');
    } else {
      document.body.classList.remove('is-premium');
    }
  }, [isPremium]);

  // ── APPLY THEME ──
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── OPEN PREMIUM MODAL ──
  const openPremium = useCallback((content) => {
    setLockedContent(content);
    setPremiumOpen(true);
  }, []);

  // ── SWITCH BETWEEN LOGIN / REGISTER ──
  const switchToRegister = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(true);
  }, []);

  const switchToLogin = useCallback(() => {
    setRegisterOpen(false);
    setForgotOpen(false);
    setLoginOpen(true);
  }, []);

  const switchToForgotPassword = useCallback(() => {
    setLoginOpen(false);
    setForgotOpen(true);
  }, []);

  // ── LISTEN FOR SESSION-EXPIRED: open login modal ──
  useEffect(() => {
    function handleSessionExpired() {
      setLoginOpen(true);
    }
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  // ── LISTEN FOR EXERCISE NAVIGATION FROM OTHER LESSONS ──
  useEffect(() => {
    function handleOpenExercise(e) {
      const { title } = e.detail;
      // Navigate to exercise page is handled via the "other lessons" dropdown
      // This can be extended with useNavigate
      console.log('Open exercise:', title);
    }
    window.addEventListener('open-exercise', handleOpenExercise);
    return () => window.removeEventListener('open-exercise', handleOpenExercise);
  }, []);

  // ── ESC KEY ──
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setLoginOpen(false);
        setRegisterOpen(false);
        setForgotOpen(false);
        setPremiumOpen(false);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ── BODY SCROLL LOCK ON MOBILE (khi có modal/menu mở) ──
  useEffect(() => {
    if (loginOpen || registerOpen || forgotOpen || premiumOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [loginOpen, registerOpen, forgotOpen, premiumOpen]);

  return (
    <>
      <Navbar
        onOpenLogin={() => setLoginOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
        onOpenPremium={openPremium}
      />

      <AppRoutes onOpenPremium={openPremium} />

      <Footer />

      {/* Modals */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={switchToRegister}
        onOpenForgotPassword={switchToForgotPassword}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={switchToLogin}
      />
      <ForgotPasswordModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onSwitchToLogin={switchToLogin}
      />
      <PremiumModal
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        lockedContent={lockedContent}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ show: false, message: '' })}
      />

      {/* AI Chatbox */}
      <AIChatbox />
    </>
  );
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AppContent() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}