// ============================================
// Helpers — Listening IELTS
// ============================================

/**
 * Extract YouTube video ID from URL
 */
export function extractYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Normalize text for comparison (lowercase, trim, remove extra spaces)
 */
export function normalizeText(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Mask incorrect answer word-by-word from left to right.
 * Correct words are shown as-is. From the first mismatched word onward,
 * all remaining words are replaced with '*' matching the original word's
 * character count.
 *
 * Example:
 *   maskAnswer("What do you do in the morning", "What are you doing")
 *   → "What ** *** ** ** *** *******"
 *
 * Edge cases:
 *   - User types fewer words than correct → remaining words masked
 *   - User types more words → extra words ignored (only correct length used)
 *   - Empty answer → all words masked
 *
 * Designed for extensibility — color highlighting, per-word hints, and
 * Easy/Normal/Hard difficulty modes can be built on top of this function.
 */
export function maskAnswer(correctAnswer, userAnswer) {
  if (!correctAnswer) return '';

  const correctWords = correctAnswer.trim().split(/\s+/);
  const userWords = (userAnswer || '').trim().split(/\s+/);

  const displayWords = [];
  let mismatchFound = false;

  for (let i = 0; i < correctWords.length; i++) {
    if (!mismatchFound && i < userWords.length) {
      const normCorrect = normalizeText(correctWords[i]);
      const normUser = normalizeText(userWords[i]);

      if (normCorrect === normUser) {
        displayWords.push(correctWords[i]);
      } else {
        mismatchFound = true;
        displayWords.push('*'.repeat(correctWords[i].length));
      }
    } else {
      displayWords.push('*'.repeat(correctWords[i].length));
    }
  }

  return displayWords.join(' ');
}

/**
 * Get CSS color for a topic thumbnail based on index
 */
const THUMB_COLORS = [
  '#DBEAFE', '#EEF2FF', '#F0FDF4', '#FDF4FF',
  '#EFF6FF', '#FFF7ED', '#FFF1F2', '#ECFDF5',
  '#FEF3C7', '#F5F3FF', '#FEF9C3',
];

export function getThumbColor(index) {
  return THUMB_COLORS[index % THUMB_COLORS.length];
}

/**
 * Get emoji for a topic based on title
 */
const EMOJI_MAP = {
  'ielts': '🎓',
  'stories': '📖',
  'conversation': '💬',
  'kids': '🧚',
  'toeic': '🎧',
  'video': '▶️',
  'news': '📰',
  'ted': '🎤',
  'toefl': '📝',
  'medical': '🏥',
  'oet': '🏥',
  'ipa': '🔤',
  'numbers': '🔢',
  'business': '💼',
  'writing': '✍️',
  'pronunciation': '🗣️',
  'idioms': '💬',
  'grammar': '📗',
  'podcast': '🎙️',
};

export function getTopicEmoji(title) {
  const lower = title.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return '📝';
}

/**
 * Format time in seconds to mm:ss
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
