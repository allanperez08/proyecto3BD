# Ferretería Xelajú - Sistema POS y Gestión (Proyecto Base de Datos II)

Sistema de Punto de Venta (POS) e inventario desarrollado como proyecto para el curso de Base de Datos II, utilizando el stack MERN (MongoDB, Express, React, Node.js) y enfocado en demostrar conceptos de bases de datos NoSQL.



## ✨ Características Principales

* **Gestión de Inventario:** CRUD completo de productos con esquema flexible para diferentes especificaciones.
* **Punto de Venta (POS):** Registro de ventas de Contado y Crédito, manejo de stock automático.
* **Gestión de Clientes:** CRUD de clientes con manejo de Límite de Crédito y Saldo Actual.
* **Gestión de Abonos:** Registro de pagos de clientes y conciliación automática de facturas pendientes (FIFO).
* **Gestión de Usuarios:** Roles (Administrador, Vendedor) y autenticación con JWT.
* **Transacciones ACID:** Uso de transacciones MongoDB para operaciones críticas (ventas, abonos, anulaciones) garantizando la integridad de los datos.
* **Interfaz Moderna:** Desarrollada con React y Material-UI (MUI).



* **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs
* **Frontend:** React (Vite), Material-UI (MUI), React Router, Axios
* **Base de Datos:** MongoDB (Requiere configuración de Replica Set para transacciones)

## 🚀 Instalación y Ejecución

Sigue estos pasos para clonar y correr el proyecto localmente.

### Prerrequisitos

* Node.js (v18 o superior recomendado)
* npm (o yarn/pnpm)
* MongoDB instalado localmente
* Git

### Pasos

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/allanperez08/proyecto3BD](https://github.com/allanperez08/proyecto3BD)
    cd ferreteria-maestra
    ```

2.  **Configurar MongoDB como Replica Set:**
    * **IMPORTANTE:** Las transacciones requieren que MongoDB se ejecute en modo Replica Set. Sigue las instrucciones [aquí](#configuración-mongodb-replica-set) (o linkea a un Gist/documento si es largo).

3.  **Configurar Backend:**
    * Navega a la carpeta del backend:
        ```bash
        cd backend
        ```
    * Instala las dependencias:
        ```bash
        npm install
        ```
    * Pegar el archivo `.env` en la raíz de `/backend` 
        ```
    * Inicia el servidor backend (se mantendrá corriendo con nodemon):
        ```bash
        npm run dev
        ```
        ```

4.  **Configurar Frontend:**
    * Abre **otra terminal** y navega a la carpeta del frontend:
        ```bash
        cd ../frontend
        # (Asegúrate de estar en ferreteria-maestra/frontend)
        ```
    * Instala las dependencias:
        ```bash
        npm install
        ```
    * Inicia la aplicación de React:
        ```bash
        npm run dev
        ```

5.  **Acceder a la Aplicación:**
    * Abre tu navegador y ve a la dirección que te indica Vite (normalmente `http://localhost:5173`).
    * Inicia sesión con el usuario `admin` y la contraseña que creaste.

---

## <a name="configuración-mongodb-replica-set"></a>⚙️ Configuración MongoDB Replica Set (Ubuntu)

Este proyecto **requiere** que tu instancia local de MongoDB esté configurada como un Replica Set para que las transacciones funcionen.

1.  **Detener MongoDB:**
    ```bash
    sudo systemctl stop mongod
    ```
2.  **Editar Configuración:**
    ```bash
    sudo nano /etc/mongod.conf
    ```
    Añade o descomenta y modifica la sección `replication` para que quede así:
    ```yaml
    replication:
      replSetName: "rs0"
    ```
    (Guarda con `Ctrl+O`, `Enter`, y sal con `Ctrl+X`)
3.  **Reiniciar MongoDB:**
    ```bash
    sudo systemctl start mongod
    ```
4.  **Iniciar el Replica Set (Solo la primera vez):**
    ```bash
    mongosh
    ```
    Dentro de `mongosh`, ejecuta:
    ```javascript
    rs.initiate()
    ```
    El prompt cambiará a `rs0:PRIMARY>`. Escribe `exit`.
5.  **Verificar:** Asegúrate de que tu `MONGO_URI` en `backend/.env` incluye `?replicaSet=rs0` al final.

---

