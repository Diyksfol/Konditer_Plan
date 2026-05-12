import { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { Recipe } from '../types';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      const data = await api.getRecipes();
      setRecipes(data.sort((a: Recipe, b: Recipe) => a.recipe_id - b.recipe_id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return { recipes, loading, error, refetch: fetchRecipes };
};