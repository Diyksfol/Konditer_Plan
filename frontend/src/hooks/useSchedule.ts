import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { ScheduleEntry } from '../types';

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    try {
      const data = await api.getSchedule();
      setSchedule(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return { schedule, loading, error, refetch: fetchSchedule };
};