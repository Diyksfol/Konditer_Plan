// Типы для API ответов

export interface Order {
  order_id: number;
  recipe_id: number;
  quantity: number;
  delivery_date: string;
  status: string;
  created_at: string;
}

export interface ScheduleEntry {
  schedule_entry_id: number;
  order_id: number;
  recipe_operation_id: number;
  start_time: string;
  end_time: string;
  equipment_id: number;
  confectioner_id: number;
  status: string;
}

export interface Ingredient {
  ingredient_id: number;
  name: string;
  unit: string;
  current_quantity: number;
  min_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  inventory_id: number;
  ingredient_id: number;
  unit: string;
  current_quantity: number;
  min_stock: number;
  last_check: string;
}

export interface Recipe {
  recipe_id: number;
  name: string;
  shelf_life_days: number;
}

export interface RecipeOperation {
  recipe_operation_id: number;
  recipe_id: number;
  sequence_number: number;
  duration_minutes: number;
  equipment_type_id: number;
  required_qualification_id: number;
  operation_name: string;
  product_quantity: number;
}

export interface RecipeIngredient {
  recipe_ingredient_id: number;
  recipe_id: number;
  ingredient_id: number;
  quantity_per_unit: number;
}

export interface Confectioner {
  confectioner_id: number;
  name: string;
  qualification_id: number;
  is_active: boolean;
}

export interface Qualification {
  qualification_id: number;
  name: string;
}

export interface EquipmentType {
  equipment_type_id: number;
  name: string;
}

export interface Equipment {
  equipment_id: number;
  equipment_name: string;
  equipment_type_id: number;
  is_active: boolean;
}