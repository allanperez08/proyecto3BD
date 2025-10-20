// frontend/src/components/UsuarioResetPasswordModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField,
  InputAdornment, IconButton, Alert, Typography
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UsuarioResetPasswordModal = ({ open, onClose, onSave, usuario }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validación en el frontend antes de enviar
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setError('');
    onSave(password);
    setPassword(''); // Limpia el campo
  };

  const handleClose = () => {
    setPassword(''); // Limpia al cerrar
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Resetear Contraseña</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Estás cambiando la contraseña para <strong>{usuario?.nombreCompleto}</strong>.
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField 
          name="password" 
          label="Nueva Contraseña" 
          type={showPassword ? 'text' : 'password'}
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          fullWidth 
          required 
          autoFocus
          margin="dense"
          helperText="Mínimo 6 caracteres."
          InputProps={{
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar Nueva Contraseña</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioResetPasswordModal;