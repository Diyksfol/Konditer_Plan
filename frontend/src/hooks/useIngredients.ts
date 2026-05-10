import { useState, useEffect } from 'react';
import api from '../services/api';
import { Ingredient } from '../types';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = async () => {
    try {
      const data = await api.getIngredients();
      setIngredients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return { ingredients, loading, error, refetch: fetchIngredients };
};