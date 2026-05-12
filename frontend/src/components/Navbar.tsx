import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIngredients } from '../hooks/useIngredients';
import { useInventories } from '../hooks/useInventories';

const Navbar: React.FC = () => {
  const { ingredients } = useIngredients();
  const { inventories } = useInventories();
  const [hasLowStock, setHasLowStock] = useState(false);

  useEffect(() => {
    // Check if any ingredient has low stock
    const lowStockExists = ingredients.some((ingredient: any) => {
      const inventory = inventories.find((inv: any) => inv.ingredient_id === ingredient.ingredient_id);
      return inventory && inventory.current_quantity <= inventory.min_stock;
    });
    setHasLowStock(lowStockExists);
  }, [ingredients, inventories]);

  return (
    <nav>
      <div className="navbar-left">
        <ul>
          <li><Link to="/orders">Заказы</Link></li>
          <li><Link to="/schedule">Расписание</Link></li>
          <li><Link to="/inventory" style={{ color: hasLowStock ? '#dc3545' : '#007bff', fontWeight: hasLowStock ? 'bold' : 'normal' }}>Склад</Link></li>
          <li><Link to="/recipes">Рецептуры</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <span className="navbar-title">Кондитер.план</span>
      </div>
    </nav>
  );
};

export default Navbar;