import React, { useState } from 'react';
import Modal from './Modal';

interface ConfectionerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ConfectionerForm: React.FC<ConfectionerFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    qualification_id: initialData?.qualification_id || '',
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
            required
          />
        </div>
        <div className="form-group">
          <label>Квалификация ID:</label>
          <input
            type="number"
            value={formData.qualification_id}
            onChange={(e) => setFormData({ ...formData, qualification_id: e.target.value })}
            required
          />
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