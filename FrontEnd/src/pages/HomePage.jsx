// ============================================
// HomePage — Listening IELTS
// Hiển thị topic grid từ API /api/topics
// Giữ nguyên HTML/CSS class từ Listening IELTS.html cũ
// ============================================
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTopics } from '../hooks/useTopics';
import SearchBar from '../components/topic/SearchBar';
import FilterTabs from '../components/topic/FilterTabs';
import TopicGrid from '../components/topic/TopicGrid';
import PremiumBanner from '../components/topic/PremiumBanner';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function HomePage({ onOpenPremium }) {
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const { topics, loading, error, filter, setFilter, search, setSearch, refetch } = useTopics();

  // ── SPLIT TOPICS ──
  const freeTopics = topics.filter((t) => !t.isPremium);
  const premiumTopics = topics.filter((t) => t.isPremium);

  // ── HANDLE TOPIC CLICK ──
  const handleTopicClick = useCallback((topic) => {
    if (topic.isPremium && !isPremium) {
      onOpenPremium(topic.title);
      return;
    }
    // Navigate to topic detail page (shows lessons list)
    navigate(`/topic/${topic.slug || topic._id}`, {
      state: { title: topic.title },
    });
  }, [navigate, isPremium, onOpenPremium]);

  // ── HANDLE SEARCH ──
  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, [setSearch]);

  return (
    <>
      {/* Intro Section */}
      <section className="intro-section">
        <h1>
          Practice English with<br />
          <span>dictation exercises</span>
        </h1>
        <p>Welcome to Listening IELTS — the app will help you improve your English listening skills.</p>
        <p>This website contains thousands of audio recordings &amp; videos to help English learners practice easily and improve quickly.</p>
        <button
          className="btn-start"
          onClick={() => document.getElementById('all-topics')?.scrollIntoView({ behavior: 'smooth' })}
        >
          ▶ Start Now
        </button>
      </section>

      <div className="intro-divider" />

      {/* Hero Mini — Search + Stats */}
      <section className="hero-mini">
        <SearchBar onSearch={handleSearch} />
        <div className="stats">
          <div className="stat">
            <div className="stat-num">{topics.reduce((sum, t) => sum + (t.lessonCount || 0), 0).toLocaleString()}</div>
            <div className="stat-label">Lessons</div>
          </div>
          <div className="stat">
            <div className="stat-num">{topics.length}</div>
            <div className="stat-label">Topics</div>
          </div>
          <div className="stat">
            <div className="stat-num">A1–C2</div>
            <div className="stat-label">Levels</div>
          </div>
          <div className="stat">
            <div className="stat-num">50K+</div>
            <div className="stat-label">Students</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="all-topics">
        <div className="section-header">
          <h2 className="section-title">All topics</h2>
          <a href="#" className="view-all">Xem tất cả →</a>
        </div>

        <FilterTabs activeFilter={filter} onFilterChange={setFilter} />

        {/* Premium Banner */}
        {isPremium && <PremiumBanner />}

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Free Topics */}
        {!loading && !error && (
          <TopicGrid topics={freeTopics} onTopicClick={handleTopicClick} />
        )}

        {/* Premium Section */}
        {isPremium && premiumTopics.length > 0 && (
          <div className="premium-lessons-section">
            <div className="premium-section-divider" />
            <div className="premium-section-header">
              <span className="premium-crown">👑</span>
              <h2 className="premium-section-title">Premium Lessons</h2>
            </div>
            <TopicGrid topics={premiumTopics} onTopicClick={handleTopicClick} />
          </div>
        )}
      </main>
    </>
  );
}
