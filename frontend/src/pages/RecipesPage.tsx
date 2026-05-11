import React, { useState } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeOperations } from '../hooks/useRecipeOperations';
import { useRecipeIngredients } from '../hooks/useRecipeIngredients';
import { useIngredients } from '../hooks/useIngredients';
import api from '../services/api';
import RecipeForm from '../components/RecipeForm';
import RecipeOperationForm from '../components/RecipeOperationForm';
import RecipeIngredientForm from '../components/RecipeIngredientForm';
import { confirmDelete } from '../utils/helpers';
import { Recipe, RecipeOperation, RecipeIngredient } from '../types';

const RecipesPage: React.FC = () => {
  const { recipes, refetch: refetchRecipes } = useRecipes();
  const { recipeOperations, refetch: refetchOperations } = useRecipeOperations();
  const { recipeIngredients, refetch: refetchIngredients } = useRecipeIngredients();
  const { ingredients } = useIngredients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [editingOperation, setEditingOperation] = useState<RecipeOperation | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<RecipeIngredient | null>(null);
  const [currentRecipeId, setCurrentRecipeId] = useState<number | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);

  const handleCreate = async (data: any) => {
    try {
      const newRecipe = await api.createRecipe(data);
      refetchRecipes();
      // После создания рецепта открыть модал для добавления операций
      setTimeout(() => {
        setCurrentRecipeId(newRecipe.recipe_id);
        setEditingOperation(null);
        setIsOperationModalOpen(true);
        setExpandedRecipe(newRecipe.recipe_id); // Развернуть рецепт
      }, 100);
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

  const handleCreateOperation = async (data: any) => {
    if (!currentRecipeId) return;
    try {
      await api.createRecipeOperation({ ...data, recipe_id: currentRecipeId });
      refetchOperations();
    } catch (err) {
      alert('Ошибка при создании операции');
    }
  };

  const handleUpdateOperation = async (data: any) => {
    if (!editingOperation) return;
    try {
      await api.updateRecipeOperation(editingOperation.recipe_operation_id, data);
      refetchOperations();
      setEditingOperation(null);
    } catch (err) {
      alert('Ошибка при обновлении операции');
    }
  };

  const handleDeleteOperation = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить эту операцию?')) return;
    try {
      await api.deleteRecipeOperation(id);
      refetchOperations();
    } catch (err) {
      alert('Ошибка при удалении операции');
    }
  };

  const handleCreateIngredient = async (data: any) => {
    if (!currentRecipeId) return;
    try {
      await api.createRecipeIngredient({ ...data, recipe_id: currentRecipeId });
      refetchIngredients();
    } catch (err) {
      alert('Ошибка при добавлении ингредиента');
    }
  };

  const handleUpdateIngredient = async (data: any) => {
    if (!editingIngredient) return;
    try {
      await api.updateRecipeIngredient(editingIngredient.recipe_ingredient_id, data);
      refetchIngredients();
      setEditingIngredient(null);
    } catch (err) {
      alert('Ошибка при обновлении ингредиента');
    }
  };

  const handleDeleteIngredient = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить этот ингредиент из рецепта?')) return;
    try {
      await api.deleteRecipeIngredient(id);
      refetchIngredients();
    } catch (err) {
      alert('Ошибка при удалении ингредиента');
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

  const openCreateOperationModal = (recipeId: number) => {
    setCurrentRecipeId(recipeId);
    setEditingOperation(null);
    setIsOperationModalOpen(true);
  };

  const openEditOperationModal = (operation: RecipeOperation) => {
    setEditingOperation(operation);
    setIsOperationModalOpen(true);
  };

  const closeOperationModal = () => {
    setIsOperationModalOpen(false);
    setEditingOperation(null);
    setCurrentRecipeId(null);
  };

  const openCreateIngredientModal = (recipeId: number) => {
    setCurrentRecipeId(recipeId);
    setEditingIngredient(null);
    setIsIngredientModalOpen(true);
  };

  const openEditIngredientModal = (ingredient: RecipeIngredient) => {
    setEditingIngredient(ingredient);
    setIsIngredientModalOpen(true);
  };

  const closeIngredientModal = () => {
    setIsIngredientModalOpen(false);
    setEditingIngredient(null);
    setCurrentRecipeId(null);
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

  const getIngredientName = (ingredientId: number) => {
    const ingredient = ingredients.find((ing: any) => ing.ingredient_id === ingredientId);
    return ingredient ? `${ingredient.ingredient_name} (${ingredient.unit})` : `Ингредиент ${ingredientId}`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Рецептуры</h1>
        <h2>Кондитер.план</h2>
      </div>
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
                  <button onClick={() => openCreateOperationModal(recipe.recipe_id)}>Добавить операцию</button>
                  <table>
                    <thead>
                      <tr>
                        <th>Последовательность</th>
                        <th>Название</th>
                        <th>Длительность (мин)</th>
                        <th>Тип оборудования</th>
                        <th>Квалификация</th>
                        <th>Действия</th>
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
                          <td>
                            <button onClick={() => openEditOperationModal(op)}>Редактировать</button>
                            <button onClick={() => handleDeleteOperation(op.recipe_operation_id)}>Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="ingredients-section">
                  <h4>Ингредиенты</h4>
                  <button onClick={() => openCreateIngredientModal(recipe.recipe_id)}>Добавить ингредиент</button>
                  <table>
                    <thead>
                      <tr>
                        <th>Ингредиент</th>
                        <th>Количество на единицу</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getIngredientsForRecipe(recipe.recipe_id).map((ing: RecipeIngredient) => (
                        <tr key={ing.recipe_ingredient_id}>
                          <td>{getIngredientName(ing.ingredient_id)}</td>
                          <td>{ing.quantity_per_unit}</td>
                          <td>
                            <button onClick={() => openEditIngredientModal(ing)}>Редактировать</button>
                            <button onClick={() => handleDeleteIngredient(ing.recipe_ingredient_id)}>Удалить</button>
                          </td>
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
      <RecipeOperationForm
        isOpen={isOperationModalOpen}
        onClose={closeOperationModal}
        onSubmit={editingOperation ? handleUpdateOperation : handleCreateOperation}
        initialData={editingOperation}
      />
      <RecipeIngredientForm
        isOpen={isIngredientModalOpen}
        onClose={closeIngredientModal}
        onSubmit={editingIngredient ? handleUpdateIngredient : handleCreateIngredient}
        initialData={editingIngredient}
      />
    </div>
  );
};

export default RecipesPage;