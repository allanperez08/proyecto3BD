# Ferretería Xelajú - Sistema POS y Gestión (Proyecto Base de Datos II)

# Integrantes
* Perez Ajanel, Allan Eduardo - 1501321
* Sanchez Tasej, Francisco Javier – 2012421
* Salguero Sandoval, Miguel Antonio - 1626923
* Yax Puác, Kevin Miguel - 1529422


## ✨ Características Principales del programa

* **Gestión de Inventario:** CRUD completo de productos con esquema flexible para diferentes especificaciones.
* **Punto de Venta (POS):** Registro de ventas de Contado y Crédito, manejo de stock automático.
* **Gestión de Clientes:** CRUD de clientes con manejo de Límite de Crédito y Saldo Actual.
* **Gestión de Abonos:** Registro de pagos de clientes y conciliación automática de facturas pendientes (FIFO).
* **Gestión de Usuarios:** Roles (Administrador, Vendedor) y autenticación con JWT.
* **Transacciones ACID:** Uso de transacciones MongoDB para operaciones críticas (ventas, abonos, anulaciones) garantizando la integridad de los datos.
* **Interfaz Moderna:** Desarrollada con React y Material-UI (MUI).


## datos a tomar en cuenta para probar el repo, crear un archivo .env en el backend con lo siguiente:
# backend/.env

MONGO_URI=mongodb://127.0.0.1:27017/ferreteriaXelaju?replicaSet=rs0
JWT_SECRET=ferreteriaxelaju2025


Paso 2. abrir dos terminales para backend y frontend

1. en la primera terminal 
cd backend
npm run dev

2. en la segunda terminal
cd frontend
npm run dev y entrar al localhost