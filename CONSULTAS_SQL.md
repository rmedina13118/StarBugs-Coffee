# Documentación de Consultas SQL - Sistema StarBugs Coffee

Este documento contiene todas las consultas SQL utilizadas en el sistema, organizadas por tabla y operación.

---

## 📋 TABLA: Categoria

### GET - Obtener todas las categorías
**Archivo:** `app/api/categorias/route.ts`
```sql
SELECT * FROM Categoria ORDER BY Nombre
```
**Descripción:** Obtiene todas las categorías ordenadas por nombre.

---

### GET - Obtener categoría por ID
**Archivo:** `app/api/categorias/[id]/route.ts`
```sql
SELECT * FROM Categoria WHERE ID_Categoria = ?
```
**Descripción:** Obtiene una categoría específica por su ID.

---

### POST - Crear nueva categoría
**Archivo:** `app/api/categorias/route.ts`
```sql
INSERT INTO Categoria (Nombre, Descripcion) VALUES (?, ?)
```
**Descripción:** Inserta una nueva categoría con nombre y descripción.

---

### PATCH - Actualizar categoría
**Archivo:** `app/api/categorias/[id]/route.ts`
```sql
UPDATE Categoria SET Nombre = ?, Descripcion = ? WHERE ID_Categoria = ?
```
**Descripción:** Actualiza el nombre y/o descripción de una categoría existente.

---

### DELETE - Eliminar categoría
**Archivo:** `app/api/categorias/[id]/route.ts`
```sql
DELETE FROM Categoria WHERE ID_Categoria = ?
```
**Descripción:** Elimina una categoría por su ID.

---

## 👥 TABLA: Cliente

### GET - Obtener todos los clientes
**Archivo:** `app/api/clientes/route.ts`
```sql
SELECT 
  ID_Cliente as id,
  Nombre as Nombre,
  Email as Email,
  Telefono as Telefono,
  Fecha_Registro as Fecha_Registro
FROM Cliente
ORDER BY Nombre ASC
LIMIT 100
```
**Descripción:** Obtiene todos los clientes ordenados por nombre, limitado a 100 registros.

---

### GET - Obtener cliente por ID con sus pedidos
**Archivo:** `app/api/clientes/[id]/route.ts`
```sql
-- Obtener cliente
SELECT 
  ID_Cliente as id, 
  Nombre as Nombre, 
  Email as Email, 
  Telefono as Telefono, 
  Fecha_Registro as Fecha_Registro 
FROM Cliente 
WHERE ID_Cliente = ?

-- Obtener pedidos del cliente
SELECT 
  p.ID_Pedido as id, 
  p.Fecha_Hora, 
  p.Estado, 
  COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario),0) as total
FROM Pedido p
LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
WHERE p.ID_Cliente = ?
GROUP BY p.ID_Pedido
ORDER BY p.Fecha_Hora DESC
LIMIT 50
```
**Descripción:** Obtiene un cliente específico y todos sus pedidos con el total calculado.

---

### POST - Crear nuevo cliente
**Archivo:** `app/api/clientes/route.ts`
```sql
INSERT INTO Cliente (Nombre, Email, Telefono) VALUES (?, ?, ?)
```
**Descripción:** Inserta un nuevo cliente con nombre, email y teléfono.

---

### PATCH - Actualizar cliente
**Archivo:** `app/api/clientes/[id]/route.ts`
```sql
UPDATE Cliente SET Nombre = ?, Email = ?, Telefono = ? WHERE ID_Cliente = ?
```
**Descripción:** Actualiza los datos de un cliente (nombre, email, teléfono).

---

### DELETE - Eliminar cliente
**Archivo:** `app/api/clientes/[id]/route.ts`
```sql
-- Verificar si tiene pedidos
SELECT COUNT(*) as c FROM Pedido WHERE ID_Cliente = ?

-- Eliminar cliente
DELETE FROM Cliente WHERE ID_Cliente = ?
```
**Descripción:** Verifica si el cliente tiene pedidos asociados antes de eliminarlo. Si tiene pedidos, no se puede eliminar.

---

## 👨‍💼 TABLA: Empleado

