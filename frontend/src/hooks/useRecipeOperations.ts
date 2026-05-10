import { useState, useEffect } from 'react';
import api from '../services/api';
import { RecipeOperation } from '../types';

export const useRecipeOperations = () => {
  const [recipeOperations, setRecipeOperations] = useState<RecipeOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipeOperations = async () => {
    try {
      const data = await api.getRecipeOperations();
      setRecipeOperations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeOperations();
  }, []);

  return { recipeOperations, loading, error, refetch: fetchRecipeOperations };
};