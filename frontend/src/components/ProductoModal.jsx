// frontend/src/components/ProductoModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Box, Typography
} from '@mui/material';

// 'producto' será null si es para crear, o un objeto si es para editar
const ProductoModal = ({ open, onClose, onSave, producto }) => {
  const [formData, setFormData] = useState({});
  const [especificaciones, setEspecificaciones] = useState([{ clave: '', valor: '' }]);

  useEffect(() => {
    if (producto) {
      // Si estamos editando, llenamos el formulario con los datos del producto
      setFormData({
        nombre: producto.nombre || '',
        sku: producto.sku || '',
        descripcion: producto.descripcion || '',
        cantidadEnStock: producto.cantidadEnStock || 0,
        precioCompra: producto.precio?.compra || 0,
        precioVenta: producto.precio?.venta || 0,
        categoria: producto.categoria || '',
        proveedorNombre: producto.proveedor?.nombre || '',
        ubicacionPasillo: producto.ubicacion?.pasillo || '',
      });
      // Convertimos el objeto de especificaciones a un array para el formulario
      setEspecificaciones(
        producto.especificaciones ? Object.entries(producto.especificaciones).map(([clave, valor]) => ({ clave, valor })) : [{ clave: '', valor: '' }]
      );
    } else {
      // Si estamos creando, reseteamos el formulario
      setFormData({});
      setEspecificaciones([{ clave: '', valor: '' }]);
    }
  }, [producto, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecChange = (index, e) => {
    const nuevosSpecs = [...especificaciones];
    nuevosSpecs[index][e.target.name] = e.target.value;
    setEspecificaciones(nuevosSpecs);
  };

  const addSpecField = () => {
    setEspecificaciones([...especificaciones, { clave: '', valor: '' }]);
  };

  const handleSubmit = () => {
    // Reconvertimos el formulario a la estructura del backend
    const datosFinales = {
      nombre: formData.nombre,
      sku: formData.sku,
      descripcion: formData.descripcion,
      cantidadEnStock: Number(formData.cantidadEnStock),
      categoria: formData.categoria,
      precio: {
        compra: Number(formData.precioCompra),
        venta: Number(formData.precioVenta),
      },
      proveedor: {
        nombre: formData.proveedorNombre,
      },
      ubicacion: {
        pasillo: formData.ubicacionPasillo,
      },
      // Convertimos el array de especificaciones de nuevo a un objeto
      especificaciones: especificaciones.reduce((acc, spec) => {
        if (spec.clave) acc[spec.clave] = spec.valor;
        return acc;
      }, {}),
    };
    onSave(datosFinales);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{producto ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField name="nombre" label="Nombre del Producto" value={formData.nombre || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="sku" label="SKU (Código)" value={formData.sku || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField name="descripcion" label="Descripción" value={formData.descripcion || ''} onChange={handleChange} fullWidth multiline rows={2} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField name="cantidadEnStock" label="Cantidad en Stock" type="number" value={formData.cantidadEnStock || 0} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField name="precioCompra" label="Precio de Compra (Q)" type="number" value={formData.precioCompra || 0} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField name="precioVenta" label="Precio de Venta (Q)" type="number" value={formData.precioVenta || 0} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="categoria" label="Categoría" value={formData.categoria || ''} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="proveedorNombre" label="Proveedor" value={formData.proveedorNombre || ''} onChange={handleChange} fullWidth />
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6">Especificaciones (Flexible)</Typography>
            {especificaciones.map((spec, index) => (
              <Box key={index} display="flex" gap={1} mb={1}>
                <TextField name="clave" label="Atributo (ej: Potencia)" value={spec.clave} onChange={(e) => handleSpecChange(index, e)} />
                <TextField name="valor" label="Valor (ej: 750W)" value={spec.valor} onChange={(e) => handleSpecChange(index, e)} />
              </Box>
            ))}
            <Button onClick={addSpecField}>+ Añadir Especificación</Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoModal;