// backend/src/controllers/usuarioController.js
import Usuario from '../models/Usuario.js';
import asyncHandler from 'express-async-handler';
import generarToken from '../utils/generarToken.js';

// ... (crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario, autenticarUsuario... quedan igual)

const crearUsuario = async (req, res) => {
  try {
    const { nombreCompleto, username, password, rol } = req.body;
    const nuevoUsuario = new Usuario({ nombreCompleto, username, password, rol });
    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario creado exitosamente', usuario: nuevoUsuario });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensaje = Object.values(error.errors).map(val => val.message)[0];
      return res.status(400).json({ message: mensaje });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe. Por favor, elija otro.' });
    }
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear el usuario' });
  }
};
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCompleto, username, rol, activo } = req.body;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id, { nombreCompleto, username, rol, activo }, { new: true, runValidators: true }
    ).select('-password');
    if (!usuarioActualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario actualizado exitosamente', usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);
    if (!usuarioEliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};
const autenticarUsuario = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const usuario = await Usuario.findOne({ username });
  if (usuario && (await usuario.matchPassword(password))) {
    res.json({
      _id: usuario._id, nombreCompleto: usuario.nombreCompleto,
      username: usuario.username, rol: usuario.rol,
      token: generarToken(usuario._id),
    });
  } else {
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }
});


// --- 1. NUEVA FUNCIÓN DE RESETEO ---
const resetearPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Validación simple en el backend también
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Asignamos la nueva contraseña. El hook 'pre.save' del Modelo se encargará de hashearla
    usuario.password = password;
    await usuario.save();

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error("Error al resetear password:", error);
    res.status(500).json({ message: 'Error al resetear la contraseña', error: error.message });
  }
};
// ------------------------------------

export {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  autenticarUsuario,
  resetearPassword, // <-- 2. EXPORTAR LA NUEVA FUNCIÓN
};