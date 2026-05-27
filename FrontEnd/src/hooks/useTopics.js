// ============================================
// useTopics — fetch + filter topics from API
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { topicService } from '../services/topicService';

export function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter === 'beginner') params.level = 'A1';
      else if (filter === 'intermediate') params.level = 'B1';
      else if (filter === 'advanced') params.level = 'C1';
      else if (filter === 'video') params.type = 'video';

      const { data } = await topicService.getAll(params);
      setTopics(data.data || []); 
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải topics');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return { topics, loading, error, filter, setFilter, search, setSearch, refetch: fetchTopics };
}
