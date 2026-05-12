import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { Qualification } from '../types';

export const useQualifications = () => {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQualifications = async () => {
    try {
      const data = await api.getQualifications();
      setQualifications(data.sort((a: Qualification, b: Qualification) => a.qualification_id - b.qualification_id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQualifications();
  }, []);

  return { qualifications, loading, error, refetch: fetchQualifications };
};