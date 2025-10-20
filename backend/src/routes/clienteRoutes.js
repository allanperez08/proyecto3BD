// backend/src/routes/clienteRoutes.js
import express from 'express';
const router = express.Router();
import {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
} from '../controllers/clienteController.js';

// Rutas CRUD completas
router.route('/')
  .post(crearCliente)
  .get(obtenerClientes);

router.route('/:id')
  .get(obtenerClientePorId)
  .put(actualizarCliente)
  .delete(eliminarCliente);

export default router;