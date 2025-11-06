// backend/src/models/Cliente.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ClienteSchema = new Schema({
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
    default: 0,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  
  pagos: [   // Incrustacion de pagos realizados por el cliente
    {
      fechaPago: {
        type: Date,
        default: Date.now,
      },
      monto: {
        type: Number,
        required: true,
      },
      metodoDePago: {
        type: String,
        required: true,
        enum: ['Efectivo', 'Tarjeta', 'Transferencia', 'Depósito Bancario'],
      },
      referencia: {
        type: String,
        trim: true,
        default: 'N/A',
      },
      vendedorId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
      },
      vendedorNombre: { type: String },
    }
  ]
});

const Cliente = mongoose.model('Cliente', ClienteSchema);
export default Cliente;