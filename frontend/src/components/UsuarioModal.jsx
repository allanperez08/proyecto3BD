// frontend/src/components/UsuarioModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid,
  FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch,
  InputAdornment, IconButton // <-- 1. Importar
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility'; // <-- 2. Importar íconos
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UsuarioModal = ({ open, onClose, onSave, usuario }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    username: '',
    password: '',
    rol: 'Vendedor',
    activo: true,
  });
  const [showPassword, setShowPassword] = useState(false); // <-- 3. Añadir estado

  const esModoEdicion = Boolean(usuario);

  useEffect(() => {
    setShowPassword(false); // Resetea el ojito al abrir
    if (usuario) {
      setFormData({
        nombreCompleto: usuario.nombreCompleto || '',
        username: usuario.username || '',
        password: '',
        rol: usuario.rol || 'Vendedor',
        activo: usuario.activo || false,
      });
    } else {
      setFormData({
        nombreCompleto: '',
        username: '',
        password: '',
        rol: 'Vendedor',
        activo: true,
      });
    }
  }, [usuario, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const datosFinales = { ...formData };
    if (esModoEdicion) {
      delete datosFinales.password;
    } else {
      delete datosFinales.activo;
    }
    onSave(datosFinales);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{esModoEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField name="nombreCompleto" label="Nombre Completo" value={formData.nombreCompleto} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField name="username" label="Nombre de Usuario" value={formData.username} onChange={handleChange} fullWidth required />
          </Grid>

          {/* --- CAMPO DE CONTRASEÑA MODIFICADO --- */}
          {!esModoEdicion && (
            <Grid item xs={12}>
              <TextField 
                name="password" 
                label="Contraseña" 
                type={showPassword ? 'text' : 'password'} // <-- 4. Tipo dinámico
                value={formData.password} 
                onChange={handleChange} 
                fullWidth 
                required 
                helperText="Mínimo 6 caracteres."
                InputProps={{ // <-- 5. Añadir el ícono
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          {/* --- FIN DE MODIFICACIÓN --- */}

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select name="rol" value={formData.rol} label="Rol" onChange={handleChange}>
                <MenuItem value="Vendedor">Vendedor</MenuItem>
                <MenuItem value="Administrador">Administrador</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {esModoEdicion && (
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={formData.activo} onChange={handleChange} name="activo" />}
                label="Usuario Activo"
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

export default UsuarioModal;