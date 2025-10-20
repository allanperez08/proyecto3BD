// backend/src/routes/productoRoutes.js

import express from 'express';
const router = express.Router();
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} from '../controllers/productoController.js'; // <- Nota el .js

router.route('/')
  .post(crearProducto)
  .get(obtenerProductos);

router.route('/:id')
  .get(obtenerProductoPorId)
  .put(actualizarProducto)
  .delete(eliminarProducto);

export default router; // <- Cambia module.exports