import Venta from '../models/Venta.js';
import Producto from '../models/Producto.js';
import Cliente from '../models/Cliente.js'; 
import mongoose from 'mongoose';

// Crear una nueva venta 
const crearVenta = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, clienteId, tipoDePago, metodoDePago, subtotal, descuento, totalVenta } = req.body;
    const vendedor = req.body.vendedor;

    if (!items || items.length === 0) throw new Error('No hay items en la venta');
    if (!clienteId) throw new Error('No se ha seleccionado un cliente');
    if (!vendedor) throw new Error('No se ha identificado al vendedor');

    const cliente = await Cliente.findById(clienteId).session(session);
    if (!cliente) throw new Error('Cliente no encontrado');

    let estadoPago = 'Pagada';
    let metodoPagoFinal = metodoDePago;
    let montoPendiente = 0;  // esto lo deje por defecto en 0

    // VEntas a credicto

    if (tipoDePago === 'Credito') {
      const nuevoSaldo = cliente.saldoActual + totalVenta;
      if (nuevoSaldo > cliente.limiteDeCredito) {
        throw new Error(`Límite de crédito excedido. Límite: Q${cliente.limiteDeCredito}, Saldo: Q${cliente.saldoActual}`);
      }
      cliente.saldoActual = nuevoSaldo;
      await cliente.save({ session });
      
      estadoPago = 'Pendiente';
      metodoPagoFinal = 'N/A';
      montoPendiente = totalVenta; // definir el monto pendiente de pago del cliente
    }

    // Stock de productos
    const actualizacionesStock = [];
    for (const item of items) {
      const producto = await Producto.findById(item.productoId).session(session);
      if (!producto) throw new Error(`Producto no encontrado: ${item.nombre}`);
      if (producto.cantidadEnStock < item.cantidadVendida) {
        throw new Error(`Stock insuficiente para: ${producto.nombre}`);
      }
      actualizacionesStock.push({
        updateOne: { filter: { _id: item.productoId }, update: { $inc: { cantidadEnStock: -item.cantidadVendida } } },
      });
    }
    await Producto.bulkWrite(actualizacionesStock, { session });

    // 5. Crear y Guardar la Venta
    const nuevaVenta = new Venta({
      fechaVenta: new Date(),
      vendedor,
      clienteId,
      clienteNombre: cliente.nombreCompleto,
      clienteNit: cliente.nit,
      items,
      subtotal,
      descuento,
      totalVenta,
      tipoDePago,
      metodoDePago: metodoPagoFinal,
      estadoPago: estadoPago,
      montoPagado: (tipoDePago === 'Contado' ? totalVenta : 0),
      montoPendiente: montoPendiente, // SE GUARDA EN LA BD
    });

    await nuevaVenta.save({ session });

    await session.commitTransaction();
    res.status(201).json({ message: 'Venta registrada exitosamente', venta: nuevaVenta });

  } catch (error) {
    await session.abortTransaction();
    console.error('--- ¡ERROR EN TRANSACCIÓN DE VENTA! ---');
    console.error(error);
    res.status(400).json({ message: error.message || 'Error al registrar la venta' });
  } finally {
    session.endSession();
  }
};

// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ fechaVenta: -1 });
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ventas', error: error.message });
  }
};

// Anular venta
const anularVenta = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const venta = await Venta.findById(id).session(session);

    if (!venta) throw new Error('Venta no encontrada');
    if (venta.estado === 'Anulada') throw new Error('Esta venta ya ha sido anulada');

    const devolucionStock = venta.items.map(item => ({
      updateOne: { filter: { _id: item.productoId }, update: { $inc: { cantidadEnStock: +item.cantidadVendida } } },
    }));
    await Producto.bulkWrite(devolucionStock, { session });


    if (venta.montoPendiente > 0) {
      await Cliente.findByIdAndUpdate(
        venta.clienteId,
        { $inc: { saldoActual: -venta.montoPendiente } },
        { session }
      );
    }

    // Estado de venta, esto se refiere a que si estaba pagada o pendiente, se anula
    venta.estado = 'Anulada';
    venta.estadoPago = 'Anulada';
    venta.montoPendiente = 0; 
    await venta.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: 'Venta anulada exitosamente', venta });
  } catch (error) {
    await session.abortTransaction();
    console.error('--- ¡ERROR AL ANULAR VENTA! ---');
    console.error(error);
    res.status(400).json({ message: error.message || 'Error al anular la venta' });
  } finally {
    session.endSession();
  }
};

export {
  crearVenta,
  obtenerVentas,
  anularVenta,
};