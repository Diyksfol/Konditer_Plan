import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useQualifications } from '../hooks/useQualifications';

interface ConfectionerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ConfectionerForm: React.FC<ConfectionerFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { qualifications } = useQualifications();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    qualification_id: initialData?.qualification_id || '',
    is_active: initialData?.is_active ?? true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        qualification_id: initialData.qualification_id || '',
        is_active: initialData.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        qualification_id: '',
        is_active: true,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Отправляем только заполненные поля
    const dataToSubmit: any = {};
    if (formData.name.trim()) dataToSubmit.name = formData.name.trim();
    if (formData.qualification_id) dataToSubmit.qualification_id = parseInt(formData.qualification_id);
    dataToSubmit.is_active = formData.is_active; // boolean всегда отправляем

    onSubmit(dataToSubmit);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать кондитера' : 'Создать кондитера'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div className="form-group">
          <label>Квалификация:</label>
          <select
            value={formData.qualification_id}
            onChange={(e) => setFormData({ ...formData, qualification_id: e.target.value })}
          >
            <option value="">Выберите квалификацию</option>
            {[...qualifications].sort((a: any, b: any) => a.qualification_id - b.qualification_id).map((qual: any) => (
              <option key={qual.qualification_id} value={qual.qualification_id}>
                {qual.qualification_id} - {qual.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Активен:</label>
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

export default ConfectionerForm;