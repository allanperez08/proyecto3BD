
import express from 'express';
const router = express.Router();
import {
  crearVenta,
  obtenerVentas,
  anularVenta,
} from '../controllers/ventaController.js'; 

router.post('/', crearVenta);
router.get('/', obtenerVentas);
router.put('/anular/:id', anularVenta);

export default router; 