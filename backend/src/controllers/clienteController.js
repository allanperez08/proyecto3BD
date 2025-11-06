
import Cliente from '../models/Cliente.js';
import Venta from '../models/Venta.js';
import mongoose from 'mongoose';

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

// Registrar un abono de cliente
const registrarAbonoCliente = async (req, res) => {
  const { monto, metodoDePago, referencia, fechaPago, vendedorId, vendedorNombre } = req.body;
  const clienteId = req.params.id; // El ID del cliente viene de la URL

  const montoNum = parseFloat(monto);
  if (!montoNum || montoNum <= 0) {
    console.error(`--- ¡ERROR DE VALIDACIÓN DE ABONO! Monto recibido: ${monto} ---`);
    return res.status(400).json({ message: 'El monto debe ser mayor a cero' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cliente = await Cliente.findById(clienteId).session(session);
    if (!cliente) throw new Error('Cliente no encontrado');
    if (montoNum > cliente.saldoActual) {
      throw new Error(`El monto (Q${montoNum.toFixed(2)}) es mayor al saldo pendiente (Q${cliente.saldoActual.toFixed(2)})`);
    }

    // 1. Crear el *objeto* de pago (no un documento)
    const nuevoPagoObjeto = {
      monto: montoNum,
      metodoDePago,
      referencia,
      fechaPago: fechaPago || new Date(),
      vendedorId,
      vendedorNombre,
    };

    // 2. Lógica de Conciliación FIFO (igual que antes)
    const facturasPendientes = await Venta.find({
      clienteId: clienteId,
      estadoPago: { $in: ['Pendiente', 'Abonada Parcialmente'] }
    }).sort({ fechaVenta: 1 }).session(session);

    let montoRestanteDelPago = montoNum;
    for (const factura of facturasPendientes) {
      if (montoRestanteDelPago <= 0) break;
      const montoAPagarEnFactura = Math.min(factura.montoPendiente, montoRestanteDelPago);
      
      factura.montoPendiente -= montoAPagarEnFactura;
      factura.montoPagado += montoAPagarEnFactura;
      montoRestanteDelPago -= montoAPagarEnFactura;

      if (factura.montoPendiente <= 0.01) {
        factura.montoPendiente = 0;
        factura.estadoPago = 'Pagada';
      } else {
        factura.estadoPago = 'Abonada Parcialmente';
      }
      await factura.save({ session });
    }

    // 3. Actualizar el cliente
    cliente.saldoActual -= montoNum; // Restamos el saldo
    cliente.pagos.push(nuevoPagoObjeto); // ¡Incrustamos el pago en el array!
    
    await cliente.save({ session });

    // 4. Confirmar la transacción
    await session.commitTransaction();
    res.status(201).json({ message: 'Pago registrado y aplicado exitosamente', cliente });

  } catch (error) {
    await session.abortTransaction();
    console.error('--- ¡ERROR EN TRANSACCIÓN DE PAGO (EMBEDDED)! ---');
    console.error(error);
    res.status(400).json({ message: error.message || 'Error al registrar el pago' });
  } finally {
    session.endSession();
  }
};

export {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
  registrarAbonoCliente
};