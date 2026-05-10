import { useState, useEffect } from 'react';
import api from '../services/api';
import { Inventory } from '../types';

export const useInventories = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventories = async () => {
    try {
      const data = await api.getInventories();
      setInventories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  return { inventories, loading, error, refetch: fetchInventories };
};