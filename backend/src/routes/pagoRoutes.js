// backend/src/routes/pagoRoutes.js
import express from 'express';
const router = express.Router();
import {
  crearPago,
  obtenerPagos,
  obtenerPagosPorCliente,
} from '../controllers/pagoController.js';

// Crear un nuevo pago (abono)
router.post('/', crearPago);

// Obtener todos los pagos (para un reporte general)
router.get('/', obtenerPagos);

// Obtener todos los pagos de un cliente
router.get('/cliente/:clienteId', obtenerPagosPorCliente);

export default router;