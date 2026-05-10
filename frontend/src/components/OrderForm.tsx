import React, { useState } from 'react';
import Modal from './Modal';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    recipe_id: initialData?.recipe_id || '',
    quantity: initialData?.quantity || '',
    delivery_date: initialData?.delivery_date || '',
    status: initialData?.status || 'planned',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать заказ' : 'Создать заказ'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipe ID:</label>
          <input
            type="number"
            value={formData.recipe_id}
            onChange={(e) => setFormData({ ...formData, recipe_id: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Количество:</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Дата доставки:</label>
          <input
            type="date"
            value={formData.delivery_date}
            onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Статус:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
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