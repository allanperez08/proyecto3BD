// backend/src/routes/ventaRoutes.js

import express from 'express';
const router = express.Router();
import {
  crearVenta,
  obtenerVentas,
  anularVenta,
} from '../controllers/ventaController.js'; // <- Nota el .js

router.post('/', crearVenta);
router.get('/', obtenerVentas);
router.put('/anular/:id', anularVenta);

export default router; // <- Cambia module.exports