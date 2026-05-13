import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { Equipment } from '../types';

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      const data = await api.getEquipment();
      setEquipments(data.sort((a: Equipment, b: Equipment) => {
        if (a.equipment_type_id !== b.equipment_type_id) {
          return a.equipment_type_id - b.equipment_type_id;
        }
        return a.equipment_id - b.equipment_id;
      }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return { equipments, loading, error, refetch: fetchEquipments };
};