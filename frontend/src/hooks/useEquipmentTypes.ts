import { useState, useEffect } from 'react';
import api from '../services/api';
import { EquipmentType } from '../types';

export const useEquipmentTypes = () => {
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipmentTypes = async () => {
    try {
      const data = await api.getEquipmentTypes();
      setEquipmentTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipmentTypes();
  }, []);

  return { equipmentTypes, loading, error, refetch: fetchEquipmentTypes };
};