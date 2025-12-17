"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ShoppingBag, DollarSign, AlertCircle, Package, Clock, Users } from "lucide-react"

export default function DashboardPage() {
  const [ventasHoy, setVentasHoy] = useState(0)
  const [pedidosActivos, setPedidosActivos] = useState(0)
  const [productosVendidos, setProductosVendidos] = useState(0)
  const [stockBajo, setStockBajo] = useState(0)
  const [productosMasVendidos, setProductosMasVendidos] = useState<any[]>([])
  const [pedidosRecientes, setPedidosRecientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Ventas de hoy
        const hoy = new Date().toISOString().split('T')[0]
        const ventasRes = await fetch(`/api/reportes?type=ventas`)
        const ventasData = await ventasRes.json()
        if (ventasData.ok && ventasData.report) {
          const ventaHoy = ventasData.report.find((v: any) => v.fecha === hoy)
          setVentasHoy(Number(ventaHoy?.total_venta || 0))
        }

        // Pedidos activos
        const pedidosRes = await fetch("/api/pedidos")
        const pedidosData = await pedidosRes.json()
        if (pedidosData.pedidos) {
          const activos = pedidosData.pedidos.filter((p: any) => 
            p.Estado === "En preparación" || p.Estado === "Pagado"
          )
          setPedidosActivos(activos.length)
          setPedidosRecientes(pedidosData.pedidos.slice(0, 5))
        }

        // Productos vendidos hoy
        const productosRes = await fetch(`/api/reportes?type=productos_vendidos`)
        const productosData = await productosRes.json()
        if (productosData.ok && productosData.report) {
          const totalVendido = productosData.report.reduce((sum: number, p: any) => 
            sum + Number(p.total_vendido || 0), 0
          )
          setProductosVendidos(totalVendido)
          setProductosMasVendidos(productosData.report.slice(0, 5))
        }

        // Stock bajo
        const stockRes = await fetch(`/api/reportes?type=insumos_bajo_stock`)
        const stockData = await stockRes.json()
        if (stockData.ok && stockData.report) {
          setStockBajo(stockData.report.length)
        }
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  const calcularPorcentaje = (ventas: number, maxVentas: number) => {
    if (maxVentas === 0) return 0
    return Math.round((ventas / maxVentas) * 100)
  }

  const maxVentas = productosMasVendidos.length > 0 
    ? Math.max(...productosMasVendidos.map((p: any) => Number(p.total_vendido || 0)))
    : 1

  const getTiempoRelativo = (fecha: string) => {
    if (!fecha) return "N/A"
    const ahora = new Date()
    const fechaPedido = new Date(fecha)
    const diffMs = ahora.getTime() - fechaPedido.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "Hace menos de 1 min"
    if (diffMins < 60) return `Hace ${diffMins} min`
    const diffHoras = Math.floor(diffMins / 60)
    if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`
    const diffDias = Math.floor(diffHoras / 24)
    return `Hace ${diffDias} día${diffDias > 1 ? 's' : ''}`
  }

  const getEstadoVariant = (estado: string) => {
    switch (estado) {
      case "Entregado": return "default" as const
      case "En preparación": return "outline" as const
      case "Pagado": return "secondary" as const
      case "Cancelado": return "destructive" as const
      default: return "secondary" as const
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Entregado": return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "En preparación": return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
      case "Pagado": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "Cancelado": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default: return ""
    }
  }

  if (loading) {
    return <div className="p-6">Cargando dashboard...</div>
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen ejecutivo y métricas clave de StarBugs Coffee
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Ventas Hoy</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${ventasHoy.toFixed(2)}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-muted-foreground">Ventas de hoy</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-accent">Pedidos Activos</CardTitle>
              <div className="p-2 bg-accent/10 rounded-lg">
                <ShoppingBag className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{pedidosActivos}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">En proceso</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/5 to-info/10 border-info/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-info">Productos Vendidos</CardTitle>
              <div className="p-2 bg-info/10 rounded-lg">
                <Package className="h-4 w-4 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{productosVendidos}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-muted-foreground">Total unidades</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Stock Bajo</CardTitle>
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stockBajo}</div>
              <div className="mt-1">
                <Badge variant="destructive" className="text-xs">Requiere atención</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Productos Más Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productosMasVendidos.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No hay datos de productos vendidos
                  </div>
                ) : (
                  productosMasVendidos.map((producto: any, i: number) => {
                    const ventas = Number(producto.total_vendido || 0)
                    const porcentaje = calcularPorcentaje(ventas, maxVentas)
                    const colores = ["bg-primary", "bg-accent", "bg-warning", "bg-info", "bg-success"]
                    const color = colores[i % colores.length]
                    
                    return (
                      <div key={producto.ID_Producto || i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{producto.producto_nombre || producto.Nombre}</span>
                          <Badge variant="secondary">{ventas} vendidos</Badge>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full ${color} transition-all rounded-full`} style={{ width: `${porcentaje}%` }} />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Pedidos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pedidosRecientes.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No hay pedidos recientes
                  </div>
                ) : (
                  pedidosRecientes.map((pedido: any) => (
                    <div
                      key={pedido.id || pedido.ID_Pedido}
                      className="flex items-start justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">#{pedido.id || pedido.ID_Pedido}</span>
                          <Badge 
                            variant={getEstadoVariant(pedido.Estado)} 
                            className={`text-xs font-medium border ${getEstadoColor(pedido.Estado)}`}
                          >
                            {pedido.Estado}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">{pedido.cliente_nombre || "Cliente desconocido"}</p>
                        <p className="text-xs text-muted-foreground">
                          {pedido.total_items || 0} producto{pedido.total_items !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-primary">
                          ${Number(pedido.total_precio || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTiempoRelativo(pedido.Fecha_Hora)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
