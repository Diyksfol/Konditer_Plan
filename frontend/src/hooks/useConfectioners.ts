import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { Confectioner } from '../types';

export const useConfectioners = () => {
  const [confectioners, setConfectioners] = useState<Confectioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfectioners = async () => {
    try {
      const data = await api.getConfectioners();
      setConfectioners(data.sort((a: Confectioner, b: Confectioner) => a.confectioner_id - b.confectioner_id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfectioners();
  }, []);

  return { confectioners, loading, error, refetch: fetchConfectioners };
};