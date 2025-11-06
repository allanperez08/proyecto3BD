// frontend/src/components/AbonoHistorialModal.jsx
import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

// El modal ahora solo recibe los pagos (que ya están dentro del cliente)
const AbonoHistorialModal = ({ open, onClose, cliente }) => {

  const pagos = cliente?.pagos || []; // Obtenemos el array incrustado

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Historial de Abonos</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Cliente: {cliente?.nombreCompleto}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Saldo Pendiente Actual: <strong>Q{cliente?.saldoActual.toFixed(2)}</strong>
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha de Pago</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Referencia</TableCell>
                <TableCell>Registrado por</TableCell>
                <TableCell align="right">Monto (Q)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Hacemos un .reverse() para mostrar el más nuevo primero */}
              {[...pagos].reverse().map((pago) => (
                <TableRow key={pago._id}>
                  <TableCell>{new Date(pago.fechaPago).toLocaleString()}</TableCell>
                  <TableCell>{pago.metodoDePago}</TableCell>
                  <TableCell>{pago.referencia}</TableCell>
                  <TableCell>{pago.vendedorNombre}</TableCell>
                  <TableCell align="right">{pago.monto.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbonoHistorialModal;