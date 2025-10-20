// backend/src/controllers/productoController.js

import Producto from '../models/Producto.js';

// @desc    Crear un nuevo producto
// @route   POST /api/productos
const crearProducto = async (req, res) => { // <-- CAMBIO AQUÍ
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json({ message: 'Producto agregado exitosamente', producto: nuevoProducto });
  } catch (error) {
    // --- LÍNEAS DE DEPURACIÓN AÑADIDAS ---
    console.error('--- ¡ERROR AL CREAR PRODUCTO! ---');
    console.error(error);
    // ------------------------------------
    
    res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
  }
};

// @desc    Obtener todos los productos
// @route   GET /api/productos
const obtenerProductos = async (req, res) => { // <-- CAMBIO AQUÍ
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

// @desc    Obtener un producto por su ID
// @route   GET /api/productos/:id
const obtenerProductoPorId = async (req, res) => { // <-- CAMBIO AQUÍ
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/productos/:id
const actualizarProducto = async (req, res) => { // <-- CAMBIO AQUÍ
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ultimaActualizacion: Date.now() },
      { new: true, runValidators: true }
    );
    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto actualizado exitosamente', producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/productos/:id
const eliminarProducto = async (req, res) => { // <-- CAMBIO AQUÍ
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};

export {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
};