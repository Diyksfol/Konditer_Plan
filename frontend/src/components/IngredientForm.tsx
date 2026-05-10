import React, { useState } from 'react';
import Modal from './Modal';

interface IngredientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    unit: initialData?.unit || '',
    current_quantity: initialData?.current_quantity || '',
    min_quantity: initialData?.min_quantity || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать ингредиент' : 'Создать ингредиент'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Единица измерения:</label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Текущее количество:</label>
          <input
            type="number"
            step="0.01"
            value={formData.current_quantity}
            onChange={(e) => setFormData({ ...formData, current_quantity: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Минимальное количество:</label>
          <input
            type="number"
            step="0.01"
            value={formData.min_quantity}
            onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">{initialData ? 'Обновить' : 'Создать'}</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </Modal>
  );
};

export default IngredientForm;