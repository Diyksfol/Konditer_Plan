import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useRecipes } from '../hooks/useRecipes';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { recipes } = useRecipes();
  const [formData, setFormData] = useState({
    recipe_id: initialData?.recipe_id || '',
    quantity: initialData?.quantity || '',
    delivery_date: initialData?.delivery_date || '',
    status: initialData?.status || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        recipe_id: initialData.recipe_id || '',
        quantity: initialData.quantity || '',
        delivery_date: initialData.delivery_date || '',
        status: initialData.status || '',
      });
    } else {
      setFormData({
        recipe_id: '',
        quantity: '',
        delivery_date: '',
        status: 'planned',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Отправляем только заполненные поля
    const dataToSubmit: any = {};
    if (formData.recipe_id) dataToSubmit.recipe_id = parseInt(formData.recipe_id);
    if (formData.quantity) dataToSubmit.quantity = parseInt(formData.quantity);
    if (formData.delivery_date) dataToSubmit.delivery_date = formData.delivery_date;
    if (formData.status) dataToSubmit.status = formData.status;

    onSubmit(dataToSubmit);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать заказ' : 'Создать заказ'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Рецепт:</label>
          <select
            value={formData.recipe_id}
            onChange={(e) => setFormData({ ...formData, recipe_id: e.target.value })}
          >
            <option value="">Выберите рецепт</option>
            {recipes.map((recipe: any) => (
              <option key={recipe.recipe_id} value={recipe.recipe_id}>
                {recipe.recipe_id} - {recipe.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Количество:</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div className="form-group">
          <label>Дата доставки:</label>
          <input
            type="date"
            value={formData.delivery_date}
            onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div className="form-group">
          <label>Статус:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="">Оставьте пустым, чтобы не менять</option>
            <option value="planned">Запланирован</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершен</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit">{initialData ? 'Обновить' : 'Создать'}</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </Modal>
  );
};

export default OrderForm;