import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import OrdersPage from './pages/OrdersPage';
import SchedulePage from './pages/SchedulePage';
import InventoryPage from './pages/InventoryPage';
import RecipesPage from './pages/RecipesPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/" element={<OrdersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;