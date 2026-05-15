// ============================================
// FilterTabs — Listening IELTS
// ============================================
import { FILTER_OPTIONS } from '../../utils/constants';

export default function FilterTabs({ activeFilter, onFilterChange }) {
  return (
    <div className="filter-tabs">
      {FILTER_OPTIONS.map((opt) => (
        <div
          key={opt.value}
          className={`tab ${activeFilter === opt.value ? 'active' : ''}`}
          onClick={() => onFilterChange(opt.value)}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}
