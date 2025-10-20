// frontend/src/components/ClienteModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid,
  InputAdornment
} from '@mui/material';

// 'cliente' será null si es para crear, o un objeto si es para editar
const ClienteModal = ({ open, onClose, onSave, cliente }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    nit: '',
    telefono: '',
    direccion: '',
    limiteDeCredito: 0,
  });

  const esModoEdicion = Boolean(cliente);

  useEffect(() => {
    if (cliente) {
      // Si estamos editando, llenamos el formulario
      setFormData({
        nombreCompleto: cliente.nombreCompleto || '',
        nit: cliente.nit || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        limiteDeCredito: cliente.limiteDeCredito || 0,
      });
    } else {
      // Si estamos creando, reseteamos a valores por defecto
      setFormData({
        nombreCompleto: '',
        nit: '',
        telefono: '',
        direccion: '',
        limiteDeCredito: 0,
      });
    }
  }, [cliente, open]); // Se resetea cada vez que se abre

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Convertimos el límite a número antes de enviar
    onSave({ ...formData, limiteDeCredito: Number(formData.limiteDeCredito) });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{esModoEdicion ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField name="nombreCompleto" label="Nombre Completo" value={formData.nombreCompleto} onChange={handleChange} fullWidth required autoFocus />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="nit" label="NIT" value={formData.nit} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="telefono" label="Teléfono" value={formData.telefono} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              name="limiteDeCredito" 
              label="Límite de Crédito" 
              type="number" 
              value={formData.limiteDeCredito} 
              onChange={handleChange} 
              fullWidth 
              InputProps={{
                startAdornment: <InputAdornment position="start">Q</InputAdornment>,
              }}
              helperText="Límite de crédito que se le otorga al cliente. 0 para sin crédito."
            />
          </Grid>
          {esModoEdicion && (
            <Grid item xs={12}>
              <TextField 
                label="Saldo Actual (Deuda)" 
                type="number" 
                value={cliente.saldoActual.toFixed(2)} 
                fullWidth 
                disabled // El saldo no se puede editar manualmente
                InputProps={{
                  startAdornment: <InputAdornment position="start">Q</InputAdornment>,
                }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClienteModal;