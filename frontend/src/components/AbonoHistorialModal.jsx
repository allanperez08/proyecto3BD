// frontend/src/components/AbonoHistorialModal.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert
} from '@mui/material';

const AbonoHistorialModal = ({ open, onClose, cliente }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && cliente) {
      const fetchPagos = async () => {
        setLoading(true);
        setError('');
        try {
          // Usamos el endpoint que ya creamos en el backend
          const { data } = await apiClient.get(`/pagos/cliente/${cliente._id}`);
          setPagos(data);
        } catch (err) {
          setError('Error al cargar el historial de abonos.');
        } finally {
          setLoading(false);
        }
      };
      fetchPagos();
    }
  }, [open, cliente]); // Se ejecuta cada vez que se abre el modal

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

        {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        
        {!loading && !error && (
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
                {pagos.map((pago) => (
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbonoHistorialModal;