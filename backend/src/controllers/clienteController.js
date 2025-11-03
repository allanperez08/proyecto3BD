
import Cliente from '../models/Cliente.js';

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json({ message: 'Cliente creado exitosamente', cliente: nuevoCliente });
  } catch (error) {
    // Manejo de errores (NIT duplicado o campos faltantes)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El NIT ingresado ya existe' });
    }
    if (error.name === 'ValidationError') {
      const mensaje = Object.values(error.errors).map(val => val.message)[0];
      return res.status(400).json({ message: mensaje });
    }
    res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
  }
};

// Mostrar todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ nombreCompleto: 1 }); 
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
  }
};


const obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
  }
};

// Actualizar un cliente
const actualizarCliente = async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!clienteActualizado) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.status(200).json({ message: 'Cliente actualizado', cliente: clienteActualizado });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El NIT ingresado ya existe' });
    }
    res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
  }
};

// Eliminar un cliente
const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

    if (cliente.saldoActual > 0) {
      return res.status(400).json({ message: 'No se puede eliminar un cliente con saldo pendiente' });
    }

    await Cliente.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
  }
};

export {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
};