// ============================================
// TopicGrid — Listening IELTS
// ============================================
import TopicCard from './TopicCard';
import EmptyState from '../ui/EmptyState';

export default function TopicGrid({ topics = [], onTopicClick }) {
  if (!topics.length) {
    return <EmptyState icon="🔍" message="Không có chủ đề nào" />;
  }

  return (
    <div className="topics-grid">
      {topics.map((topic, i) => (
        <TopicCard
          key={topic._id || topic.slug || i}
          topic={topic}
          index={i}
          onClick={onTopicClick}
        />
      ))}
    </div>
  );
}
