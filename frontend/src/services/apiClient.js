// frontend/src/services/apiClient.js

import axios from 'axios';

// Creamos una instancia de axios con la configuración base
const apiClient = axios.create({
  // Esta es la URL de tu backend
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Más adelante, aquí podremos agregar "interceptors"
  para manejar automáticamente los tokens de autenticación
  en cada petición.
*/

export default apiClient;