### GET - Obtener todos los empleados
**Archivo:** `app/api/empleados/route.ts`
```sql
SELECT * FROM Empleado ORDER BY Nombre
```
**Descripción:** Obtiene todos los empleados ordenados por nombre.

---

### GET - Obtener empleado por ID
**Archivo:** `app/api/empleados/[id]/route.ts`
```sql
SELECT * FROM Empleado WHERE ID_Empleado = ?
```
**Descripción:** Obtiene un empleado específico por su ID.

---

### POST - Crear nuevo empleado
**Archivo:** `app/api/empleados/route.ts`
```sql
INSERT INTO Empleado (Nombre, Puesto, Email, Telefono) VALUES (?, ?, ?, ?)
```
**Descripción:** Inserta un nuevo empleado con nombre, puesto, email y teléfono.

---

### PATCH - Actualizar empleado
**Archivo:** `app/api/empleados/[id]/route.ts`
```sql
UPDATE Empleado SET Nombre = ?, Email = ?, Telefono = ? WHERE ID_Empleado = ?
```
**Descripción:** Actualiza los datos de un empleado (nombre, email, teléfono).

---

### DELETE - Eliminar empleado
**Archivo:** `app/api/empleados/[id]/route.ts`
```sql
DELETE FROM Empleado WHERE ID_Empleado = ?
```
**Descripción:** Elimina un empleado por su ID.

---

## ☕ TABLA: Producto

### GET - Obtener todos los productos con categoría
**Archivo:** `app/api/productos/route.ts`
```sql
SELECT 
  p.ID_Producto,
  p.Nombre,
  p.Precio,
  p.ID_Categoria,
  p.Descripcion,
  p.Disponibilidad,
  c.Nombre as Categoria_Nombre,
  c.Descripcion as Categoria_Descripcion
FROM Producto p
LEFT JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria
ORDER BY p.Nombre
```
**Descripción:** Obtiene todos los productos con información de su categoría mediante LEFT JOIN.

---

### GET - Obtener producto por ID
**Archivo:** `app/api/productos/[id]/route.ts`
```sql
SELECT * FROM PRODUCTO WHERE ID_Producto = ?
```
**Descripción:** Obtiene un producto específico por su ID.

---

### POST - Crear nuevo producto
**Archivo:** `app/api/productos/route.ts`
```sql
INSERT INTO Producto (Nombre, Precio, ID_Categoria, Descripcion, Disponibilidad) VALUES (?, ?, ?, ?, ?)
```
**Descripción:** Inserta un nuevo producto con nombre, precio, categoría, descripción y disponibilidad.

---

### PUT - Actualizar producto
**Archivo:** `app/api/productos/[id]/route.ts`
```sql
UPDATE PRODUCTO SET Nombre = ?, Precio = ?, ID_Categoria = ?, Descripcion = ?, Disponibilidad = ? WHERE ID_Producto = ?
```
**Descripción:** Actualiza todos los campos de un producto.

---

### DELETE - Eliminar producto
**Archivo:** `app/api/productos/[id]/route.ts`
```sql
DELETE FROM PRODUCTO WHERE ID_Producto = ?
```
**Descripción:** Elimina un producto por su ID.

---

## 📦 TABLA: Insumo

### GET - Obtener todos los insumos
**Archivo:** `app/api/insumos/route.ts`
```sql
SELECT * FROM Insumo ORDER BY Nombre
```
**Descripción:** Obtiene todos los insumos ordenados por nombre.

---

### GET - Obtener insumo por ID
**Archivo:** `app/api/insumos/[id]/route.ts`
```sql
SELECT * FROM Insumo WHERE ID_Insumo = ?
```
**Descripción:** Obtiene un insumo específico por su ID.

---

### POST - Crear nuevo insumo
**Archivo:** `app/api/insumos/route.ts`
```sql
INSERT INTO Insumo (Nombre, Stock_Actual, Stock_Minimo, Precio_Unidad, Unidad_Medida) VALUES (?, ?, ?, ?, ?)
```
**Descripción:** Inserta un nuevo insumo con nombre, stock actual, stock mínimo, precio por unidad y unidad de medida.

---

