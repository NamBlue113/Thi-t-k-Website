// ============================================
// SegmentPlayer — Listening IELTS
// Handles segment navigation
// ============================================
export default function SegmentPlayer({
  segments,
  currentIndex,
  onNextSegment,
  showNext,
}) {
  if (!segments || !segments.length) return null;

  return (
    <>
      <div className="segment-info">
        <span>📝</span>
        <span>
          Segment <strong>{currentIndex + 1}</strong> of{' '}
          <strong>{segments.length}</strong>
        </span>
      </div>
      <button
        className={`btn-next-segment ${showNext ? 'show' : ''}`}
        onClick={onNextSegment}
      >
        Next Segment ▶
      </button>
    </>
  );
}
