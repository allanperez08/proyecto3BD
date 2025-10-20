// backend/src/models/Producto.js

const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'El SKU es obligatorio'],
    unique: true,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  cantidadEnStock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'La cantidad no puede ser negativa'],
  },
  precio: {
    compra: { type: Number, required: true },
    venta: { type: Number, required: true },
  },
  categoria: {
    type: String,
    required: true,
    trim: true,
  },
  proveedor: {
    nombre: { type: String, trim: true },
    contacto: { type: String, trim: true },
    telefono: { type: String, trim: true },
  },
  ubicacion: {
    pasillo: String,
    estante: String,
    seccion: String,
  },
  
  especificaciones: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  fechaAgregado: {
    type: Date,
    default: Date.now,
  },
  ultimaActualizacion: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar la fecha de 'ultimaActualizacion' antes de guardar
ProductoSchema.pre('save', function (next) {
  this.ultimaActualizacion = Date.now();
  next();
});

const Producto = mongoose.model('Producto', ProductoSchema);
module.exports = Producto;