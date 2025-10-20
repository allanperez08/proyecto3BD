// backend/src/models/Pago.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const PagoSchema = new Schema({
  fechaPago: {
    type: Date,
    default: Date.now,
  },
  monto: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
  },
  metodoDePago: {
    type: String,
    required: true,
    enum: ['Efectivo', 'Tarjeta', 'Transferencia', 'Depósito Bancario'],
  },
  referencia: { // Para No. de Boleta, Transferencia, etc.
    type: String,
    trim: true,
    default: 'N/A',
  },
  clienteId: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  vendedorId: { // Quién registró el pago
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  // Desnormalizamos para reportes
  clienteNombre: { type: String }, 
  vendedorNombre: { type: String },
});

const Pago = mongoose.model('Pago', PagoSchema);
export default Pago;