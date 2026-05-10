import { useState, useEffect } from 'react';
import api from '../services/api';
import { Confectioner } from '../types';

export const useConfectioners = () => {
  const [confectioners, setConfectioners] = useState<Confectioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfectioners = async () => {
    try {
      const data = await api.getConfectioners();
      setConfectioners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfectioners();
  }, []);

  return { confectioners, loading, error, refetch: fetchConfectioners };
};