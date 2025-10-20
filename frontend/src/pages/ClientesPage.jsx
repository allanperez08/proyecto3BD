// frontend/src/pages/ClientesPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import ClienteModal from '../components/ClienteModal';
import PagoModal from '../components/PagoModal';
import AbonoHistorialModal from '../components/AbonoHistorialModal'; // <-- 1. IMPORTAR
import {
  Box, Button, Typography, Paper, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // <-- 2. ÍCONO DE HISTORIAL

const ClientesPage = () => {
  const { usuario } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modales
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const [clienteAPagar, setClienteAPagar] = useState(null);
  
  // --- 3. ESTADO PARA MODAL HISTORIAL ---
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [clienteHistorial, setClienteHistorial] = useState(null);
  // ------------------------------------

  const fetchClientes = async () => {
    try {
      setLoading(true); setError('');
      const { data } = await apiClient.get('/clientes');
      setClientes(data);
    } catch (err) { setError('Error al cargar los clientes'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClientes(); }, []);

  // --- Lógica Modal Cliente (sin cambios) ---
  const handleOpenClienteModal = (cliente = null) => { setClienteAEditar(cliente); setIsClienteModalOpen(true); };
  const handleCloseClienteModal = () => { setIsClienteModalOpen(false); setClienteAEditar(null); };
  const handleSaveCliente = async (datosCliente) => {
    try {
      if (clienteAEditar) await apiClient.put(`/clientes/${clienteAEditar._id}`, datosCliente);
      else await apiClient.post('/clientes', datosCliente);
      fetchClientes(); handleCloseClienteModal();
    } catch (err) { setError(err.response?.data?.message || 'Error al guardar el cliente'); }
  };
  const handleDeleteCliente = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await apiClient.delete(`/clientes/${id}`);
        fetchClientes();
      } catch (err) { setError(err.response?.data?.message || 'Error al eliminar'); }
    }
  };
  
  // --- Lógica Modal de Pago (sin cambios) ---
  const handleOpenPagoModal = (cliente) => { setClienteAPagar(cliente); setIsPagoModalOpen(true); };
  const handleClosePagoModal = () => { setIsPagoModalOpen(false); setClienteAPagar(null); };
  const handleSavePago = async (datosPago) => {
    try {
      const pagoCompleto = {
        ...datosPago,
        clienteId: clienteAPagar._id,
        clienteNombre: clienteAPagar.nombreCompleto,
        vendedorId: usuario._id,
        vendedorNombre: usuario.nombreCompleto,
      };
      await apiClient.post('/pagos', pagoCompleto); // <-- CORREGIDO: quitado /api
      handleClosePagoModal(); fetchClientes(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el pago');
      handleClosePagoModal();
    }
  };
  
  // --- 4. LÓGICA MODAL HISTORIAL (NUEVA) ---
  const handleOpenHistorial = (cliente) => {
    setClienteHistorial(cliente);
    setIsHistorialOpen(true);
  };
  const handleCloseHistorial = () => {
    setIsHistorialOpen(false);
    setClienteHistorial(null);
  };
  // ------------------------------------

  // --- RENDERIZADO DE LA PÁGINA ---
  if (loading) return <CircularProgress sx={{ display: 'block', margin: '100px auto' }} />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" display="flex" alignItems="center">
          <PeopleAltIcon sx={{ mr: 1, fontSize: '2.5rem' }} />
          Gestión de Clientes
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenClienteModal()}>
          Agregar Cliente
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>NIT</TableCell>
              <TableCell align="right">Saldo Actual (Deuda)</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente._id} hover>
                <TableCell>{cliente.nombreCompleto}</TableCell>
                <TableCell>{cliente.nit}</TableCell>
                <TableCell align="right" sx={{ color: cliente.saldoActual > 0 ? 'error.main' : 'success.main', fontWeight: 'bold' }}>
                  Q{cliente.saldoActual.toFixed(2)}
                </TableCell>
                <TableCell>
                  {/* --- 5. AÑADIR BOTONES --- */}
                  <Tooltip title="Registrar Abono">
                    <span> {/* Span para Tooltip en botón deshabilitado */}
                      <IconButton 
                        color="success" 
                        onClick={() => handleOpenPagoModal(cliente)}
                        disabled={cliente.saldoActual <= 0} // Deshabilita si no hay deuda
                      >
                        <PaymentIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Ver Historial de Abonos">
                    <IconButton color="info" onClick={() => handleOpenHistorial(cliente)}>
                      <ReceiptLongIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar Cliente">
                    <IconButton color="primary" onClick={() => handleOpenClienteModal(cliente)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar Cliente">
                    <IconButton color="error" onClick={() => handleDeleteCliente(cliente._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Renderizar los tres modals */}
      <ClienteModal
        open={isClienteModalOpen}
        onClose={handleCloseClienteModal}
        onSave={handleSaveCliente}
        cliente={clienteAEditar}
      />
      {clienteAPagar && (
        <PagoModal
          open={isPagoModalOpen}
          onClose={handleClosePagoModal}
          onSave={handleSavePago}
          cliente={clienteAPagar}
        />
      )}
      {/* --- 6. RENDERIZAR MODAL HISTORIAL --- */}
      {clienteHistorial && (
        <AbonoHistorialModal
          open={isHistorialOpen}
          onClose={handleCloseHistorial}
          cliente={clienteHistorial}
        />
      )}
    </Box>
  );
};

export default ClientesPage;