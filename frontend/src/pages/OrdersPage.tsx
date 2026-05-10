import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useRecipes } from '../hooks/useRecipes';
import api from '../services/api';
import OrderForm from '../components/OrderForm';
import { confirmDelete, formatDate } from '../utils/helpers';
import { Order, Recipe } from '../types';

const OrdersPage: React.FC = () => {
  const { orders, loading, error, refetch } = useOrders();
  const { recipes } = useRecipes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const getRecipeName = (recipeId: number) => {
    const recipe = recipes.find((r: Recipe) => r.recipe_id === recipeId);
    return recipe ? recipe.name : `Рецепт ${recipeId}`;
  };

  const handleCreate = async (data: any) => {
    try {
      await api.createOrder(data);
      refetch();
    } catch (err) {
      alert('Ошибка при создании заказа');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingOrder) return;
    try {
      await api.updateOrder(editingOrder.order_id, data);
      refetch();
      setEditingOrder(null);
    } catch (err) {
      alert('Ошибка при обновлении заказа');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить этот заказ?')) return;
    try {
      await api.deleteOrder(id);
      refetch();
    } catch (err) {
      alert('Ошибка при удалении заказа');
    }
  };

  const openCreateModal = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h1>Заказы</h1>
      <button onClick={openCreateModal}>Добавить заказ</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Рецепт</th>
            <th>Количество</th>
            <th>Дата доставки</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{getRecipeName(order.recipe_id)}</td>
              <td>{order.quantity}</td>
              <td>{formatDate(order.delivery_date)}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => openEditModal(order)}>Редактировать</button>
                <button onClick={() => handleDelete(order.order_id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <OrderForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingOrder ? handleUpdate : handleCreate}
        initialData={editingOrder}
      />
    </div>
  );
};

export default OrdersPage;