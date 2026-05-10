import { useState, useEffect } from 'react';
import api from '../services/api';
import { Qualification } from '../types';

export const useQualifications = () => {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQualifications = async () => {
    try {
      const data = await api.getQualifications();
      setQualifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualifications();
  }, []);

  return { qualifications, loading, error, refetch: fetchQualifications };
};