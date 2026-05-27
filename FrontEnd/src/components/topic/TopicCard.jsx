// ============================================
// TopicCard — Listening IELTS
// Dynamic render from topic API data
// ============================================
import { getThumbColor, getTopicEmoji } from '../../utils/helpers';

export default function TopicCard({ topic, index = 0, onClick }) {
  const {
    title,
    mediaType,
    featured,
    isPremium,
    lessonCount,
    levels = [],
    tags = [],
  } = topic;

  const levelStr = levels.length ? levels.join('–') : 'A1–C2';
  const isVideo = mediaType === 'video' || tags.includes('video');

  return (
    <div
      className={`card ${featured ? 'featured' : ''}`}
      onClick={() => onClick(topic)}
      style={{ animationDelay: `${Math.min(index * 0.03, 0.6)}s` }}
    >
      <div
        className="card-thumb"
        style={{ background: getThumbColor(index) }}
      >
        {getTopicEmoji(title)}
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className="card-title">{title}</span>
          {isVideo && <span className="badge-video">Video</span>}
          {featured && <span className="badge-featured">Featured</span>}
          {isPremium && <span className="badge-premium-only">Premium</span>}
        </div>
        <div className="card-meta">
          <strong>Levels:</strong> {levelStr}<br />
          {lessonCount} lessons
        </div>
      </div>
    </div>
  );
}
