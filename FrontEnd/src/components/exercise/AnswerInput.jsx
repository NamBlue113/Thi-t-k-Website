// ============================================
// AnswerInput — Listening IELTS
// ============================================
import { useState } from 'react';

export default function AnswerInput({ onSubmit, onSkip, submitting, segmentInfo }) {
  const [answer, setAnswer] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onSubmit(answer);
    setAnswer('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      {segmentInfo && (
        <div className="segment-info">
          <span>📝</span>
          <span>{segmentInfo}</span>
        </div>
      )}
      <textarea
        className={shake ? 'input-shake' : ''}
        placeholder="Type what you hear..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={submitting}
      />
      <br />
      <button className="btn-check" onClick={handleSubmit} disabled={submitting}>
        Check
      </button>
      <button className="btn-skip" onClick={onSkip} disabled={submitting}>
        Skip
      </button>
    </div>
  );
}
