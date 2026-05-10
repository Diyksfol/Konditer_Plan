import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useEquipmentTypes } from '../hooks/useEquipmentTypes';
import { useQualifications } from '../hooks/useQualifications';

interface RecipeOperationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const RecipeOperationForm: React.FC<RecipeOperationFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { equipmentTypes } = useEquipmentTypes();
  const { qualifications } = useQualifications();
  const [formData, setFormData] = useState({
    operation_name: initialData?.operation_name || '',
    duration_minutes: initialData?.duration_minutes || '',
    sequence_number: initialData?.sequence_number || '',
    equipment_type_id: initialData?.equipment_type_id || '',
    required_qualification_id: initialData?.required_qualification_id || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        operation_name: initialData.operation_name || '',
        duration_minutes: initialData.duration_minutes || '',
        sequence_number: initialData.sequence_number || '',
        equipment_type_id: initialData.equipment_type_id || '',
        required_qualification_id: initialData.required_qualification_id || '',
      });
    } else {
      setFormData({
        operation_name: '',
        duration_minutes: '',
        sequence_number: '',
        equipment_type_id: '',
        required_qualification_id: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Отправляем только заполненные поля
    const dataToSubmit: any = {};
    if (formData.operation_name.trim()) dataToSubmit.operation_name = formData.operation_name.trim();
    if (formData.duration_minutes !== '') dataToSubmit.duration_minutes = parseInt(formData.duration_minutes);
    if (formData.sequence_number !== '') dataToSubmit.sequence_number = parseInt(formData.sequence_number);
    if (formData.equipment_type_id) dataToSubmit.equipment_type_id = parseInt(formData.equipment_type_id);
    if (formData.required_qualification_id) dataToSubmit.required_qualification_id = parseInt(formData.required_qualification_id);

    onSubmit(dataToSubmit);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать операцию' : 'Создать операцию'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название операции:</label>
          <input
            type="text"
            value={formData.operation_name}
            onChange={(e) => setFormData({ ...formData, operation_name: e.target.value })}
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div className="form-group">
          <label>Длительность (минуты):</label>
          <input
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div className="form-group">
          <label>Порядок выполнения:</label>
          <input
            type="number"
            value={formData.sequence_number}
            onChange={(e) => setFormData({ ...formData, sequence_number: e.target.value })}
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div className="form-group">
          <label>Тип оборудования:</label>
          <select
            value={formData.equipment_type_id}
            onChange={(e) => setFormData({ ...formData, equipment_type_id: e.target.value })}
          >
            <option value="">Не требуется</option>
            {equipmentTypes.map((type: any) => (
              <option key={type.equipment_type_id} value={type.equipment_type_id}>
                {type.equipment_type_id} - {type.type_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Требуемая квалификация:</label>
          <select
            value={formData.required_qualification_id}
            onChange={(e) => setFormData({ ...formData, required_qualification_id: e.target.value })}
          >
            <option value="">Не требуется</option>
            {qualifications.map((qual: any) => (
              <option key={qual.qualification_id} value={qual.qualification_id}>
                {qual.qualification_id} - {qual.name}
              </option>
            ))}
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

export default RecipeOperationForm;