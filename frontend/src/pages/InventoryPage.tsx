import React, { useState } from 'react';
import { useIngredients } from '../hooks/useIngredients';
import { useInventories } from '../hooks/useInventories';
import api from '../services/api';
import IngredientForm from '../components/IngredientForm';
import { confirmDelete, formatDate } from '../utils/helpers';
import { Ingredient, Inventory } from '../types';

const InventoryPage: React.FC = () => {
  const { ingredients, refetch: refetchIngredients } = useIngredients();
  const { inventories } = useInventories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const getInventoryForIngredient = (ingredientId: number) => {
    return inventories.find((inv: Inventory) => inv.ingredient_id === ingredientId);
  };

  const isLowStock = (ingredient: Ingredient) => {
    const inventory = getInventoryForIngredient(ingredient.ingredient_id);
    return inventory && inventory.current_quantity <= inventory.min_stock;
  };

  const handleCreate = async (data: any) => {
    try {
      await api.createIngredient(data);
      refetchIngredients();
    } catch (err) {
      alert('Ошибка при создании ингредиента');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingIngredient) return;
    try {
      await api.updateIngredient(editingIngredient.ingredient_id, data);
      refetchIngredients();
      setEditingIngredient(null);
    } catch (err) {
      alert('Ошибка при обновлении ингредиента');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить этот ингредиент?')) return;
    try {
      await api.deleteIngredient(id);
      refetchIngredients();
    } catch (err) {
      alert('Ошибка при удалении ингредиента');
    }
  };

  const openCreateModal = () => {
    setEditingIngredient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIngredient(null);
  };

  return (
    <div>
      <h1>Склад</h1>
      <button onClick={openCreateModal}>Добавить ингредиент</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Единица</th>
            <th>Текущее количество</th>
            <th>Минимум</th>
            <th>Последняя проверка</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient: Ingredient) => {
            const inventory = getInventoryForIngredient(ingredient.ingredient_id);
            const lowStock = isLowStock(ingredient);
            return (
              <tr key={ingredient.ingredient_id} className={lowStock ? 'low-stock' : ''}>
                <td>{ingredient.ingredient_id}</td>
                <td>{ingredient.name}</td>
                <td>{inventory?.unit || ingredient.unit}</td>
                <td>{inventory?.current_quantity || ingredient.current_quantity}</td>
                <td>{inventory?.min_stock || ingredient.min_quantity}</td>
                <td>{inventory ? formatDate(inventory.last_check) : 'N/A'}</td>
                <td>
                  <button onClick={() => openEditModal(ingredient)}>Редактировать</button>
                  <button onClick={() => handleDelete(ingredient.ingredient_id)}>Удалить</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <IngredientForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingIngredient ? handleUpdate : handleCreate}
        initialData={editingIngredient}
      />
    </div>
  );
};

export default InventoryPage;