### PATCH - Actualizar insumo
**Archivo:** `app/api/insumos/[id]/route.ts`
```sql
UPDATE Insumo SET Nombre = ?, Stock = ?, Unidad = ? WHERE ID_Insumo = ?
```
**Descripción:** Actualiza los campos de un insumo (nombre, stock, unidad).

---

### DELETE - Eliminar insumo
**Archivo:** `app/api/insumos/[id]/route.ts`
```sql
DELETE FROM Insumo WHERE ID_Insumo = ?
```
**Descripción:** Elimina un insumo por su ID.

---

## 🏢 TABLA: Proveedor

### GET - Obtener todos los proveedores
**Archivo:** `app/api/proveedores/route.ts`
```sql
SELECT * FROM Proveedor ORDER BY Nombre
```
**Descripción:** Obtiene todos los proveedores ordenados por nombre.

---

### GET - Obtener proveedor por ID
**Archivo:** `app/api/proveedores/[id]/route.ts`
```sql
SELECT * FROM Proveedor WHERE ID_Proveedor = ?
```
**Descripción:** Obtiene un proveedor específico por su ID.

---

### POST - Crear nuevo proveedor
**Archivo:** `app/api/proveedores/route.ts`
```sql
INSERT INTO Proveedor (Nombre, Telefono, Email, Calle, Numero_Calle, Ciudad, Codigo_Postal) VALUES (?, ?, ?, ?, ?, ?, ?)
```
**Descripción:** Inserta un nuevo proveedor con todos sus datos de contacto y dirección.

---

### PATCH - Actualizar proveedor
**Archivo:** `app/api/proveedores/[id]/route.ts`
```sql
UPDATE Proveedor SET Nombre = ?, Contacto = ?, Telefono = ? WHERE ID_Proveedor = ?
```
**Descripción:** Actualiza los datos de un proveedor (nombre, contacto, teléfono).

---

### DELETE - Eliminar proveedor
**Archivo:** `app/api/proveedores/[id]/route.ts`
```sql
DELETE FROM Proveedor WHERE ID_Proveedor = ?
```
**Descripción:** Elimina un proveedor por su ID.

---

## 🛒 TABLA: Pedido

### GET - Obtener todos los pedidos
**Archivo:** `app/api/pedidos/route.ts`
```sql
SELECT 
  p.ID_Pedido as id,
  p.Fecha_Hora,
  p.Estado,
  c.Nombre as cliente_nombre,
  e.Nombre as empleado_nombre,
  COUNT(dp.ID_Detalle) as total_items,
  COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as total_precio
FROM Pedido p
LEFT JOIN Cliente c ON p.ID_Cliente = c.ID_Cliente  
LEFT JOIN Empleado e ON p.ID_Empleado = e.ID_Empleado
LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
GROUP BY p.ID_Pedido, p.Fecha_Hora, p.Estado, c.Nombre, e.Nombre
ORDER BY p.Fecha_Hora DESC 
LIMIT 100
```
**Descripción:** Obtiene todos los pedidos con información del cliente, empleado, cantidad de items y total calculado.

---

### GET - Obtener pedido por ID con detalles
**Archivo:** `app/api/pedidos/[id]/route.ts`
```sql
-- Obtener información del pedido
SELECT 
  p.ID_Pedido as id,
  p.Fecha_Hora,
  p.Estado,
  p.ID_Cliente,
  p.ID_Empleado,
  c.Nombre as cliente_nombre,
  c.Email as cliente_email,
  c.Telefono as cliente_telefono,
  e.Nombre as empleado_nombre,
  COUNT(dp.ID_Detalle) as total_items,
  COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as total_precio
FROM Pedido p
LEFT JOIN Cliente c ON p.ID_Cliente = c.ID_Cliente  
LEFT JOIN Empleado e ON p.ID_Empleado = e.ID_Empleado
LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
WHERE p.ID_Pedido = ?
GROUP BY p.ID_Pedido

-- Obtener detalles del pedido
SELECT 
  dp.ID_Detalle,
  dp.ID_Producto,
  dp.Cantidad,
  dp.Precio_Unitario,
  pr.Nombre as producto_nombre
FROM Detalle_Pedido dp
LEFT JOIN Producto pr ON dp.ID_Producto = pr.ID_Producto
WHERE dp.ID_Pedido = ?
```
**Descripción:** Obtiene un pedido específico con toda su información y los detalles de productos asociados.

