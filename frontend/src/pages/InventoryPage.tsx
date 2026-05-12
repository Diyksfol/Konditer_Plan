import React, { useState } from 'react';
import { useIngredients } from '../hooks/useIngredients';
import { useInventories } from '../hooks/useInventories';
import api, { getErrorMessage } from '../services/api';
import IngredientForm from '../components/IngredientForm';
import { confirmDelete, formatDate } from '../utils/helpers';
import { Ingredient, Inventory } from '../types';

const InventoryPage: React.FC = () => {
  const { ingredients, refetch: refetchIngredients } = useIngredients();
  const { inventories, refetch: refetchInventories } = useInventories();
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
      refetchInventories();
    } catch (err) {
      alert(`Ошибка при создании ингредиента: ${getErrorMessage(err)}`);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingIngredient) return;
    try {
      const inventory = getInventoryForIngredient(editingIngredient.ingredient_id);
      if (inventory && ('current_quantity' in data || 'min_stock' in data)) {
        // Update inventory if it exists and inventory data is being changed
        const inventoryUpdate: any = {};
        if ('current_quantity' in data) inventoryUpdate.current_quantity = data.current_quantity;
        if ('min_stock' in data) inventoryUpdate.min_stock = data.min_stock;
        await api.updateInventory(inventory.inventory_id, inventoryUpdate);
      }
      // Update ingredient fields if present
      const ingredientUpdate: any = {};
      if ('ingredient_name' in data) ingredientUpdate.ingredient_name = data.ingredient_name;
      if ('unit' in data) ingredientUpdate.unit = data.unit;
      if (Object.keys(ingredientUpdate).length > 0) {
        await api.updateIngredient(editingIngredient.ingredient_id, ingredientUpdate);
      }
      refetchIngredients();
      refetchInventories();
      setEditingIngredient(null);
    } catch (err) {
      alert(`Ошибка при обновлении ингредиента: ${getErrorMessage(err)}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить этот ингредиент?')) return;
    try {
      await api.deleteIngredient(id);
      refetchIngredients();
    } catch (err) {
      alert(`Ошибка при удалении ингредиента: ${getErrorMessage(err)}`);
    }
  };

  const handleUpdateCheckDate = async (inventoryId: number) => {
    try {
      await api.updateInventoryCheckDate(inventoryId);
      refetchInventories();
    } catch (err) {
      alert(`Ошибка при обновлении даты проверки: ${getErrorMessage(err)}`);
    }
  };

  const handleCheckAll = async () => {
    try {
      const promises = inventories.map((inv: Inventory) => api.updateInventoryCheckDate(inv.inventory_id));
      await Promise.all(promises);
      refetchInventories();
    } catch (err) {
      alert(`Ошибка при проверке: ${getErrorMessage(err)}`);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Склад</h1>
      </div>
      <button onClick={openCreateModal}>Добавить ингредиент</button>
      <button onClick={handleCheckAll}>Проверить всё</button>
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
          {[...ingredients].sort((a: Ingredient, b: Ingredient) => a.ingredient_id - b.ingredient_id).map((ingredient: Ingredient) => {
            const inventory = getInventoryForIngredient(ingredient.ingredient_id);
            const lowStock = isLowStock(ingredient);
            return (
              <tr key={ingredient.ingredient_id} className={lowStock ? 'low-stock' : ''}>
                <td>{ingredient.ingredient_id}</td>
                <td>{ingredient.ingredient_name}</td>
                <td>{ingredient.unit}</td>
                <td>{inventory?.current_quantity || 0}</td>
                <td>{inventory?.min_stock || 0}</td>
                <td>{inventory ? formatDate(inventory.last_check) : 'N/A'}</td>
                <td>
                  <button onClick={() => openEditModal(ingredient)}>Редактировать</button>
                  <button onClick={() => handleDelete(ingredient.ingredient_id)}>Удалить</button>
                  {inventory && (
                    <button onClick={() => handleUpdateCheckDate(inventory.inventory_id)}>Проверить</button>
                  )}
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