import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { EquipmentType } from '../types';

export const useEquipmentTypes = () => {
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipmentTypes = async () => {
    try {
      const data = await api.getEquipmentTypes();
      setEquipmentTypes(data.sort((a: EquipmentType, b: EquipmentType) => a.equipment_type_id - b.equipment_type_id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipmentTypes();
  }, []);

  return { equipmentTypes, loading, error, refetch: fetchEquipmentTypes };
};