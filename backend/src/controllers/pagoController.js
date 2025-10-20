// backend/src/controllers/pagoController.js
import Pago from '../models/Pago.js';
import Cliente from '../models/Cliente.js';
import Venta from '../models/Venta.js'; // <-- ¡IMPORTANTE!
import mongoose from 'mongoose';

// @desc    Crear un nuevo pago (Abono) CON CONCILIACIÓN FIFO
// @route   POST /api/pagos
const crearPago = async (req, res) => {
  const { clienteId, monto, metodoDePago, referencia, fechaPago, vendedorId, clienteNombre, vendedorNombre } = req.body;

  const montoNum = parseFloat(monto);
  if (!montoNum || montoNum <= 0) {
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

    // 1. Guardar el documento de Pago
    const nuevoPago = new Pago({
      clienteId, monto: montoNum, metodoDePago, referencia,
      fechaPago: fechaPago || new Date(),
      vendedorId, clienteNombre, vendedorNombre,
    });
    await nuevoPago.save({ session });

    // 2. Lógica de Conciliación FIFO (First-In, First-Out)
    
    // Buscamos todas las facturas pendientes de este cliente, de la más antigua a la más nueva
    const facturasPendientes = await Venta.find({
      clienteId: clienteId,
      estadoPago: { $in: ['Pendiente', 'Abonada Parcialmente'] }
    }).sort({ fechaVenta: 1 }).session(session); // 1 = ascendente (FIFO)

    let montoRestanteDelPago = montoNum;

    for (const factura of facturasPendientes) {
      if (montoRestanteDelPago <= 0) break; // Si ya no hay dinero en el abono, paramos

      const montoAPagarEnFactura = Math.min(factura.montoPendiente, montoRestanteDelPago);

      factura.montoPendiente -= montoAPagarEnFactura;
      factura.montoPagado += montoAPagarEnFactura;
      montoRestanteDelPago -= montoAPagarEnFactura;

      // Actualizar estado de la factura
      if (factura.montoPendiente <= 0.01) { // Usamos un margen pequeño por decimales
        factura.montoPendiente = 0;
        factura.estadoPago = 'Pagada';
      } else {
        factura.estadoPago = 'Abonada Parcialmente';
      }

      await factura.save({ session });
    }

    // 3. Actualizar el saldo TOTAL del cliente
    await Cliente.findByIdAndUpdate(
      clienteId,
      { $inc: { saldoActual: -montoNum } }, // Restamos el monto total del abono
      { session }
    );

    // 4. Confirmar la transacción
    await session.commitTransaction();
    res.status(201).json({ message: 'Pago registrado y aplicado exitosamente', pago: nuevoPago });

  } catch (error) {
    await session.abortTransaction();
    console.error('--- ¡ERROR EN TRANSACCIÓN DE PAGO! ---');
    console.error(error);
    res.status(400).json({ message: error.message || 'Error al registrar el pago' });
  } finally {
    session.endSession();
  }
};

// ... (obtenerPagos y obtenerPagosPorCliente quedan igual) ...
const obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.find().sort({ fechaPago: -1 });
    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos' });
  }
};
const obtenerPagosPorCliente = async (req, res) => {
  try {
    const pagos = await Pago.find({ clienteId: req.params.clienteId }).sort({ fechaPago: -1 });
    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos del cliente' });
  }
};

export {
  crearPago,
  obtenerPagos,
  obtenerPagosPorCliente,
};