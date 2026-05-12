import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { RecipeIngredient } from '../types';

export const useRecipeIngredients = () => {
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipeIngredients = async () => {
    try {
      const data = await api.getRecipeIngredients();
      setRecipeIngredients(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeIngredients();
  }, []);

  return { recipeIngredients, loading, error, refetch: fetchRecipeIngredients };
};