---

### POST - Crear nuevo pedido
**Archivo:** `app/api/pedidos/route.ts`
```sql
INSERT INTO Pedido (ID_Cliente, ID_Empleado, Fecha_Hora) VALUES (?, ?, NOW())
```
**Descripción:** Inserta un nuevo pedido con cliente, empleado y fecha/hora actual.

---

### PATCH - Actualizar estado del pedido
**Archivo:** `app/api/pedidos/[id]/route.ts`
```sql
UPDATE Pedido SET Estado = ? WHERE ID_Pedido = ?
```
**Descripción:** Actualiza el estado de un pedido (Entregado, En preparación, Cancelado, Pagado).

---

### DELETE - Eliminar pedido
**Archivo:** `app/api/pedidos/[id]/route.ts`
```sql
-- Verificar si el pedido existe
SELECT ID_Pedido FROM Pedido WHERE ID_Pedido = ?

-- Eliminar detalles primero (por Foreign Key)
DELETE FROM Detalle_Pedido WHERE ID_Pedido = ?

-- Eliminar pedido
DELETE FROM Pedido WHERE ID_Pedido = ?
```
**Descripción:** Elimina un pedido y todos sus detalles. Primero elimina los detalles por las restricciones de Foreign Key.

---

## 📝 TABLA: Detalle_Pedido

### GET - Obtener detalles de un pedido
**Archivo:** `app/api/pedidos/[id]/detalles/route.ts`
```sql
SELECT 
  dp.ID_Detalle,
  dp.ID_Producto,
  dp.Cantidad,
  dp.Precio_Unitario,
  (dp.Cantidad * dp.Precio_Unitario) as subtotal,
  pr.Nombre as producto_nombre,
  pr.Descripcion
FROM Detalle_Pedido dp
LEFT JOIN Producto pr ON dp.ID_Producto = pr.ID_Producto
WHERE dp.ID_Pedido = ?
ORDER BY dp.ID_Detalle
```
**Descripción:** Obtiene todos los detalles (productos) de un pedido específico con información del producto y subtotal calculado.

---

### POST - Agregar detalle a pedido (con descuento automático de insumos)
**Archivo:** `app/api/pedidos/[id]/detalles/route.ts`
```sql
-- 1. Obtener recetas del producto
SELECT ID_Insumo, Cantidad FROM Receta WHERE ID_Producto = ?

-- 2. Verificar stock disponible (por cada insumo en la receta)
SELECT Stock_Actual FROM Insumo WHERE ID_Insumo = ?

-- 3. Obtener nombre del insumo (si hay error de stock)
SELECT Nombre FROM Insumo WHERE ID_Insumo = ?

-- 4. Insertar detalle del pedido
INSERT INTO Detalle_Pedido (ID_Pedido, ID_Producto, Cantidad, Precio_Unitario) VALUES (?, ?, ?, ?)

-- 5. Crear movimiento de salida (por cada insumo)
INSERT INTO Movimiento_Insumo (ID_Insumo, ID_Pedido, Tipo, Cantidad) VALUES (?, ?, 'Salida', ?)

-- 6. Actualizar stock del insumo (por cada insumo)
UPDATE Insumo SET Stock_Actual = Stock_Actual - ? WHERE ID_Insumo = ?
```
**Descripción:** Agrega un producto al pedido y automáticamente descuenta los insumos necesarios según la receta. Verifica stock antes de procesar.

---

### PATCH - Actualizar detalle de pedido
**Archivo:** `app/api/pedidos/[id]/detalles/[detalleId]/route.ts`
```sql
UPDATE Detalle_Pedido SET Cantidad = ?, Precio_Unitario = ? WHERE ID_Detalle = ? AND ID_Pedido = ?
```
**Descripción:** Actualiza la cantidad y precio unitario de un detalle específico del pedido.

---

