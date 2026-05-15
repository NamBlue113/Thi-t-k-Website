// ============================================
// AppRoutes — Listening IELTS
// ============================================
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const ExercisePage = lazy(() => import('../pages/ExercisePage'));
const TopUsersPage = lazy(() => import('../pages/TopUsersPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function AppRoutes({ onOpenPremium }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage onOpenPremium={onOpenPremium} />} />
        <Route path="/exercise/:slug" element={<ExercisePage onOpenPremium={onOpenPremium} />} />
        <Route path="/top-users" element={<TopUsersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
