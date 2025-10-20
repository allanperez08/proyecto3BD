// frontend/src/pages/InventarioPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import ProductoModal from '../components/ProductoModal';
import {
  Box, Button, Typography, Paper, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const InventarioPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  // --- 1. FUNCIÓN PARA CARGAR PRODUCTOS ---
  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await apiClient.get('/productos');
      setProductos(data);
    } catch (err) {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Carga los productos cuando el componente se monta
  useEffect(() => {
    fetchProductos();
  }, []);

  // --- 2. FUNCIONES PARA ABRIR/CERRAR EL MODAL ---
  const handleOpenModal = (producto = null) => {
    setProductoAEditar(producto); // Si 'producto' no es null, estamos editando
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductoAEditar(null);
  };

  // --- 3. FUNCIÓN PARA GUARDAR (CREAR O ACTUALIZAR) ---
  const handleSaveProducto = async (datosProducto) => {
    try {
      if (productoAEditar) {
        // Actualizar (PUT)
        await apiClient.put(`/productos/${productoAEditar._id}`, datosProducto);
      } else {
        // Crear (POST)
        await apiClient.post('/productos', datosProducto);
      }
      fetchProductos(); // Recarga la lista de productos
      handleCloseModal(); // Cierra el modal
    } catch (err) {
      setError('Error al guardar el producto');
    }
  };

  // --- 4. FUNCIÓN PARA ELIMINAR ---
  const handleDeleteProducto = async (id) => {
    // Pedimos confirmación antes de borrar
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await apiClient.delete(`/productos/${id}`);
        fetchProductos(); // Recarga la lista
      } catch (err) {
        setError('Error al eliminar el producto');
      }
    }
  };

  // --- RENDERIZADO DE LA PÁGINA ---
  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <Box> {/* <--- LÍNEA CORREGIDA */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Inventario</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Agregar Producto
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Precio Venta (Q)</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto._id}>
                <TableCell>{producto.sku}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
                <TableCell>{producto.cantidadEnStock}</TableCell>
                <TableCell>{producto.precio.venta.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenModal(producto)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteProducto(producto._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductoModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProducto}
        producto={productoAEditar}
      />
    </Box>
  );
};

export default InventarioPage;