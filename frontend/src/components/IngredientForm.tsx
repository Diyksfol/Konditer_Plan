import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface IngredientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    ingredient_name: initialData?.ingredient_name || '',
    unit: initialData?.unit || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ingredient_name: initialData.ingredient_name || '',
        unit: initialData.unit || '',
      });
    } else {
      setFormData({
        ingredient_name: '',
        unit: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Отправляем только заполненные поля
    const dataToSubmit: any = {};
    if (formData.ingredient_name.trim()) dataToSubmit.ingredient_name = formData.ingredient_name.trim();
    if (formData.unit.trim()) dataToSubmit.unit = formData.unit.trim();

    onSubmit(dataToSubmit);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать ингредиент' : 'Создать ингредиент'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название:</label>
          <input
            type="text"
            value={formData.ingredient_name}
            onChange={(e) => setFormData({ ...formData, ingredient_name: e.target.value })}
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div className="form-group">
          <label>Единица измерения:</label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          >
            <option value="">Выберите единицу</option>
            <option value="кг">кг (килограммы)</option>
            <option value="г">г (граммы)</option>
            <option value="л">л (литры)</option>
            <option value="мл">мл (миллилитры)</option>
            <option value="шт">шт (штуки)</option>
            <option value="дозы">дозы</option>
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

export default IngredientForm;