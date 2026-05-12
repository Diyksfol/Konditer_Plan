import React, { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { useEquipments } from '../hooks/useEquipments';
import { useConfectioners } from '../hooks/useConfectioners';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeOperations } from '../hooks/useRecipeOperations';
import { useOrders } from '../hooks/useOrders';
import api, { getErrorMessage } from '../services/api';
import ConfectionerForm from '../components/ConfectionerForm';
import EquipmentForm from '../components/EquipmentForm';
import { confirmDelete } from '../utils/helpers';
import { ScheduleEntry, Equipment, Confectioner, Recipe, RecipeOperation, Order } from '../types';

const SchedulePage: React.FC = () => {
  const { schedule, loading, error, refetch } = useSchedule();
  const { equipments, refetch: refetchEquipments } = useEquipments();
  const { confectioners, refetch: refetchConfectioners } = useConfectioners();
  const { recipes } = useRecipes();
  const { recipeOperations } = useRecipeOperations();
  const { orders } = useOrders();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isConfectionerModalOpen, setIsConfectionerModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [editingConfectioner, setEditingConfectioner] = useState<Confectioner | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [viewMode, setViewMode] = useState<'equipment' | 'confectioner'>('equipment');
  const [zoomLevel, setZoomLevel] = useState(1);

  const DAY_START_HOUR = 9;
  const DAY_END_HOUR = 18;
  const DAY_DURATION_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60;
  const timelineLabels = Array.from({ length: (DAY_END_HOUR - DAY_START_HOUR) * 12 + 1 }, (_, i) => {
    const hour = DAY_START_HOUR + Math.floor(i / 12);
    const minute = (i % 12) * 5;
    return `${hour}:${minute.toString().padStart(2, '0')}`;
  });
  const filteredLabels = zoomLevel < 1 ? timelineLabels.filter((_, i) => i % 6 === 0) : timelineLabels;
  const timelineGridWidth = filteredLabels.length * 20 * zoomLevel;
  const timelineContainerMinWidth = 220 + timelineGridWidth;

  const getMinutesFromMidnight = (date: Date) => date.getHours() * 60 + date.getMinutes();

  const getBlockGridPosition = (entry: ScheduleEntry) => {
    const start = new Date(entry.start_time);
    const end = new Date(entry.end_time);
    const minutesFromStart = getMinutesFromMidnight(start) - DAY_START_HOUR * 60;
    const startIndex = zoomLevel < 1 
      ? Math.round(minutesFromStart / 30) + 1 
      : Math.round(minutesFromStart / 5) + 1;
    const durationMinutes = Math.max(5, getMinutesFromMidnight(end) - getMinutesFromMidnight(start));
    const span = zoomLevel < 1 
      ? Math.max(1, Math.round(durationMinutes / 30)) 
      : Math.max(1, Math.round(durationMinutes / 5));
    return {
      gridColumn: `${startIndex} / span ${span}`,
    };
  };

  const getScheduleEntriesForRow = (rowId: number) => {
    return schedule
      .filter((entry: ScheduleEntry) => {
        const entryDate = new Date(entry.start_time).toISOString().split('T')[0];
        if (entryDate !== selectedDate) return false;
        return viewMode === 'equipment'
          ? entry.equipment_id === rowId
          : entry.confectioner_id === rowId;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  const getBlockStyle = (entry: ScheduleEntry) => {
    const start = new Date(entry.start_time);
    const end = new Date(entry.end_time);
    const startMinutes = getMinutesFromMidnight(start);
    const endMinutes = getMinutesFromMidnight(end);
    const left = ((startMinutes - DAY_START_HOUR * 60) / DAY_DURATION_MINUTES) * 100;
    const width = ((endMinutes - startMinutes) / DAY_DURATION_MINUTES) * 100 * zoomLevel;
    const clampedLeft = Math.max(0, left);
    const clampedWidth = Math.max(0, Math.min(100 * zoomLevel - clampedLeft, width));
    return {
      left: `${clampedLeft}%`,
      width: `${clampedWidth}%`,
    };
  };

  const getBlockInfo = (entry: ScheduleEntry) => {
    const operation = getOperationForEntry(entry.recipe_operation_id);
    const quantity = getOrderQuantity(entry.order_id);
    const resource = viewMode === 'equipment'
      ? entry.confectioner_id ? getConfectionerName(entry.confectioner_id) : ''
      : entry.equipment_id ? getEquipmentName(entry.equipment_id) : '';

    return {
      title: getOrderRecipeNameAndQuantity(entry.order_id),
      resource,
      detail: operation
        ? `${operation.operation_name} ${operation.product_quantity * quantity} ${operation.unit || 'шт'}`
        : `Операция ${entry.recipe_operation_id}`,
    };
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
      alert(`Ошибка при планировании: ${getErrorMessage(err)}`);
    }
  };

  const handleUpdateStatuses = async () => {
    try {
      await api.updateOrderStatuses();
      refetch();
      alert('Статусы обновлены');
    } catch (err: any) {
      alert(`Ошибка при обновлении статусов: ${getErrorMessage(err)}`);
    }
  };

  const handleCreateConfectioner = async (data: any) => {
    try {
      await api.createConfectioner(data);
      refetchConfectioners();
    } catch (err) {
      alert(`Ошибка при создании кондитера: ${getErrorMessage(err)}`);
    }
  };

  const handleUpdateConfectioner = async (data: any) => {
    if (!editingConfectioner) return;
    try {
      await api.updateConfectioner(editingConfectioner.confectioner_id, data);
      refetchConfectioners();
      setEditingConfectioner(null);
    } catch (err) {
      alert(`Ошибка при обновлении кондитера: ${getErrorMessage(err)}`);
    }
  };

  const handleDeleteConfectioner = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить этого кондитера?')) return;
    try {
      await api.deleteConfectioner(id);
      refetchConfectioners();
    } catch (err) {
      alert(`Ошибка при удалении кондитера: ${getErrorMessage(err)}`);
    }
  };

  const handleCreateEquipment = async (data: any) => {
    try {
      await api.createEquipment(data);
      refetchEquipments();
    } catch (err) {
      alert(`Ошибка при создании оборудования: ${getErrorMessage(err)}`);
    }
  };

  const handleUpdateEquipment = async (data: any) => {
    if (!editingEquipment) return;
    try {
      await api.updateEquipment(editingEquipment.equipment_id, data);
      refetchEquipments();
      setEditingEquipment(null);
    } catch (err) {
      alert(`Ошибка при обновлении оборудования: ${getErrorMessage(err)}`);
    }
  };

  const handleDeleteEquipment = async (id: number) => {
    if (!confirmDelete('Вы уверены, что хотите удалить это оборудование?')) return;
    try {
      await api.deleteEquipment(id);
      refetchEquipments();
    } catch (err) {
      alert(`Ошибка при удалении оборудования: ${getErrorMessage(err)}`);
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
        <button onClick={handleUpdateStatuses}>Обновить статусы</button>
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
          <div style={{ marginTop: '10px' }}>
            <label>Масштаб: </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              style={{ marginLeft: '5px' }}
            />
            <span style={{ marginLeft: '5px' }}>{zoomLevel.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      <div className="schedule-timeline">
        <div className="timeline-container" style={{ minWidth: `${timelineContainerMinWidth}px` }}>
          <div className="timeline-header">
            <div className="timeline-row-label">{viewMode === 'equipment' ? 'Оборудование' : 'Кондитер'}</div>
            <div className="timeline-header-track" style={{ gridTemplateColumns: `repeat(${filteredLabels.length}, ${20 * zoomLevel}px)` }}>
              {timelineLabels.map(label => (
                <div key={label} className="timeline-time-label">{label}</div>
              ))}
            </div>
          </div>
          <div className="timeline-rows">
            {(viewMode === 'equipment' ? equipments : confectioners).map((row: Equipment | Confectioner) => {
              const rowId = viewMode === 'equipment'
                ? (row as Equipment).equipment_id
                : (row as Confectioner).confectioner_id;
              const rowLabel = viewMode === 'equipment'
                ? (row as Equipment).equipment_name
                : (row as Confectioner).name;
              const rowEntries = getScheduleEntriesForRow(rowId);

              return (
                <div key={rowId} className="timeline-row">
                  <div className="timeline-row-label">{rowLabel}</div>
                  <div className="timeline-row-track" style={{ gridTemplateColumns: `repeat(${filteredLabels.length}, ${20 * zoomLevel}px)` }}>
                    {rowEntries.map((entry: ScheduleEntry) => {
                      const blockInfo = getBlockInfo(entry);
                      return (
                        <div key={entry.schedule_entry_id} className="timeline-block" style={getBlockGridPosition(entry)}>
                          <div className="block-title">{blockInfo.title}</div>
                          {blockInfo.resource && <div className="block-subtitle">{blockInfo.resource}</div>}
                          <div className="block-detail">{blockInfo.detail}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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