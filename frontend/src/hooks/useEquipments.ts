import { useState, useEffect } from 'react';
import api from '../services/api';
import { Equipment } from '../types';

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      const data = await api.getEquipments();
      setEquipments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return { equipments, loading, error, refetch: fetchEquipments };
};