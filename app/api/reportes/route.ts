import { query } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type') || 'ventas'
    
    if (type === 'ventas') {
      // Ventas por día
      const rows = await query(`
        SELECT 
          DATE(p.Fecha_Hora) as fecha, 
          COUNT(DISTINCT p.ID_Pedido) as total_pedidos, 
          COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as total_venta 
        FROM Pedido p 
        LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido 
        GROUP BY DATE(p.Fecha_Hora) 
        ORDER BY fecha DESC 
        LIMIT 30
      `)
      return new Response(JSON.stringify({ ok: true, report: rows }), { headers: { 'Content-Type': 'application/json' } })
    }
    
    if (type === 'productos_vendidos') {
      // Productos más vendidos
      const rows = await query(`
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
      `)
      return new Response(JSON.stringify({ ok: true, report: rows }), { headers: { 'Content-Type': 'application/json' } })
    }
    
    if (type === 'insumos_bajo_stock') {
      // Insumos con bajo stock
      const rows = await query(`
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
      `)
      return new Response(JSON.stringify({ ok: true, report: rows }), { headers: { 'Content-Type': 'application/json' } })
    }
    
    if (type === 'ventas_mensuales') {
      // Ventas mensuales
      const rows = await query(`
        SELECT 
          DATE_FORMAT(p.Fecha_Hora, '%Y-%m') as mes,
          COUNT(DISTINCT p.ID_Pedido) as total_pedidos,
          COALESCE(SUM(dp.Cantidad * dp.Precio_Unitario), 0) as total_venta
        FROM Pedido p
        LEFT JOIN Detalle_Pedido dp ON p.ID_Pedido = dp.ID_Pedido
        GROUP BY DATE_FORMAT(p.Fecha_Hora, '%Y-%m')
        ORDER BY mes DESC
        LIMIT 12
      `)
      return new Response(JSON.stringify({ ok: true, report: rows }), { headers: { 'Content-Type': 'application/json' } })
    }
    
    return new Response(JSON.stringify({ ok: false, error: 'Unknown report type' }), { status: 400 })
  } catch (err) {
    console.error('GET /api/reportes error', err)
    return new Response(JSON.stringify({ ok: false, error: 'Error generating report' }), { status: 500 })
  }
}
