import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { Ingredient } from '../types';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = async () => {
    try {
      const data = await api.getIngredients();
      setIngredients(data.sort((a: Ingredient, b: Ingredient) => a.ingredient_id - b.ingredient_id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return { ingredients, loading, error, refetch: fetchIngredients };
};