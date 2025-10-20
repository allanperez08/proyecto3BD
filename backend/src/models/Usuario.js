// backend/src/models/Usuario.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // <-- AÑADIDO

const UsuarioSchema = new mongoose.Schema({
  // ... (todos tus campos: nombreCompleto, username, etc. quedan igual)
  nombreCompleto: {
    type: String,
    required: [true, 'El nombre completo es obligatorio'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
  rol: {
    type: String,
    required: true,
    enum: ['Administrador', 'Vendedor'],
    default: 'Vendedor',
  },
  activo: {
    type: Boolean,
    default: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para hashear la contraseña ANTES de guardarla
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- AÑADIDO: MÉTODO PARA COMPARAR CONTRASEÑAS ---
UsuarioSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// -------------------------------------------------

const Usuario = mongoose.model('Usuario', UsuarioSchema);
export default Usuario;