### DELETE - Eliminar detalle de pedido
**Archivo:** `app/api/pedidos/[id]/detalles/[detalleId]/route.ts`
```sql
DELETE FROM Detalle_Pedido WHERE ID_Detalle = ? AND ID_Pedido = ?
```
**Descripción:** Elimina un detalle específico de un pedido.

---

## 🧾 TABLA: Factura

### GET - Obtener todas las facturas
**Archivo:** `app/api/facturas/route.ts`
```sql
SELECT 
  f.ID_Factura,
  f.ID_Pedido,
  f.Fecha_Emision,
  f.Metodo_Pago,
  p.Fecha_Hora as Fecha_Pedido,
  c.Nombre as Cliente_Nombre,
  COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as Total
FROM Factura f
LEFT JOIN Pedido p ON f.ID_Pedido = p.ID_Pedido
LEFT JOIN Cliente c ON p.ID_Cliente = c.ID_Cliente
LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
GROUP BY f.ID_Factura, f.ID_Pedido, f.Fecha_Emision, f.Metodo_Pago, p.Fecha_Hora, c.Nombre
ORDER BY f.Fecha_Emision DESC 
LIMIT 200
```
**Descripción:** Obtiene todas las facturas con información del pedido, cliente y total calculado.

---

### GET - Obtener factura por ID
**Archivo:** `app/api/facturas/[id]/route.ts`
```sql
SELECT * FROM Factura WHERE ID_Factura = ?
```
**Descripción:** Obtiene una factura específica por su ID.

---

### POST - Crear nueva factura
**Archivo:** `app/api/facturas/route.ts`
```sql
INSERT INTO Factura (ID_Pedido, Metodo_Pago) VALUES (?, ?)
```
**Descripción:** Inserta una nueva factura asociada a un pedido con método de pago.

---

### DELETE - Eliminar factura
**Archivo:** `app/api/facturas/[id]/route.ts`
```sql
DELETE FROM Factura WHERE ID_Factura = ?
```
**Descripción:** Elimina una factura por su ID.

---

## 📋 TABLA: Receta

### GET - Obtener todas las recetas
**Archivo:** `app/api/recetas/route.ts`
```sql
SELECT 
  r.ID_Receta,
  r.ID_Producto,
  r.ID_Insumo,
  r.Cantidad,
  p.Nombre as Producto_Nombre,
  i.Nombre as Insumo_Nombre,
  i.Unidad_Medida
FROM Receta r
LEFT JOIN Producto p ON r.ID_Producto = p.ID_Producto
LEFT JOIN Insumo i ON r.ID_Insumo = i.ID_Insumo
ORDER BY p.Nombre, i.Nombre
```
**Descripción:** Obtiene todas las recetas con información del producto e insumo mediante JOINs.

---

### GET - Obtener receta por ID
**Archivo:** `app/api/recetas/[id]/route.ts`
```sql
SELECT * FROM Receta WHERE ID_Receta = ?
```
**Descripción:** Obtiene una receta específica por su ID.

---

### POST - Crear nueva receta
**Archivo:** `app/api/recetas/route.ts`
```sql
INSERT INTO Receta (ID_Producto, ID_Insumo, Cantidad) VALUES (?, ?, ?)
```
**Descripción:** Inserta una nueva receta que relaciona un producto con un insumo y la cantidad necesaria.

---

### PATCH - Actualizar receta
**Archivo:** `app/api/recetas/[id]/route.ts`
```sql
UPDATE Receta SET Nombre = ?, Instrucciones = ? WHERE ID_Receta = ?
```
**Descripción:** Actualiza los campos de una receta (nombre, instrucciones).

---

### DELETE - Eliminar receta
**Archivo:** `app/api/recetas/[id]/route.ts`
```sql
DELETE FROM Receta WHERE ID_Receta = ?
```
**Descripción:** Elimina una receta por su ID.

---

## 📊 TABLA: Movimiento_Insumo

