// API сервис для запросов

import { Order, ScheduleEntry, Ingredient, Inventory, Recipe, RecipeOperation, RecipeIngredient, Confectioner, Qualification, EquipmentType, Equipment } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.request('/orders/');
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    return this.request('/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteOrder(id: number): Promise<void> {
    return this.request(`/orders/${id}`, { method: 'DELETE' });
  }

  // Schedule
  async getSchedule(): Promise<ScheduleEntry[]> {
    return this.request('/schedule/');
  }

  async createSchedule(data: Partial<ScheduleEntry>): Promise<ScheduleEntry> {
    return this.request('/schedule/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateSchedule(id: number, data: Partial<ScheduleEntry>): Promise<ScheduleEntry> {
    return this.request(`/schedule/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteSchedule(id: number): Promise<void> {
    return this.request(`/schedule/${id}`, { method: 'DELETE' });
  }

  // Planning
  async runPlanning(orderId?: number): Promise<any> {
    return this.request('/planning/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
    });
  }

  // Ingredients
  async getIngredients(): Promise<Ingredient[]> {
    return this.request('/ingredients/');
  }

  async createIngredient(data: Partial<Ingredient>): Promise<Ingredient> {
    return this.request('/ingredients/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateIngredient(id: number, data: Partial<Ingredient>): Promise<Ingredient> {
    return this.request(`/ingredients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteIngredient(id: number): Promise<void> {
    return this.request(`/ingredients/${id}`, { method: 'DELETE' });
  }

  // Inventories
  async getInventories(): Promise<Inventory[]> {
    return this.request('/inventories/');
  }

  async createInventory(data: Partial<Inventory>): Promise<Inventory> {
    return this.request('/inventories/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateInventory(id: number, data: Partial<Inventory>): Promise<Inventory> {
    return this.request(`/inventories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteInventory(id: number): Promise<void> {
    return this.request(`/inventories/${id}`, { method: 'DELETE' });
  }

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    return this.request('/recipes/');
  }

  async createRecipe(data: Partial<Recipe>): Promise<Recipe> {
    return this.request('/recipes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateRecipe(id: number, data: Partial<Recipe>): Promise<Recipe> {
    return this.request(`/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteRecipe(id: number): Promise<void> {
    return this.request(`/recipes/${id}`, { method: 'DELETE' });
  }

  // Recipe Operations
  async getRecipeOperations(): Promise<RecipeOperation[]> {
    return this.request('/recipe-operations/');
  }

  async createRecipeOperation(data: Partial<RecipeOperation>): Promise<RecipeOperation> {
    return this.request('/recipe-operations/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateRecipeOperation(id: number, data: Partial<RecipeOperation>): Promise<RecipeOperation> {
    return this.request(`/recipe-operations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteRecipeOperation(id: number): Promise<void> {
    return this.request(`/recipe-operations/${id}`, { method: 'DELETE' });
  }

  // Recipe Ingredients
  async getRecipeIngredients(): Promise<RecipeIngredient[]> {
    return this.request('/recipe-ingredients/');
  }

  async createRecipeIngredient(data: Partial<RecipeIngredient>): Promise<RecipeIngredient> {
    return this.request('/recipe-ingredients/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateRecipeIngredient(id: number, data: Partial<RecipeIngredient>): Promise<RecipeIngredient> {
    return this.request(`/recipe-ingredients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteRecipeIngredient(id: number): Promise<void> {
    return this.request(`/recipe-ingredients/${id}`, { method: 'DELETE' });
  }

  // Confectioners
  async getConfectioners(): Promise<Confectioner[]> {
    return this.request('/confectioners/');
  }

  async createConfectioner(data: Partial<Confectioner>): Promise<Confectioner> {
    return this.request('/confectioners/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateConfectioner(id: number, data: Partial<Confectioner>): Promise<Confectioner> {
    return this.request(`/confectioners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteConfectioner(id: number): Promise<void> {
    return this.request(`/confectioners/${id}`, { method: 'DELETE' });
  }

  // Qualifications
  async getQualifications(): Promise<Qualification[]> {
    return this.request('/qualifications/');
  }

  async createQualification(data: Partial<Qualification>): Promise<Qualification> {
    return this.request('/qualifications/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateQualification(id: number, data: Partial<Qualification>): Promise<Qualification> {
    return this.request(`/qualifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteQualification(id: number): Promise<void> {
    return this.request(`/qualifications/${id}`, { method: 'DELETE' });
  }

  // Equipment Types
  async getEquipmentTypes(): Promise<EquipmentType[]> {
    return this.request('/equipment-types/');
  }

  async createEquipmentType(data: Partial<EquipmentType>): Promise<EquipmentType> {
    return this.request('/equipment-types/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateEquipmentType(id: number, data: Partial<EquipmentType>): Promise<EquipmentType> {
    return this.request(`/equipment-types/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteEquipmentType(id: number): Promise<void> {
    return this.request(`/equipment-types/${id}`, { method: 'DELETE' });
  }

  // Equipment
  async getEquipment(): Promise<Equipment[]> {
    return this.request('/equipments/');
  }

  async createEquipment(data: Partial<Equipment>): Promise<Equipment> {
    return this.request('/equipments/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async updateEquipment(id: number, data: Partial<Equipment>): Promise<Equipment> {
    return this.request(`/equipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteEquipment(id: number): Promise<void> {
    return this.request(`/equipments/${id}`, { method: 'DELETE' });
  }
}

const api = new ApiService();
export default api;