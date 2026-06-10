// ============================================
// ExercisePlayer — Main exercise wrapper
// Orchestrates Video/Audio + Answer + Result
// ============================================
import { useState, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import AnswerInput from './AnswerInput';
import ResultDisplay from './ResultDisplay';
import SegmentPlayer from './SegmentPlayer';
import { normalizeText, maskAnswer } from '../../utils/helpers';

export default function ExercisePlayer({
  section,
  onNextQuestion,
  isVideo,
}) {
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [segmentIdx, setSegmentIdx] = useState(0);
  const [showNextSegment, setShowNextSegment] = useState(false);
  const [youtubePlayer, setYoutubePlayer] = useState(null);

  const segments = section?.segments || [];
  const hasSegments = segments.length > 0;
  const currentSegment = hasSegments ? segments[segmentIdx] : null;

  // ── HANDLE ANSWER SUBMIT ──
  const handleSubmit = useCallback((answer) => {
    setSubmitting(true);
    setResult(null);

    // Segment mode: compare locally
    if (currentSegment) {
      const normAnswer = normalizeText(answer);
      const normExpected = normalizeText(currentSegment.content);

      if (normAnswer === normExpected) {
        setResult({ correct: true, expected: currentSegment.content });
        setShowNextSegment(true);
      } else {
        const masked = maskAnswer(currentSegment.content, answer);
        setResult({ correct: false, expected: currentSegment.content, masked });
      }
      setSubmitting(false);
      return;
    }

    // Normal mode: compare with correctAnswer
    const normAnswer = normalizeText(answer);
    const normExpected = normalizeText(section?.correctAnswer || '');

    if (normExpected && normAnswer === normExpected) {
      setResult({ correct: true, expected: section.correctAnswer });
    } else if (normExpected) {
      const masked = maskAnswer(section.correctAnswer, answer);
      setResult({ correct: false, expected: section.correctAnswer, masked });
    } else {
      setResult({ correct: false, expected: 'No answer key' });
    }
    setSubmitting(false);
  }, [currentSegment, section]);

  // ── NEXT SEGMENT ──
  const handleNextSegment = useCallback(() => {
    if (segmentIdx < segments.length - 1) {
      const next = segmentIdx + 1;
      setSegmentIdx(next);
      setResult(null);
      setShowNextSegment(false);

      // Play the new segment
      if (youtubePlayer && segments[next]) {
        youtubePlayer.seekTo(segments[next].startTime, true);
        youtubePlayer.playVideo();
      }
    } else {
      // All segments done
      if (onNextQuestion) onNextQuestion();
    }
  }, [segmentIdx, segments, youtubePlayer, onNextQuestion]);

  // ── SKIP ──
  const handleSkip = useCallback(() => {
    setResult(null);
    setSegmentIdx(0);
    setShowNextSegment(false);
    if (onNextQuestion) onNextQuestion();
  }, [onNextQuestion]);

  if (!section) {
    return <div style={{ color: 'var(--text-muted)', padding: 20 }}>No exercise loaded</div>;
  }

  const segmentInfo = hasSegments
    ? `Segment ${segmentIdx + 1} of ${segments.length}`
    : null;

  return (
    <div className="section-detail" style={{ display: 'block' }}>
      {isVideo ? (
        <VideoPlayer
          youtubeUrl={section.youtubeUrl}
          onPlayerReady={(player) => setYoutubePlayer(player)}
          segment={currentSegment}
          onSegmentEnd={() => {
            // Auto-pause handled in VideoPlayer
          }}
        />
      ) : (
        <AudioPlayer audioUrl={section.audioUrl} />
      )}

      <div style={{ marginBottom: 12 }}>
        <strong>
          {hasSegments
            ? `Segment ${segmentIdx + 1}/${segments.length}`
            : section.title || 'Listening Exercise'}
        </strong>
      </div>

      <AnswerInput
        onSubmit={handleSubmit}
        onSkip={handleSkip}
        submitting={submitting}
        segmentInfo={segmentInfo}
      />

      <SegmentPlayer
        segments={segments}
        currentIndex={segmentIdx}
        showNext={showNextSegment}
        onNextSegment={handleNextSegment}
      />

      <ResultDisplay result={result} />
    </div>
  );
}
