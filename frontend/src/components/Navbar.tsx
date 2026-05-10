import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/orders">Заказы</Link></li>
        <li><Link to="/schedule">Расписание</Link></li>
        <li><Link to="/inventory">Склад</Link></li>
        <li><Link to="/recipes">Рецептуры</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;