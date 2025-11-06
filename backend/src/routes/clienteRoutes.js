
import express from 'express';
const router = express.Router();
import {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
  registrarAbonoCliente
} from '../controllers/clienteController.js';

// Rutas CRUD completas
router.route('/')
  .post(crearCliente)
  .get(obtenerClientes);

router.route('/:id')
  .get(obtenerClientePorId)
  .put(actualizarCliente)
  .delete(eliminarCliente);

router.post('/:id/abono', registrarAbonoCliente);

export default router;