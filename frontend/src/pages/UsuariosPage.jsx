// frontend/src/pages/UsuariosPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import UsuarioModal from '../components/UsuarioModal';
import UsuarioResetPasswordModal from '../components/UsuarioResetPasswordModal';
import {
  Box, Button, Typography, Paper, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Tooltip // <-- Asegúrate que Tooltip esté importado
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';

const UsuariosPage = () => {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [usuarioAResetear, setUsuarioAResetear] = useState(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true); setError('');
      const { data } = await apiClient.get('/usuarios');
      setUsuarios(data);
    } catch (err) { setError('Error al cargar los usuarios'); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (usuario?.rol === 'Administrador') fetchUsuarios();
  }, [usuario]);

  // --- Funciones del modal principal ---
  const handleOpenModal = (usuario = null) => {
    setUsuarioAEditar(usuario); setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false); setUsuarioAEditar(null);
  };
  const handleSaveUsuario = async (datosUsuario) => {
    try {
      if (usuarioAEditar) {
        await apiClient.put(`/usuarios/${usuarioAEditar._id}`, datosUsuario);
      } else {
        await apiClient.post('/usuarios', datosUsuario);
      }
      fetchUsuarios(); handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el usuario');
    }
  };

  // --- Funciones del modal de reseteo ---
  const handleOpenResetModal = (usuario) => {
    setUsuarioAResetear(usuario); setIsResetModalOpen(true);
  };
  const handleCloseResetModal = () => {
    setIsResetModalOpen(false); setUsuarioAResetear(null);
  };
  const handleSaveResetPassword = async (newPassword) => {
    try {
      await apiClient.put(`/usuarios/${usuarioAResetear._id}/set-password`, { password: newPassword });
      handleCloseResetModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al resetear la contraseña');
    }
  };

  const handleDeleteUsuario = async (id) => {
    if (id === usuario._id) { setError('No puedes eliminarte a ti mismo.'); return; }
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await apiClient.delete(`/usuarios/${id}`);
        fetchUsuarios();
      } catch (err) { setError('Error al eliminar el usuario'); }
    }
  };

  if (usuario?.rol !== 'Administrador') {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        <Typography variant="h6">Acceso Denegado</Typography>
        Solo los administradores pueden gestionar usuarios.
      </Alert>
    );
  }
  if (loading) return <CircularProgress sx={{ display: 'block', margin: '100px auto' }} />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Usuarios</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Agregar Usuario
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>Nombre Completo</TableCell><TableCell>Username</TableCell><TableCell>Rol</TableCell><TableCell>Estado</TableCell><TableCell>Acciones</TableCell></TableRow></TableHead>
          <TableBody>
            {usuarios.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.nombreCompleto}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Chip label={user.rol} color={user.rol === 'Administrador' ? 'primary' : 'default'} size="small"/>
                </TableCell>
                <TableCell>
                  <Chip label={user.activo ? 'Activo' : 'Inactivo'} color={user.activo ? 'success' : 'error'} size="small"/>
                </TableCell>
                <TableCell>
                  <Tooltip title="Editar Usuario">
                    <IconButton color="primary" onClick={() => handleOpenModal(user)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Resetear Contraseña">
                    <IconButton color="warning" onClick={() => handleOpenResetModal(user)}>
                      <LockResetIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar Usuario">
                    <IconButton color="error" onClick={() => handleDeleteUsuario(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Renderizar los dos modals */}
      <UsuarioModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUsuario}
        usuario={usuarioAEditar}
      />
      {usuarioAResetear && (
        <UsuarioResetPasswordModal
          open={isResetModalOpen}
          onClose={handleCloseResetModal}
          onSave={handleSaveResetPassword}
          usuario={usuarioAResetear}
        />
      )}
    </Box>
  );
};

export default UsuariosPage;