import express from 'express';
const router = express.Router();
import {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  autenticarUsuario,
  resetearPassword, 
} from '../controllers/usuarioController.js';

router.route('/').post(crearUsuario).get(obtenerUsuarios);
router.route('/:id').put(actualizarUsuario).delete(eliminarUsuario);
router.post('/login', autenticarUsuario);


router.put('/:id/set-password', resetearPassword);


export default router;