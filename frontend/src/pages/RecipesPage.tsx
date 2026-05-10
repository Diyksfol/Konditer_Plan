import React, { useState } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeOperations } from '../hooks/useRecipeOperations';
import { useRecipeIngredients } from '../hooks/useRecipeIngredients';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm';
import { confirmDelete } from '../utils/helpers';
import { Recipe, RecipeOperation, RecipeIngredient } from '../types';

const RecipesPage: React.FC = () => {
  const { recipes, refetch: refetchRecipes } = useRecipes();
  const { recipeOperations } = useRecipeOperations();
  const { recipeIngredients } = useRecipeIngredients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);

  const handleCreate = async (data: any) => {
    try {
      await api.createRecipe(data);
      refetchRecipes();
    } catch (err) {
      alert('Ошибка при создании рецепта');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingRecipe) return;
    try {
      await api.updateRecipe(editingRecipe.recipe_id, data);
      refetchRecipes();
      setEditingRecipe(null);
    } catch (err) {
      alert('Ошибка при обновлении рецепта');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить этот рецепт?')) return;
    try {
      await api.deleteRecipe(id);
      refetchRecipes();
    } catch (err) {
      alert('Ошибка при удалении рецепта');
    }
  };

  const openCreateModal = () => {
    setEditingRecipe(null);
    setIsModalOpen(true);
  };

  const openEditModal = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecipe(null);
  };

  const toggleExpand = (recipeId: number) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const getOperationsForRecipe = (recipeId: number) => {
    return recipeOperations.filter((op: RecipeOperation) => op.recipe_id === recipeId);
  };

  const getIngredientsForRecipe = (recipeId: number) => {
    return recipeIngredients.filter((ing: RecipeIngredient) => ing.recipe_id === recipeId);
  };

  return (
    <div>
      <h1>Рецептуры</h1>
      <button onClick={openCreateModal}>Добавить рецепт</button>
      <div className="recipes-list">
        {recipes.map((recipe: Recipe) => (
          <div key={recipe.recipe_id} className="recipe-card">
            <div className="recipe-header">
              <h3>{recipe.name}</h3>
              <p>Срок хранения: {recipe.shelf_life_days} дней</p>
              <div className="recipe-actions">
                <button onClick={() => toggleExpand(recipe.recipe_id)}>
                  {expandedRecipe === recipe.recipe_id ? 'Свернуть' : 'Развернуть'}
                </button>
                <button onClick={() => openEditModal(recipe)}>Редактировать</button>
                <button onClick={() => handleDelete(recipe.recipe_id)}>Удалить</button>
              </div>
            </div>
            {expandedRecipe === recipe.recipe_id && (
              <div className="recipe-details">
                <div className="operations-section">
                  <h4>Операции</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Последовательность</th>
                        <th>Название</th>
                        <th>Длительность (мин)</th>
                        <th>Тип оборудования</th>
                        <th>Квалификация</th>
                        <th>Количество продукта</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getOperationsForRecipe(recipe.recipe_id).map((op: RecipeOperation) => (
                        <tr key={op.recipe_operation_id}>
                          <td>{op.sequence_number}</td>
                          <td>{op.operation_name}</td>
                          <td>{op.duration_minutes}</td>
                          <td>{op.equipment_type_id}</td>
                          <td>{op.required_qualification_id}</td>
                          <td>{op.product_quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="ingredients-section">
                  <h4>Ингредиенты</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Ингредиент ID</th>
                        <th>Количество на единицу</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getIngredientsForRecipe(recipe.recipe_id).map((ing: RecipeIngredient) => (
                        <tr key={ing.recipe_ingredient_id}>
                          <td>{ing.ingredient_id}</td>
                          <td>{ing.quantity_per_unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <RecipeForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingRecipe ? handleUpdate : handleCreate}
        initialData={editingRecipe}
      />
    </div>
  );
};

export default RecipesPage;