### GET - Obtener todos los movimientos
**Archivo:** `app/api/movimientos/route.ts`
```sql
SELECT 
  m.ID_Movimiento,
  m.ID_Insumo,
  m.ID_Proveedor,
  m.ID_Pedido,
  m.Tipo,
  m.Cantidad,
  m.Fecha,
  i.Nombre as Insumo_Nombre,
  p.Nombre as Proveedor_Nombre
FROM Movimiento_Insumo m
LEFT JOIN Insumo i ON m.ID_Insumo = i.ID_Insumo
LEFT JOIN Proveedor p ON m.ID_Proveedor = p.ID_Proveedor
ORDER BY m.Fecha DESC 
LIMIT 200
```
**Descripción:** Obtiene todos los movimientos de insumos con información del insumo y proveedor, ordenados por fecha descendente.

---

### GET - Obtener movimiento por ID
**Archivo:** `app/api/movimientos/[id]/route.ts`
```sql
SELECT * FROM Movimiento_Insumo WHERE ID_Movimiento = ?
```
**Descripción:** Obtiene un movimiento específico por su ID.

---

### POST - Crear movimiento (con actualización automática de stock)
**Archivo:** `app/api/movimientos/route.ts`
```sql
-- 1. Insertar movimiento
INSERT INTO Movimiento_Insumo (ID_Insumo, ID_Proveedor, ID_Pedido, Tipo, Cantidad) VALUES (?, ?, ?, ?, ?)

-- 2. Si es Entrada, aumentar stock
UPDATE Insumo SET Stock_Actual = Stock_Actual + ? WHERE ID_Insumo = ?

-- 3. Si es Salida, disminuir stock
UPDATE Insumo SET Stock_Actual = Stock_Actual - ? WHERE ID_Insumo = ?
```
**Descripción:** Crea un movimiento de insumo (Entrada o Salida) y actualiza automáticamente el stock del insumo correspondiente.

---

### DELETE - Eliminar movimiento
**Archivo:** `app/api/movimientos/[id]/route.ts`
```sql
DELETE FROM Movimiento_Insumo WHERE ID_Movimiento = ?
```
**Descripción:** Elimina un movimiento por su ID.

---

## 📈 REPORTES (Consultas complejas)

### Reporte: Ventas por día
**Archivo:** `app/api/reportes/route.ts` (type=ventas)
```sql
SELECT 
  DATE(p.Fecha_Hora) as fecha, 
  COUNT(DISTINCT p.ID_Pedido) as total_pedidos, 
  COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as total_venta 
FROM Pedido p 
LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido 
GROUP BY DATE(p.Fecha_Hora) 
ORDER BY fecha DESC 
LIMIT 30
```
**Descripción:** Genera un reporte de ventas agrupadas por día, mostrando cantidad de pedidos y total de ventas.

---

### Reporte: Productos más vendidos
**Archivo:** `app/api/reportes/route.ts` (type=productos_vendidos)
```sql
SELECT 
  p.ID_Producto,
  p.Nombre as producto_nombre,
  SUM(dp.Cantidad) as total_vendido,
  SUM(dp.Cantidad * dp.Precio_Unitario) as total_ingresos
FROM Detalle_Pedido dp
LEFT JOIN Producto p ON dp.ID_Producto = p.ID_Producto
GROUP BY p.ID_Producto, p.Nombre
ORDER BY total_vendido DESC
LIMIT 10
```
**Descripción:** Genera un reporte de los 10 productos más vendidos con cantidad total y ingresos generados.

---

### Reporte: Insumos con bajo stock
**Archivo:** `app/api/reportes/route.ts` (type=insumos_bajo_stock)
```sql
SELECT 
  ID_Insumo,
  Nombre,
  Stock_Actual,
  Stock_Minimo,
  Unidad_Medida,
  (Stock_Actual - Stock_Minimo) as diferencia
FROM Insumo
WHERE Stock_Actual < Stock_Minimo
ORDER BY diferencia ASC
```
**Descripción:** Genera un reporte de insumos que están por debajo del stock mínimo, ordenados por la diferencia más crítica.

---

### Reporte: Ventas mensuales
**Archivo:** `app/api/reportes/route.ts` (type=ventas_mensuales)
```sql
SELECT 
  DATE_FORMAT(p.Fecha_Hora, '%Y-%m') as mes,
  COUNT(DISTINCT p.ID_Pedido) as total_pedidos,
  COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as total_venta
FROM Pedido p
LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
GROUP BY DATE_FORMAT(p.Fecha_Hora, '%Y-%m')
ORDER BY mes DESC
LIMIT 12
```
**Descripción:** Genera un reporte de ventas agrupadas por mes, mostrando los últimos 12 meses con cantidad de pedidos y total de ventas.

