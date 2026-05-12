import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useIngredients } from '../hooks/useIngredients';

interface RecipeIngredientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const RecipeIngredientForm: React.FC<RecipeIngredientFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { ingredients } = useIngredients();
  const [formData, setFormData] = useState({
    ingredient_id: initialData?.ingredient_id || '',
    quantity: initialData?.quantity || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ingredient_id: initialData.ingredient_id || '',
        quantity: initialData.quantity || '',
      });
    } else {
      setFormData({
        ingredient_id: '',
        quantity: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Отправляем только заполненные поля
    const dataToSubmit: any = {};
    if (formData.ingredient_id) dataToSubmit.ingredient_id = parseInt(formData.ingredient_id);
    if (formData.quantity !== '') dataToSubmit.quantity = parseFloat(formData.quantity);

    onSubmit(dataToSubmit);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать ингредиент рецепта' : 'Добавить ингредиент'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ингредиент:</label>
          <select
            value={formData.ingredient_id}
            onChange={(e) => setFormData({ ...formData, ingredient_id: e.target.value })}
          >
            <option value="">Выберите ингредиент</option>
            {[...ingredients].sort((a: any, b: any) => a.ingredient_id - b.ingredient_id).map((ing: any) => (
              <option key={ing.ingredient_id} value={ing.ingredient_id}>
                {ing.ingredient_id} - {ing.ingredient_name} ({ing.unit})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Количество:</label>
          <input
            type="number"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div className="form-actions">
          <button type="submit">{initialData ? 'Обновить' : 'Добавить'}</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </Modal>
  );
};

export default RecipeIngredientForm;