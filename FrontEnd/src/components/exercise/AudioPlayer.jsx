// ============================================
// AudioPlayer — Listening IELTS
// ============================================
export default function AudioPlayer({ audioUrl }) {
  if (!audioUrl) {
    return (
      <div style={{ padding: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        No audio available
      </div>
    );
  }

  return (
    <audio controls src={audioUrl} style={{ width: '100%', marginBottom: 14 }}>
      Your browser does not support audio.
    </audio>
  );
}
