import React, { useState } from 'react';
import Modal from './Modal';

interface EquipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    equipment_name: initialData?.equipment_name || '',
    equipment_type_id: initialData?.equipment_type_id || '',
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать оборудование' : 'Создать оборудование'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название оборудования:</label>
          <input
            type="text"
            value={formData.equipment_name}
            onChange={(e) => setFormData({ ...formData, equipment_name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Тип оборудования ID:</label>
          <input
            type="number"
            value={formData.equipment_type_id}
            onChange={(e) => setFormData({ ...formData, equipment_type_id: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Активно:</label>
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
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

export default EquipmentForm;