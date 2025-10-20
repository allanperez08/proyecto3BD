// frontend/src/pages/VentasPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import VentaDetalleModal from '../components/VentaDetalleModal';
import ClienteModal from '../components/ClienteModal';
import {
  Box, Button, Typography, Paper, CircularProgress, Alert, Grid, TextField, Autocomplete,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip,
  FormControl, InputLabel, Select, MenuItem, InputAdornment, FormHelperText, Tooltip
} from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const VentasPage = () => {
  const { usuario } = useAuth();
  
  // Estados POS
  const [productosInventario, setProductosInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  
  // Estados Cliente y Pago
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [tipoDePago, setTipoDePago] = useState('Contado');
  const [metodoDePago, setMetodoDePago] = useState('Efectivo');
  
  // Estados UI e Historial
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);

  // --- 1. LÓGICA DE CARGA DE DATOS ---
  const fetchData = async () => {
    try {
      setLoading(true); setError('');
      const [resProductos, resVentas, resClientes] = await Promise.all([
        apiClient.get('/productos'),
        apiClient.get('/ventas'),
        apiClient.get('/clientes')
      ]);
      setProductosInventario(resProductos.data);
      setVentas(resVentas.data);
      setClientes(resClientes.data);
      
      const clienteCF = resClientes.data.find(c => c.nit.toUpperCase() === 'CF');
      if (clienteCF && !clienteSeleccionado) { // Solo auto-selecciona si no hay uno ya
        setClienteSeleccionado(clienteCF);
      }
    } catch (err) {
      setError('Error al cargar los datos. Intente recargar la página.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. LÓGICA DEL CARRITO (Sin cambios) ---
  const handleAddAlCarrito = (producto, cantidad = 1) => { /* ... (código idéntico) ... */ 
    if (!producto || cantidad <= 0) return;
    setError('');
    const itemExistente = carrito.find(item => item.productoId === producto._id);
    const cantidadNueva = (itemExistente ? itemExistente.cantidadVendida : 0) + cantidad;
    if (producto.cantidadEnStock < cantidadNueva) {
      setError(`Stock insuficiente para "${producto.nombre}". Solo quedan ${producto.cantidadEnStock}.`);
      return;
    }
    setCarrito(prev => {
      if (itemExistente) {
        return prev.map(item =>
          item.productoId === producto._id ? { ...item, cantidadVendida: cantidadNueva } : item
        );
      } else {
        return [
          ...prev, {
            productoId: producto._id, sku: producto.sku, nombre: producto.nombre,
            cantidadVendida: cantidad, precioAlVender: producto.precio.venta,
          },
        ];
      }
    });
  };
  const handleRemoveDelCarrito = (productoId) => { /* ... (código idéntico) ... */ 
    setCarrito(prev => prev.filter(item => item.productoId !== productoId));
  };
  const handleActualizarCantidad = (productoId, nuevaCantidad) => { /* ... (código idéntico) ... */ 
    const cantidad = Number(nuevaCantidad);
    if (cantidad <= 0) { handleRemoveDelCarrito(productoId); return; }
    setCarrito(prev => prev.map(item => {
      if (item.productoId === productoId) {
        const productoEnInventario = productosInventario.find(p => p._id === productoId);
        if (productoEnInventario && productoEnInventario.cantidadEnStock < cantidad) {
          setError(`Stock insuficiente. Solo quedan ${productoEnInventario.cantidadEnStock}.`);
          return { ...item, cantidadVendida: productoEnInventario.cantidadEnStock }; 
        }
        setError('');
        return { ...item, cantidadVendida: cantidad };
      }
      return item;
    }));
  };
  const totalVenta = useMemo(() => { /* ... (código idéntico) ... */ 
    return carrito.reduce((acc, item) => acc + (item.precioAlVender * item.cantidadVendida), 0);
  }, [carrito]);
  // --- Fin Lógica Carrito ---

  // --- 3. LÓGICA DE VENTA Y MODALES (Sin cambios) ---
  const handleFinalizarVenta = async () => { /* ... (código idéntico) ... */ 
    if (carrito.length === 0) { setError('El carrito está vacío.'); return; }
    if (!clienteSeleccionado) { setError('Debe seleccionar un cliente.'); return; }
    setError('');
    const nuevaVenta = {
      vendedor: { usuarioId: usuario._id, nombre: usuario.nombreCompleto },
      clienteId: clienteSeleccionado._id,
      clienteNombre: clienteSeleccionado.nombreCompleto,
      clienteNit: clienteSeleccionado.nit, // Asegúrate de que esto esté aquí
      items: carrito,
      subtotal: totalVenta, descuento: 0, totalVenta: totalVenta,
      tipoDePago: tipoDePago,
      metodoDePago: tipoDePago === 'Contado' ? metodoDePago : 'N/A',
      estadoPago: tipoDePago === 'Contado' ? 'Pagada' : 'Pendiente',
      montoPagado: tipoDePago === 'Contado' ? totalVenta : 0,
      montoPendiente: tipoDePago === 'Contado' ? 0 : totalVenta, // Asegúrate de que esto esté aquí
    };
    try {
      await apiClient.post('/ventas', nuevaVenta);
      setCarrito([]);
      const clienteCF = clientes.find(c => c.nit.toUpperCase() === 'CF');
      setClienteSeleccionado(clienteCF || null);
      setTipoDePago('Contado'); setMetodoDePago('Efectivo');
      fetchData(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar la venta');
    }
  };
  const handleAnularVenta = async (ventaId) => { /* ... (código idéntico) ... */ 
    if (window.confirm('¿Estás seguro de que quieres anular esta venta? Esta acción devolverá los productos al inventario y ajustará el saldo del cliente si fue a crédito.')) {
      try {
        await apiClient.put(`/ventas/anular/${ventaId}`);
        fetchData(); 
      } catch (err) {
        setError(err.response?.data?.message || 'Error al anular la venta');
      }
    }
  };
  const handleOpenDetalle = (venta) => { /* ... (código idéntico) ... */ 
    setVentaSeleccionada(venta); setIsDetalleOpen(true);
  };
  const handleCloseDetalle = () => { /* ... (código idéntico) ... */ 
    setIsDetalleOpen(false); setVentaSeleccionada(null);
  };
  const handleSaveCliente = async (datosCliente) => { /* ... (código idéntico) ... */ 
    try {
      const { data } = await apiClient.post('/clientes', datosCliente);
      setIsClienteModalOpen(false);
      const nuevosClientes = [...clientes, data.cliente];
      setClientes(nuevosClientes);
      setClienteSeleccionado(data.cliente);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el cliente');
    }
  };
  // --- Fin Lógica Venta y Modales ---

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '100px auto' }} />;

  // --- 4. RENDERIZADO DE LA PÁGINA (CON CAMBIOS EN EL HISTORIAL) ---
  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      <Grid container spacing={4}>
        {/* COLUMNA IZQUIERDA: PUNTO DE VENTA (POS) (Sin cambios) */}
        <Grid item xs={12} md={5}>
           <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom display="flex" alignItems="center">
              <PointOfSaleIcon sx={{ mr: 1 }} /> Nueva Venta
            </Typography>
            <Autocomplete
              options={productosInventario.filter(p => p.cantidadEnStock > 0)}
              getOptionLabel={(option) => `${option.nombre} (Stock: ${option.cantidadEnStock})`}
              onChange={(event, newValue) => { handleAddAlCarrito(newValue); }}
              renderInput={(params) => <TextField {...params} label="1. Buscar producto" />}
              sx={{ mb: 2 }}
            />
            <TableContainer>
              <Table size="small"><TableHead><TableRow><TableCell>Producto</TableCell><TableCell align="right" sx={{ width: '80px' }}>Cant.</TableCell><TableCell align="right">Subtotal</TableCell><TableCell align="right">Acción</TableCell></TableRow></TableHead><TableBody>{carrito.map(item => (<TableRow key={item.productoId}><TableCell>{item.nombre}</TableCell><TableCell align="right"><TextField type="number" value={item.cantidadVendida} onChange={(e) => handleActualizarCantidad(item.productoId, e.target.value)} inputProps={{ min: 1, style: { textAlign: 'right', width: '60px', padding: '4px 8px' } }} size="small" variant="outlined"/></TableCell><TableCell align="right">Q{(item.cantidadVendida * item.precioAlVender).toFixed(2)}</TableCell><TableCell align="right"><IconButton size="small" color="error" onClick={() => handleRemoveDelCarrito(item.productoId)}><CancelIcon fontSize="small" /></IconButton></TableCell></TableRow>))}</TableBody></Table>
            </TableContainer>
            <Typography variant="h5" align="right" sx={{ mt: 2, mr: 1 }}>Total: Q{totalVenta.toFixed(2)}</Typography>
            <Box sx={{ mt: 2, borderTop: '1px solid #ddd', pt: 2 }}>
              <Typography variant="h6" gutterBottom>2. Cliente y Pago</Typography>
              <Autocomplete
                options={clientes}
                getOptionLabel={(option) => `${option.nombreCompleto} (NIT: ${option.nit})`}
                value={clienteSeleccionado}
                onChange={(event, newValue) => {
                  setClienteSeleccionado(newValue);
                  if (newValue && newValue.limiteDeCredito === 0) { setTipoDePago('Contado'); }
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Buscar Cliente (NIT o Nombre)"
                    InputProps={{ ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {params.InputProps.endAdornment}
                          <InputAdornment position="end">
                            <IconButton color="primary" title="Crear Cliente Rápido" onClick={() => setIsClienteModalOpen(true)}>
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </InputAdornment>
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                sx={{ mb: 2 }}
              />
              {clienteSeleccionado && (
                <Alert 
                  severity={tipoDePago === 'Credito' && (clienteSeleccionado.saldoActual + totalVenta > clienteSeleccionado.limiteDeCredito) ? 'error' : 'info'} 
                  sx={{ mb: 2 }}
                >
                  Saldo: Q{clienteSeleccionado.saldoActual.toFixed(2)} | Límite: Q{clienteSeleccionado.limiteDeCredito.toFixed(2)}
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Pago</InputLabel>
                    <Select
                      value={tipoDePago}
                      label="Tipo de Pago"
                      onChange={(e) => setTipoDePago(e.target.value)}
                      disabled={!clienteSeleccionado || (clienteSeleccionado.limiteDeCredito === 0)}
                    >
                      <MenuItem value="Contado">Contado</MenuItem>
                      <MenuItem value="Credito">Crédito</MenuItem>
                    </Select>
                    {!clienteSeleccionado || clienteSeleccionado.limiteDeCredito === 0 ? (
                      <FormHelperText>Solo ventas de Contado para este cliente</FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
                {tipoDePago === 'Contado' && (
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Método de Pago</InputLabel>
                      <Select value={metodoDePago} label="Método de Pago" onChange={(e) => setMetodoDePago(e.target.value)}>
                        <MenuItem value="Efectivo">Efectivo</MenuItem>
                        <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                        <MenuItem value="Transferencia">Transferencia</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Box>
            <Button
              variant="contained" fullWidth sx={{ mt: 3, fontSize: '1.1rem' }}
              onClick={handleFinalizarVenta}
              disabled={carrito.length === 0 || !clienteSeleccionado}
            >
              Finalizar Venta
            </Button>
          </Paper>
        </Grid>
        
        {/* --- COLUMNA DERECHA: HISTORIAL DE VENTAS (MODIFICADA) --- */}
        <Grid item xs={12} md={7}>
          <Typography variant="h5" gutterBottom>Historial de Ventas</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Pendiente</TableCell> {/* <-- COLUMNA NUEVA */}
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.map(venta => {
                  // Lógica para el color del chip de estado
                  let estadoColor = 'default';
                  if (venta.estadoPago === 'Pagada') estadoColor = 'success';
                  if (venta.estadoPago === 'Pendiente') estadoColor = 'warning';
                  if (venta.estadoPago === 'Abonada Parcialmente') estadoColor = 'info';
                  if (venta.estadoPago === 'Anulada') estadoColor = 'error';

                  return (
                    <TableRow key={venta._id}>
                      <TableCell>{new Date(venta.fechaVenta).toLocaleString()}</TableCell>
                      <TableCell>{venta.clienteNombre}</TableCell>
                      <TableCell align="right">Q{venta.totalVenta.toFixed(2)}</TableCell>
                      {/* --- CELDA NUEVA --- */}
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: venta.montoPendiente > 0 ? 'error.main' : 'inherit' }}>
                        Q{venta.montoPendiente.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={venta.estadoPago} 
                          color={estadoColor}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver Detalle">
                          <IconButton size="small" color="default" onClick={() => handleOpenDetalle(venta)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {/* Ya no usamos 'venta.estado' sino 'venta.estadoPago' */}
                        {venta.estadoPago !== 'Anulada' && (
                          <Tooltip title="Anular Venta">
                            <Button size="small" color="warning" variant="outlined" onClick={() => handleAnularVenta(venta._id)}>
                              Anular
                            </Button>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* --- MODALES (Sin cambios) --- */}
      {ventaSeleccionada && (
        <VentaDetalleModal
          open={isDetalleOpen}
          onClose={handleCloseDetalle}
          venta={ventaSeleccionada}
        />
      )}
      <ClienteModal
        open={isClienteModalOpen}
        onClose={() => setIsClienteModalOpen(false)}
        onSave={handleSaveCliente}
        cliente={null}
      />
    </Box>
  );
};

export default VentasPage;