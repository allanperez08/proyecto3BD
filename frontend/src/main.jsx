// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Importaciones de Material-UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';

// 1. Definimos nuestro tema con la sintaxis de MUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A6FA5', // Nuestro azul acero
    },
    secondary: {
      main: '#E6AF2E', // Nuestro naranja
    },
    background: {
      default: '#F4F4F8', // Nuestro fondo claro
    },
    text: {
      primary: '#232323', // Nuestro texto oscuro
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Usamos el ThemeProvider de MUI */}
    <ThemeProvider theme={theme}>
      {/* 3. CssBaseline es como un "reset.css" que normaliza los estilos */}
      <CssBaseline /> 
      <BrowserRouter>
        <AuthProvider> {/* <-- ENVUELVE TU APP --> */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);