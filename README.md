# StarBugs Coffee - Panel de Control Empresarial

Sistema completo de gestión empresarial para StarBugs Coffee. Permite la administración centralizada de pedidos, control de inventario, gestión de clientes, seguimiento de mesas, y visualización de analíticas y reportes en tiempo real.

---

## 📑 Índice

- [🚀 Funcionalidades](#-funcionalidades)
- [🎨 Tecnologías Utilizadas](#-tecnologias-utilizadas)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [🌐 Arquitectura y Conexiones API (Endpoints)](#-arquitectura-y-conexiones-api-endpoints)
- [📱 Rutas de la Aplicación (Frontend)](#-rutas-de-la-aplicacion-frontend)
- [📦 Instalación y Ejecución Local](#-instalacion-y-ejecucion-local)

---

## 🚀 Funcionalidades

### Módulos Principales
- **Panel de Control (Dashboard)**: Métricas, gráficas y estadísticas en tiempo real sobre ventas e ingresos.
- **Gestión de Pedidos**: Administración completa de órdenes tanto en la modalidad Local (Mesas) como Domicilio.
- **Gestión de Productos e Inventario**: Catálogo interactivo de productos y control de insumos y materiales con monitoreo de existencias.
- **Facturación**: Control de facturas generadas por ventas y pedidos.
- **Personal y Clientes**: Bases de datos integradas para clientes y asignación de roles al personal (Preparador, Entregador, Mesero, Cajero).
- **Generación de Reportes**: Visualización analítica de ingresos, salidas de stock y movimientos.

### UI & UX
- Interfaz moderna, responsiva y adaptable a dispositivos móviles (tema claro/oscuro).
- Formularios interactivos y validaciones seguras (React Hook Form + Zod).
- Gráficos integrados (Recharts) y microinteracciones en las vistas.

---

## 🎨 Tecnologías Utilizadas

- **Frontend Core**: Next.js v16 (App Router) + React 19.x + TypeScript.
- **Estilos**: Tailwind CSS v4 para diseño con utilidades rápidas.
- **Componentes**: Patrones accesibles de **Radix UI** y **shadcn/ui** integrados.
- **Iconografía**: Lucide React.
- **Validaciones**: React Hook Form y Zod.
- **Gráficos**: Recharts.

---

## 📂 Estructura del Proyecto

La organización principal sigue los estándares modernos de Next.js:

```text
StarBugs-Coffee/
├── app/                  # Directorio central App Router
│   ├── api/              # Proxy Endpoints de Next.js
│   ├── dashboard/        # Vista principal estadística
│   ├── pedidos/          # Gestión y creación de órdenes (Local/Domicilio)
│   ├── clientes/         # Administración de clientes registrados
│   ├── productos/        # Catálogo de productos disponibles
│   ├── inventario/       # Carga y revisión de insumos/materiales
│   ├── proveedores/      # Administración de proveedores
│   ├── reportes/         # Panel de reportes de ventas
│   └── (Otras vistas)
├── components/           # Componentes UI reutilizables (Botones, Modales, Tarjetas)
├── hooks/                # Hooks personalizados de lógica de React
├── lib/                  # Código y lógica global 
│   └── api.ts            # Utilidad principal que conecta con la API externa en Render
├── public/               # Imágenes, SVGs y fuentes estáticas
├── styles/               # Definiciones globales de CSS
├── next.config.mjs       # Configuración global del framework Next.js
├── tailwind.config.*     # Configuración de los temas y variables de diseño
└── package.json          # Dependencias NPM de la aplicación web
```

---

## 🌐 Arquitectura y Conexiones API (Endpoints)

La plataforma utiliza una arquitectura separada (Client-Proxy-Server). Toda la interacción está configurada para conectar a un backend REST externo de manera centralizada.

### 1. El Cliente Global (`lib/api.ts`)
El frontend envía todas las peticiones a un servicio alojado en Render:
- **API URL Base:** `https://api-starbugs.onrender.com`
- Utiliza la función wrapper `apiFetch` que configura el encabezado estandarizado (`application/json`) y maneja o mitiga los errores de respuesta de forma global.

### 2. Capa Proxy (Next.js API Routes)
Para evitar problemas de CORS y empaquetar de forma estructurada las consultas, todas las llamadas del frontend apuntan primero hacia rutas internas dentro de la carpeta `app/api/`. Estas reciben la petición en Next.js y luego hacen forward (proxy) de la solicitud a la URL de Render.

#### Endpoints Internos que actúan como puentes:
- `/api/categorias` - Listado y gestión de categorías de productos.
- `/api/clientes` - Clientes (GET, POST, GET by id).
- `/api/estados` - Catálogo de estados de pedidos.
- `/api/facturas` - Consumo y creación de recibos.
- `/api/insumos` e `/api/insumos-materiales` - Control de stock.
- `/api/mesas` - Listado de mesas (Capacidad, Estados, Ubicación).
- `/api/movimientos` - Histórico de salidas o entradas de stock.
- `/api/pedidos` - Generación de comandas (GET, POST, PUT, DELETE).
- `/api/personas` - Personal y cargos (Preparadores, Cajeros, etc).
- `/api/productos` - Ítems para venta general.
- `/api/proveedores` - Gestión de terceros.
- `/api/recetas` - Ensamblado de productos.
- `/api/reportes` - Información consolidada para gráficas.
- `/api/roles` - Permisos del sistema y etiquetas.

---

## 📱 Rutas de la Aplicación (Frontend)

Módulos principales a los que puede acceder mediante la navegación:

- `/` - Página de presentación u Onboarding principal.
- `/dashboard` - Panel analítico con indicadores principales.
- `/pedidos` - Tabla base de historial de todos los pedidos.
- `/pedidos/nuevo` - Interfaz para crear una orden (Seleccionar mesas, productos y cliente).
- `/pedidos/[id]` - Pestaña de inspección de un pedido (Para accionar cambios de estado y preparadores).
- `/productos` - Panel visual del catálogo de los cafés y repostería.
- `/inventario` - Acceso a materias primas e insumos contabilizados.
- `/clientes` y `/proveedores` - Relaciones de negocio y tablas informativas.
- `/facturas` y `/reportes` - Consolidado de tickets procesados y gráficos de corte mensual.

---

## 📦 Instalación y Ejecución Local

Si deseas correr la aplicación internamente para fines de desarrollo o integración de mejoras, sigue esta guía:

### Prerrequisitos
- **Node.js** (v18.x o superior)
- Conexión a internet ininterrumpida que pueda conectarse con `https://api-starbugs.onrender.com`.

### 1. Clonar este Proyecto
```bash
git clone https://github.com/rmedina13118/StarBugs-Coffee.git
cd StarBugs-Coffee
```

### 2. Instalar Dependencias del Frontend
El entorno usa NPM para empaquetar, aunque puedes usar Yarn, pnpm o Bun.
```bash
# Instalación de paquetes
npm install
```

*(Opcional - Solución al límite de Inotify Files)*
En algunas configuraciones y distribuciones de Linux es posible que Next.js agote el número de watchers. Para incrementar el límite corre:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### 3. Ejecutar el Servidor Local
Despliega la aplicación en formato `dev` para permitir Recarga Automática:
```bash
npm run dev
```

### 4. Abrir la Aplicación
Dirígete a tu navegador en la siguiente dirección:
📍 **`http://localhost:3000`**

Dada la arquitectura construida, las peticiones hacia la base de datos se harán en automático y de manera remota consumiendo la URL de Render integrada en la configuración proxy local, por lo que no necesitarás desplegar un servidor DB MySQL en tu máquina.
