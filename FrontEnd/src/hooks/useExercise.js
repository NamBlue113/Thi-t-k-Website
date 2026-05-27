// ============================================
// useExercise — load sections & manage exercise state
// ============================================
import { useState, useCallback, useRef } from 'react';
import { topicService } from '../services/topicService';
import { attemptService } from '../services/attemptService';
import { normalizeText } from '../utils/helpers';

export function useExercise() {
  const [sections, setSections] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentSection = sections[currentIndex] || null;

  // ── LOAD SECTIONS FOR A TOPIC ──
  const loadSections = useCallback(async (topicId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentIndex(0);
    try {
      const { data } = await topicService.getSections(topicId);
      const list = data.data || [];
      setSections(list);
      return list;
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tải bài tập';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ── NEXT QUESTION ──
  const nextQuestion = useCallback(() => {
    setResult(null);
    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next >= sections.length ? 0 : next;
    });
  }, [sections.length]);

  // ── SUBMIT ANSWER ──
  const submitAnswer = useCallback(async (answer) => {
    if (!currentSection) return null;
    setSubmitting(true);
    setResult(null);

    try {
      // Try backend check first
      const { data } = await attemptService.check(currentSection._id, answer);

      if (data.success) {
        const res = data.data;
        setResult({
          score: res.score,
          status: res.status,
          correct: res.status === 'correct',
        });
        return res;
      }
    } catch {
      // Fallback: compare with correctAnswer locally
      const normalizedAnswer = normalizeText(answer);
      const normalizedExpected = normalizeText(currentSection.correctAnswer || '');

      if (normalizedExpected && normalizedAnswer === normalizedExpected) {
        setResult({ correct: true, status: 'correct', score: 100 });
        return { correct: true };
      } else if (normalizedExpected) {
        setResult({ correct: false, status: 'wrong', expected: currentSection.correctAnswer });
        return { correct: false, expected: currentSection.correctAnswer };
      }
    } finally {
      setSubmitting(false);
    }
    return null;
  }, [currentSection]);

  return {
    sections,
    currentSection,
    currentIndex,
    loading,
    error,
    result,
    submitting,
    loadSections,
    nextQuestion,
    submitAnswer,
    setResult,
  };
}
