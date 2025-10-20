// backend/server.js

import express from 'express';
import 'dotenv/config'; // Reemplaza a require('dotenv').config()
import cors from 'cors';
import connectDB from './src/config/database.js'; 

// Importar rutas
import usuarioRoutes from './src/routes/usuarioRoutes.js'; 
import productoRoutes from './src/routes/productoRoutes.js'; 
import ventaRoutes from './src/routes/ventaRoutes.js'; 
import clienteRoutes from './src/routes/clienteRoutes.js';
import pagoRoutes from './src/routes/pagoRoutes.js';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡API de Ferretería Maestra funcionando!');
});

// Usar las rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pagos', pagoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});