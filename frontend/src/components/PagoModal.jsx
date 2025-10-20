// frontend/src/components/PagoModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid,
  FormControl, InputLabel, Select, MenuItem, InputAdornment, Typography, Alert
} from '@mui/material';

// 'cliente' es el objeto del cliente al que se le aplicará el pago
const PagoModal = ({ open, onClose, onSave, cliente }) => {
  const [monto, setMonto] = useState('');
  const [metodoDePago, setMetodoDePago] = useState('Efectivo');
  const [referencia, setReferencia] = useState('');
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const montoNum = parseFloat(monto);
    setError('');

    // --- Validaciones del Frontend ---
    if (!montoNum || montoNum <= 0) {
      setError('El monto debe ser un número mayor a cero.');
      return;
    }
    if (montoNum > cliente.saldoActual) {
      setError(`El monto (Q${montoNum.toFixed(2)}) no puede ser mayor al saldo pendiente (Q${cliente.saldoActual.toFixed(2)}).`);
      return;
    }
    if (metodoDePago !== 'Efectivo' && !referencia) {
      setError('Se requiere un número de referencia para este método de pago.');
      return;
    }
    
    // Si pasa, se arma el objeto de pago
    const datosPago = {
      monto: montoNum,
      metodoDePago,
      referencia: referencia || 'N/A',
      fechaPago,
    };
    onSave(datosPago); // Llama a la función de guardado
  };

  const handleClose = () => {
    // Resetea el formulario al cerrar
    setMonto('');
    setMetodoDePago('Efectivo');
    setReferencia('');
    setFechaPago(new Date().toISOString().split('T')[0]);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Abono a Cliente</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>{cliente?.nombreCompleto}</Typography>
        <Typography variant="body1" color="error.main" gutterBottom>
          Saldo Pendiente: <strong>Q{cliente?.saldoActual.toFixed(2)}</strong>
        </Typography>

        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Monto del Abono" 
              name="monto"
              type="number" 
              value={monto} 
              onChange={(e) => setMonto(e.target.value)} 
              fullWidth 
              required 
              autoFocus
              InputProps={{
                startAdornment: <InputAdornment position="start">Q</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha del Abono"
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={metodoDePago}
                label="Método de Pago"
                onChange={(e) => setMetodoDePago(e.target.value)}
              >
                <MenuItem value="Efectivo">Efectivo</MenuItem>
                <MenuItem value="Transferencia">Transferencia</MenuItem>
                <MenuItem value="Depósito Bancario">Depósito Bancario</MenuItem>
                <MenuItem value="Tarjeta">Tarjeta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              name="referencia" 
              label="Referencia (Boleta, Transacción)" 
              value={referencia} 
              onChange={(e) => setReferencia(e.target.value)} 
              fullWidth 
              helperText={metodoDePago === 'Efectivo' ? 'Opcional' : 'Requerido'}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar Abono</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PagoModal;