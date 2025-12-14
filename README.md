# Panel de Control Empresarial

Sistema completo de gestión empresarial con las siguientes funcionalidades:

## 🚀 Funcionalidades

### Módulos Principales
- **Panel de Control**: Dashboard con métricas y estadísticas en tiempo real
- **Gestión de Pedidos**: Administración completa de pedidos con búsqueda y filtros
- **Gestión de Productos**: Catálogo de productos con control de stock
- **Gestión de Inventario**: Control de inventario con alertas de stock bajo
- **Generación de Reportes**: Reportes analíticos con gráficos de ventas e insumos
- **Gestión de Clientes y Empleados**: Administración de contactos

### Características
- Diseño responsivo que funciona en móviles, tablets y escritorio
- Interfaz moderna con tema claro/oscuro
- Tablas interactivas con búsqueda
- Gráficos y visualización de datos
- Sistema de alertas y notificaciones
- Navegación intuitiva entre módulos

## 🗄️ Configuración de Base de Datos MySQL

### Paso 1: Variables de Entorno
Agrega las siguientes variables de entorno en tu proyecto Vercel o archivo `.env.local`:

\`\`\`env
DB_HOST=tu-host-mysql.com
DB_USER=tu-usuario
DB_PASSWORD=tu-contraseña
DB_NAME=nombre-base-datos
DB_PORT=3306
\`\`\`

### Paso 2: Estructura de Base de Datos Sugerida

\`\`\`sql
-- Tabla de productos
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(100),
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  stock_minimo INT DEFAULT 50,
  imagen VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(50),
  direccion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  total DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2),
  envio DECIMAL(10, 2) DEFAULT 5.00,
  estado ENUM('Pendiente', 'En Proceso', 'Completado', 'Cancelado') DEFAULT 'Pendiente',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabla de items del pedido
CREATE TABLE pedido_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  producto_id INT,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de empleados
CREATE TABLE empleados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  cargo VARCHAR(100),
  email VARCHAR(255),
  telefono VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Paso 3: Usar las Conexiones en tu Código

La aplicación ya incluye el archivo `lib/db.ts` con las funciones helper para conectar a MySQL:

\`\`\`typescript
import { query } from '@/lib/db'

// Ejemplo: Obtener todos los pedidos
const pedidos = await query('SELECT * FROM pedidos ORDER BY fecha DESC')

// Ejemplo: Insertar un nuevo pedido
const result = await query(
  'INSERT INTO pedidos (cliente_id, total, estado) VALUES (?, ?, ?)',
  [clienteId, total, 'Pendiente']
)
\`\`\`

## 📦 Instalación

\`\`\`bash
# Instalar dependencias (si es necesario)
npm install mysql2

# Ejecutar en desarrollo
npm run dev
\`\`\`

## 🎨 Tecnologías Utilizadas

- **Next.js 16** con App Router
- **React 19.2**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **MySQL2** para base de datos
- **TypeScript**

## 📱 Rutas de la Aplicación

- `/` - Página principal con acceso a todos los módulos
- `/dashboard` - Panel de control con métricas
- `/pedidos` - Lista de pedidos
- `/pedidos/nuevo` - Crear nuevo pedido
- `/pedidos/[id]` - Detalle de pedido
- `/pedidos/[id]/confirmacion` - Confirmación de pedido
- `/productos` - Gestión de productos
- `/inventario` - Control de inventario
- `/reportes` - Generación de reportes
- `/clientes` - Gestión de clientes y empleados

## 🔗 Conectar con tu Base de Datos Existente

Como mencionaste que ya tienes una base de datos MySQL deployada:

1. Obtén las credenciales de conexión (host, usuario, contraseña, nombre de BD)
2. Agrégalas como variables de entorno en tu proyecto
3. Adapta las consultas SQL en los endpoints de la API según tu esquema existente
4. La aplicación usará el pool de conexiones configurado en `lib/db.ts`

¡Tu aplicación está lista para conectarse a tu base de datos MySQL existente!
