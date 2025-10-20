// frontend/src/components/MainLayout.jsx
import React from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, IconButton
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'; // <-- 1. IMPORTAR ÍCONO CLIENTES

const drawerWidth = 240;

const MainLayout = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  // --- LÓGICA DE MENÚ BASADA EN ROL ---
  const menuItems = [
    { text: 'Inventario', icon: <InventoryIcon />, path: '/inventario' },
    { text: 'Punto de Venta', icon: <PointOfSaleIcon />, path: '/ventas' },
    { text: 'Clientes', icon: <PeopleAltIcon />, path: '/clientes' }, // <-- 2. AÑADIR ENLACE
  ];

  // Añade el menú de Usuarios SÓLO si es Administrador
  if (usuario && usuario.rol === 'Administrador') {
    menuItems.push({ text: 'Usuarios', icon: <PeopleIcon />, path: '/usuarios' });
  }
  // --- FIN DE LÓGICA DE MENÚ ---

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Ferretería Xelajú
          </Typography>
          <Typography sx={{ mr: 2 }}>
            Hola, {usuario?.nombreCompleto || 'Usuario'}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} title="Cerrar Sesión">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> 
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => ( 
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={RouterLink} to={item.path}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar /> 
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;