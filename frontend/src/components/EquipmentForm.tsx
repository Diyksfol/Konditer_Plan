import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useEquipmentTypes } from '../hooks/useEquipmentTypes';

interface EquipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { equipmentTypes } = useEquipmentTypes();
  const [formData, setFormData] = useState({
    equipment_name: initialData?.equipment_name || '',
    equipment_type_id: initialData?.equipment_type_id || '',
    is_active: initialData?.is_active ?? true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        equipment_name: initialData.equipment_name || '',
        equipment_type_id: initialData.equipment_type_id || '',
        is_active: initialData.is_active ?? true,
      });
    } else {
      setFormData({
        equipment_name: '',
        equipment_type_id: '',
        is_active: true,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Отправляем только заполненные поля
    const dataToSubmit: any = {};
    if (formData.equipment_name.trim()) dataToSubmit.equipment_name = formData.equipment_name.trim();
    if (formData.equipment_type_id) dataToSubmit.equipment_type_id = parseInt(formData.equipment_type_id);
    dataToSubmit.is_active = formData.is_active; // boolean всегда отправляем

    onSubmit(dataToSubmit);
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
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div className="form-group">
          <label>Тип оборудования:</label>
          <select
            value={formData.equipment_type_id}
            onChange={(e) => setFormData({ ...formData, equipment_type_id: e.target.value })}
          >
            <option value="">Выберите тип оборудования</option>
            {[...equipmentTypes].sort((a: any, b: any) => a.equipment_type_id - b.equipment_type_id).map((type: any) => (
              <option key={type.equipment_type_id} value={type.equipment_type_id}>
                {type.equipment_type_id} - {type.equipment_name}
              </option>
            ))}
          </select>
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