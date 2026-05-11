import React, { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { useEquipments } from '../hooks/useEquipments';
import { useConfectioners } from '../hooks/useConfectioners';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeOperations } from '../hooks/useRecipeOperations';
import { useOrders } from '../hooks/useOrders';
import api from '../services/api';
import ConfectionerForm from '../components/ConfectionerForm';
import EquipmentForm from '../components/EquipmentForm';
import { confirmDelete } from '../utils/helpers';
import { ScheduleEntry, Equipment, Confectioner, Recipe, RecipeOperation, Order } from '../types';

const SchedulePage: React.FC = () => {
  const { schedule, loading, error, refetch } = useSchedule();
  const { equipments } = useEquipments();
  const { confectioners } = useConfectioners();
  const { recipes } = useRecipes();
  const { recipeOperations } = useRecipeOperations();
  const { orders } = useOrders();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isConfectionerModalOpen, setIsConfectionerModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [editingConfectioner, setEditingConfectioner] = useState<Confectioner | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [viewMode, setViewMode] = useState<'equipment' | 'confectioner'>('equipment');

  const hours = Array.from({ length: 10 }, (_, i) => 9 + i); // 9:00 to 18:00

  const getScheduleForCell = (equipmentId: number, hour: number) => {
    const date = new Date(selectedDate);
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(hour + 1, 0, 0, 0);

    return schedule.filter((entry: ScheduleEntry) => {
      const entryStart = new Date(entry.start_time);
      const entryEnd = new Date(entry.end_time);
      return entry.equipment_id === equipmentId &&
             entryStart < endTime && entryEnd > startTime;
    });
  };

  const getScheduleForConfectionerCell = (confectionerId: number, hour: number) => {
    const date = new Date(selectedDate);
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(hour + 1, 0, 0, 0);

    return schedule.filter((entry: ScheduleEntry) => {
      const entryStart = new Date(entry.start_time);
      const entryEnd = new Date(entry.end_time);
      return entry.confectioner_id === confectionerId &&
             entryStart < endTime && entryEnd > startTime;
    });
  };

  const getRecipeName = (recipeId: number) => {
    const recipe = recipes.find((r: Recipe) => r.recipe_id === recipeId);
    return recipe ? recipe.name : `Рецепт ${recipeId}`;
  };

  const getOrderQuantity = (orderId: number) => {
    const order = orders.find((o: Order) => o.order_id === orderId);
    return order ? order.quantity : 1;
  };

  const getEquipmentName = (equipmentId: number) => {
    const equipment = equipments.find((e: Equipment) => e.equipment_id === equipmentId);
    return equipment ? equipment.equipment_name : `Оборудование ${equipmentId}`;
  };

  const getOperationForEntry = (operationId: number) => {
    return recipeOperations.find((op: RecipeOperation) => op.recipe_operation_id === operationId);
  };

  const getOrderRecipeNameAndQuantity = (orderId: number) => {
    const order = orders.find((o: Order) => o.order_id === orderId);
    if (!order) return `Заказ ${orderId}`;
    const recipe = recipes.find((r: Recipe) => r.recipe_id === order.recipe_id);
    const recipeName = recipe ? recipe.name : `Рецепт ${order.recipe_id}`;
    return `${recipeName} x ${order.quantity}`;
  };

  const getConfectionerName = (confectionerId: number) => {
    const confectioner = confectioners.find((c: Confectioner) => c.confectioner_id === confectionerId);
    return confectioner ? confectioner.name : `Кондитер ${confectionerId}`;
  };

  const handleRunPlanning = async () => {
    try {
      const result = await api.runPlanning();
      refetch();
      alert(`Планирование выполнено: ${result.status}`);
    } catch (err: any) {
      console.error('Planning error:', err);
      alert(`Ошибка при планировании: ${err.message || 'Неизвестная ошибка'}`);
    }
  };

  const handleCreateConfectioner = async (data: any) => {
    try {
      await api.createConfectioner(data);
      // refetch confectioners
    } catch (err) {
      alert('Ошибка при создании кондитера');
    }
  };

  const handleUpdateConfectioner = async (data: any) => {
    if (!editingConfectioner) return;
    try {
      await api.updateConfectioner(editingConfectioner.confectioner_id, data);
      // refetch confectioners
      setEditingConfectioner(null);
    } catch (err) {
      alert('Ошибка при обновлении кондитера');
    }
  };

  const handleDeleteConfectioner = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить этого кондитера?')) return;
    try {
      await api.deleteConfectioner(id);
      // refetch confectioners
    } catch (err) {
      alert('Ошибка при удалении кондитера');
    }
  };

  const handleCreateEquipment = async (data: any) => {
    try {
      await api.createEquipment(data);
      // refetch equipments
    } catch (err) {
      alert('Ошибка при создании оборудования');
    }
  };

  const handleUpdateEquipment = async (data: any) => {
    if (!editingEquipment) return;
    try {
      await api.updateEquipment(editingEquipment.equipment_id, data);
      // refetch equipments
      setEditingEquipment(null);
    } catch (err) {
      alert('Ошибка при обновлении оборудования');
    }
  };

  const handleDeleteEquipment = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить это оборудование?')) return;
    try {
      await api.deleteEquipment(id);
      // refetch equipments
    } catch (err) {
      alert('Ошибка при удалении оборудования');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Расписание</h1>
        <h2>Кондитер.план</h2>
      </div>
      <div>
        <label>Дата: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={handleRunPlanning}>Запустить планирование</button>
        <div style={{ marginTop: '10px' }}>
          <label>Вид расписания: </label>
          <button 
            onClick={() => setViewMode('equipment')} 
            style={{ fontWeight: viewMode === 'equipment' ? 'bold' : 'normal' }}
          >
            По оборудованию
          </button>
          <button 
            onClick={() => setViewMode('confectioner')} 
            style={{ fontWeight: viewMode === 'confectioner' ? 'bold' : 'normal', marginLeft: '5px' }}
          >
            По кондитерам
          </button>
        </div>
      </div>

      <div className="schedule-grid">
        <table>
          <thead>
            <tr>
              <th>{viewMode === 'equipment' ? 'Оборудование' : 'Кондитер'}</th>
              {hours.map(hour => (
                <th key={hour}>{hour}:00</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {viewMode === 'equipment' ? (
              equipments.map((equipment: Equipment) => (
                <tr key={equipment.equipment_id}>
                  <td>{equipment.equipment_name}</td>
                  {hours.map(hour => {
                    const cellSchedule = getScheduleForCell(equipment.equipment_id, hour);
                    return (
                      <td key={hour} className="schedule-cell">
                        {cellSchedule.map((entry: ScheduleEntry) => (
                          <div key={entry.schedule_entry_id} className="schedule-entry">                          {getOrderRecipeNameAndQuantity(entry.order_id)}
                          <br />
                          {getConfectionerName(entry.confectioner_id)}
                          <br />                            {(() => {
                              const operation = getOperationForEntry(entry.recipe_operation_id);
                              const quantity = getOrderQuantity(entry.order_id);
                              return operation ? `${operation.operation_name} ${operation.product_quantity * quantity} ${operation.unit || 'шт'}` : `Операция ${entry.recipe_operation_id}`;
                            })()}
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              confectioners.map((confectioner: Confectioner) => (
                <tr key={confectioner.confectioner_id}>
                  <td>{confectioner.name}</td>
                  {hours.map(hour => {
                    const cellSchedule = getScheduleForConfectionerCell(confectioner.confectioner_id, hour);
                    return (
                      <td key={hour} className="schedule-cell">
                        {cellSchedule.map((entry: ScheduleEntry) => (
                          <div key={entry.schedule_entry_id} className="schedule-entry">
                            {getOrderRecipeNameAndQuantity(entry.order_id)}
                            <br />
                            {getEquipmentName(entry.equipment_id)}
                            <br />
                            {(() => {
                              const operation = getOperationForEntry(entry.recipe_operation_id);
                              const quantity = getOrderQuantity(entry.order_id);
                              return operation ? `${operation.operation_name} ${operation.product_quantity * quantity} ${operation.unit || 'шт'}` : `Операция ${entry.recipe_operation_id}`;
                            })()}
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="sections">
        <div className="section">
          <h2>Кондитеры</h2>
          <button onClick={() => { setEditingConfectioner(null); setIsConfectionerModalOpen(true); }}>Добавить кондитера</button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Квалификация</th>
                <th>Активен</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {confectioners.map((confectioner: Confectioner) => (
                <tr key={confectioner.confectioner_id}>
                  <td>{confectioner.confectioner_id}</td>
                  <td>{confectioner.name}</td>
                  <td>{confectioner.qualification_id}</td>
                  <td>{confectioner.is_active ? 'Да' : 'Нет'}</td>
                  <td>
                    <button onClick={() => { setEditingConfectioner(confectioner); setIsConfectionerModalOpen(true); }}>Редактировать</button>
                    <button onClick={() => handleDeleteConfectioner(confectioner.confectioner_id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2>Оборудование</h2>
          <button onClick={() => { setEditingEquipment(null); setIsEquipmentModalOpen(true); }}>Добавить оборудование</button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Тип</th>
                <th>Активно</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((equipment: Equipment) => (
                <tr key={equipment.equipment_id}>
                  <td>{equipment.equipment_id}</td>
                  <td>{equipment.equipment_name}</td>
                  <td>{equipment.equipment_type_id}</td>
                  <td>{equipment.is_active ? 'Да' : 'Нет'}</td>
                  <td>
                    <button onClick={() => { setEditingEquipment(equipment); setIsEquipmentModalOpen(true); }}>Редактировать</button>
                    <button onClick={() => handleDeleteEquipment(equipment.equipment_id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfectionerForm
        isOpen={isConfectionerModalOpen}
        onClose={() => { setIsConfectionerModalOpen(false); setEditingConfectioner(null); }}
        onSubmit={editingConfectioner ? handleUpdateConfectioner : handleCreateConfectioner}
        initialData={editingConfectioner}
      />

      <EquipmentForm
        isOpen={isEquipmentModalOpen}
        onClose={() => { setIsEquipmentModalOpen(false); setEditingEquipment(null); }}
        onSubmit={editingEquipment ? handleUpdateEquipment : handleCreateEquipment}
        initialData={editingEquipment}
      />
    </div>
  );
};

export default SchedulePage;