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
