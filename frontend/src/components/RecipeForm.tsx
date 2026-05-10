import React, { useState } from 'react';
import Modal from './Modal';

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    shelf_life_days: initialData?.shelf_life_days || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать рецепт' : 'Создать рецепт'}>
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
          <label>Срок хранения (дни):</label>
          <input
            type="number"
            value={formData.shelf_life_days}
            onChange={(e) => setFormData({ ...formData, shelf_life_days: e.target.value })}
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

export default RecipeForm;