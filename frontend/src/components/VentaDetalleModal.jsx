// frontend/src/components/VentaDetalleModal.jsx
import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const VentaDetalleModal = ({ open, onClose, venta }) => {
  if (!venta) return null; // No renderizar nada si no hay venta seleccionada

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span">Detalle de Venta</Typography>
        <Typography variant="body1" color="textSecondary">ID: {venta._id}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Información del Cliente y Vendedor */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>Cliente</Typography>
            {/* Leemos de los nuevos campos desnormalizados */}
            <Typography><strong>Nombre:</strong> {venta.clienteNombre}</Typography>
            <Typography><strong>NIT:</strong> {venta.clienteNit}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>Venta</Typography>
            <Typography><strong>Vendedor:</strong> {venta.vendedor.nombre}</Typography>
            <Typography><strong>Fecha:</strong> {new Date(venta.fechaVenta).toLocaleString()}</Typography>
            <Typography><strong>Método de Pago:</strong> {venta.metodoPago}</Typography>
            <Typography><strong>Estado:</strong> {venta.estado}</Typography>
          </Grid>
        </Grid>

        {/* Items Vendidos */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Items Vendidos</Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Cant.</TableCell>
                <TableCell align="right">Precio Unit.</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {venta.items.map((item) => (
                <TableRow key={item.productoId}>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell align="right">{item.cantidadVendida}</TableCell>
                  <TableCell align="right">Q{item.precioAlVender.toFixed(2)}</TableCell>
                  <TableCell align="right">Q{(item.cantidadVendida * item.precioAlVender).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {/* Fila del Total */}
              <TableRow>
                <TableCell colSpan={3} />
                <TableCell align="right">
                  <Typography variant="h6">TOTAL</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Q{venta.totalVenta.toFixed(2)}</Typography>
                </TableCell>
              </TableRow>
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

export default VentaDetalleModal;