---

## 🔄 Operaciones Transaccionales Importantes

### Proceso completo de creación de pedido con descuento de insumos

Cuando se agrega un producto a un pedido (`POST /api/pedidos/[id]/detalles`), se ejecutan las siguientes consultas en secuencia:

1. **Obtener recetas del producto:**
   ```sql
   SELECT ID_Insumo, Cantidad FROM Receta WHERE ID_Producto = ?
   ```

2. **Para cada insumo en la receta:**
   - Verificar stock disponible:
     ```sql
     SELECT Stock_Actual FROM Insumo WHERE ID_Insumo = ?
     ```
   - Si hay stock insuficiente, obtener nombre para el mensaje de error:
     ```sql
     SELECT Nombre FROM Insumo WHERE ID_Insumo = ?
     ```

3. **Insertar detalle del pedido:**
   ```sql
   INSERT INTO Detalle_Pedido (ID_Pedido, ID_Producto, Cantidad, Precio_Unitario) VALUES (?, ?, ?, ?)
   ```

4. **Para cada insumo en la receta:**
   - Crear movimiento de salida:
     ```sql
     INSERT INTO Movimiento_Insumo (ID_Insumo, ID_Pedido, Tipo, Cantidad) VALUES (?, ?, 'Salida', ?)
     ```
   - Actualizar stock:
     ```sql
     UPDATE Insumo SET Stock_Actual = Stock_Actual - ? WHERE ID_Insumo = ?
     ```

**Nota:** Este proceso asegura que el inventario se actualice automáticamente cuando se registra una venta, cumpliendo con el requerimiento funcional de "Descontar insumos del inventario cuando se registra una venta".

---

## 📊 Resumen de Tablas y Operaciones

| Tabla | GET | POST | PATCH/PUT | DELETE | Total Consultas |
|-------|-----|------|-----------|--------|-----------------|
| Categoria | 2 | 1 | 1 | 1 | 5 |
| Cliente | 2 | 1 | 1 | 1 | 5 |
| Empleado | 2 | 1 | 1 | 1 | 5 |
| Producto | 2 | 1 | 1 | 1 | 5 |
| Insumo | 2 | 1 | 1 | 1 | 5 |
| Proveedor | 2 | 1 | 1 | 1 | 5 |
| Pedido | 2 | 1 | 1 | 1 | 5 |
| Detalle_Pedido | 1 | 1* | 1 | 1 | 4 |
| Factura | 2 | 1 | 0 | 1 | 4 |
| Receta | 2 | 1 | 1 | 1 | 5 |
| Movimiento_Insumo | 2 | 1* | 0 | 1 | 4 |
| Reportes | 4 | 0 | 0 | 0 | 4 |

**Total de consultas SQL únicas:** ~60 consultas

\* *Estas operaciones incluyen múltiples consultas SQL en una transacción*

---

## 🔍 Notas Importantes

1. **Uso de LEFT JOIN:** Se utiliza LEFT JOIN en lugar de INNER JOIN para asegurar que se muestren todos los registros principales incluso si no tienen relaciones (ej: pedidos sin detalles).

2. **COALESCE:** Se usa `COALESCE(SUM(...), 0)` para evitar valores NULL en los totales cuando no hay registros relacionados.

3. **Validación de Stock:** El sistema valida el stock disponible antes de permitir una venta, evitando stock negativo.

4. **Actualización Automática:** Los movimientos de insumos actualizan automáticamente el `Stock_Actual` de la tabla `Insumo`.

5. **Integridad Referencial:** Las eliminaciones verifican dependencias antes de eliminar (ej: no se puede eliminar un cliente con pedidos asociados).

6. **Límites de Resultados:** Se aplican límites (LIMIT) en las consultas GET para evitar sobrecarga en consultas grandes.

---

**Última actualización:** Generado automáticamente desde el código fuente del proyecto.


