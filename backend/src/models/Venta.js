// backend/src/models/Venta.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const VentaSchema = new Schema({
  fechaVenta: { type: Date, default: Date.now },
  vendedor: {
    usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    nombre: { type: String, required: true },
  },
  clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
  clienteNombre: { type: String, required: true },
  clienteNit: { type: String, required: true },
  items: [
    {
      productoId: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
      sku: { type: String, required: true },
      nombre: { type: String, required: true },
      cantidadVendida: { type: Number, required: true, min: 1 },
      precioAlVender: { type: Number, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  descuento: { type: Number, required: true, default: 0 },
  totalVenta: { type: Number, required: true },
  tipoDePago: { type: String, required: true, enum: ['Contado', 'Credito'] },
  metodoDePago: { type: String, required: true, enum: ['Efectivo', 'Tarjeta', 'Transferencia', 'N/A'] },
  
  // --- CAMPOS MODIFICADOS ---
  estadoPago: {
    type: String,
    required: true,
    enum: ['Pagada', 'Pendiente', 'Abonada Parcialmente', 'Anulada'], // Más estados
  },
  montoPagado: { type: Number, required: true, default: 0 },
  montoPendiente: { // ¡NUEVO CAMPO CLAVE!
    type: Number,
    required: true,
    default: 0,
  }
  // --- FIN DE CAMBIOS ---
});

const Venta = mongoose.model('Venta', VentaSchema);
export default Venta;