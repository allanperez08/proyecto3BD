// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout'; // <-- IMPORTA EL LAYOUT

// Importamos las páginas
import LoginPage from './pages/LoginPage';
import InventarioPage from './pages/InventarioPage';
import VentasPage from './pages/VentasPage';
import UsuariosPage from './pages/UsuariosPage';
import ClientesPage from './pages/ClientesPage'; 

function App() {
  return (
    <Routes>
      {/* Ruta de Login (página completa, sin layout) */}
      <Route path="/" element={<LoginPage />} />

      {/* Rutas protegidas (que usan el MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
      </Route>
    </Routes>
  );
}

export default App;