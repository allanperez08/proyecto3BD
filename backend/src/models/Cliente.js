// backend/src/models/Cliente.js
import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  nit: {
    type: String,
    required: [true, 'El NIT es obligatorio'],
    trim: true,
    unique: true, 
  },
  telefono: {
    type: String,
    trim: true,
    default: '',
  },
  direccion: {
    type: String,
    trim: true,
    default: '',
  },
  limiteDeCredito: {
    type: Number,
    required: true,
    default: 0, 
  },
  saldoActual: {
    type: Number,
    required: true,
    default: 0, // Todos los clientes empiezan con saldo 0
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

const Cliente = mongoose.model('Cliente', ClienteSchema);
export default Cliente;