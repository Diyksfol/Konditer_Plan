// Утилиты

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU');
};

export const confirmDelete = (message: string): boolean => {
  return window.confirm(message);
};