// ============================================
// ResultDisplay — Listening IELTS
// ============================================
export default function ResultDisplay({ result }) {
  if (!result) return null;

  if (result.correct) {
    return (
      <div style={{
        padding: 14, borderRadius: 10, background: '#f0fdf4',
        marginTop: 10, border: '1px solid #bbf7d0',
      }}>
        <div className="result-correct">✅ Correct!</div>
        {result.expected && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            "{result.expected}"
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      padding: 14, borderRadius: 10, background: '#fef2f2',
      marginTop: 10, border: '1px solid #fecaca',
    }}>
      <div className="result-wrong">❌ Not correct. Try again!</div>
      {result.expected && (
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Hint: "{result.masked || result.expected}"
        </div>
      )}
    </div>
  );
}
