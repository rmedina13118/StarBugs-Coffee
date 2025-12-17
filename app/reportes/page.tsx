"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Download, TrendingUp, BarChart3, FileText, Calendar, Filter } from "lucide-react"

const chartConfig = {
  total_venta: {
    label: "Ventas",
    color: "#2563eb",
  },
};

export default function ReportesPage() {
  const [ventasMensuales, setVentasMensuales] = useState<any[]>([])
  const [productosVendidos, setProductosVendidos] = useState<any[]>([])
  const [insumosBajoStock, setInsumosBajoStock] = useState<any[]>([])
  const [ventasHoy, setVentasHoy] = useState(0)
  const [totalProductosVendidos, setTotalProductosVendidos] = useState(0)
  const [promedioPedido, setPromedioPedido] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Ventas mensuales
        const ventasRes = await fetch("/api/reportes?type=ventas_mensuales")
        const ventasData = await ventasRes.json()
        if (ventasData.report) {
          const processedVentas = ventasData.report.map((v: any) => ({
            ...v,
            mes: getMesNombre(v.mes),
            total_venta: Number(v.total_venta)
          }));
          setVentasMensuales(processedVentas)
          // Calcular total del mes actual
          const mesActual = new Date().toISOString().slice(0, 7)
          const mesActualData = ventasData.report.find((v: any) => v.mes === mesActual)
          setVentasHoy(Number(mesActualData?.total_venta || 0))
        }

        // Productos más vendidos
        const productosRes = await fetch("/api/reportes?type=productos_vendidos")
        const productosData = await productosRes.json()
        if (productosData.report) {
          setProductosVendidos(productosData.report)
          const total = productosData.report.reduce((sum: number, p: any) => 
            sum + Number(p.total_vendido || 0), 0
          )
          setTotalProductosVendidos(total)
        }

        // Insumos bajo stock
        const stockRes = await fetch("/api/reportes?type=insumos_bajo_stock")
        const stockData = await stockRes.json()
        if (stockData.report) {
          setInsumosBajoStock(stockData.report)
        }

        // Calcular promedio por pedido
        const pedidosRes = await fetch("/api/pedidos")
        const pedidosData = await pedidosRes.json()
        if (pedidosData.pedidos) {
          const totalVentas = pedidosData.pedidos.reduce((sum: number, p: any) => 
            sum + Number(p.total_precio || 0), 0
          )
          const totalPedidos = pedidosData.pedidos.length
          setPromedioPedido(totalPedidos > 0 ? totalVentas / totalPedidos : 0)
        }
      } catch (err) {
        console.error("Error cargando reportes:", err)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  const getMesNombre = (mes: string) => {
    if (!mes) return ""
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const [_, mesNum] = mes.split("-")
    return meses[parseInt(mesNum) - 1] || mesNum
  }

  const maxProductos = productosVendidos.length > 0
    ? Math.max(...productosVendidos.map((p: any) => Number(p.total_vendido || 0)))
    : 1

  if (loading) {
    return <div className="p-6">Cargando reportes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Generación de Reportes</h1>
            <p className="text-muted-foreground">
              Análisis detallado de ventas, productos e inventario
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Periodo
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Ventas del Mes</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${ventasHoy.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-muted-foreground">Ventas del mes actual</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProductosVendidos.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total unidades vendidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insumos Bajo Stock</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insumosBajoStock.length}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Pedido</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${promedioPedido.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Promedio de todos los pedidos</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Ventas Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ventasMensuales.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No hay datos de ventas mensuales
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={ventasMensuales} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="mes"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent
                      formatter={(value) => `$${Number(value).toLocaleString()}`}
                    />}
                  />
                  <Bar dataKey="total_venta" fill="var(--color-total_venta)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Productos Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productosVendidos.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No hay datos de productos vendidos
                </div>
              ) : (
                productosVendidos.slice(0, 5).map((item: any, i: number) => {
                  const ventas = Number(item.total_vendido || 0)
                  const porcentaje = maxProductos > 0 ? (ventas / maxProductos) * 100 : 0
                  return (
                    <div key={item.ID_Producto || i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.producto_nombre || item.Nombre}</span>
                        <span className="text-muted-foreground">{ventas} unidades</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full transition-all"
                          style={{ width: `${porcentaje}%` }}
                        />
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
              <TrendingUp className="h-5 w-5 text-warning" />
              Insumos en Riesgo de Bajo Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insumosBajoStock.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No hay insumos con stock bajo
                </div>
              ) : (
                insumosBajoStock.map((item: any, i: number) => {
                  const stock = Number(item.Stock_Actual || 0)
                  const minimo = Number(item.Stock_Minimo || 0)
                  const porcentaje = minimo > 0 ? (stock / minimo) * 100 : 0
                  return (
                    <div
                      key={item.ID_Insumo || i}
                      className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{item.Nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {stock.toFixed(3)} {item.Unidad_Medida} / Mínimo: {minimo.toFixed(3)} {item.Unidad_Medida}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.min(porcentaje, 100)}%` }} />
                        </div>
                        <span className="text-sm font-medium text-red-600">{porcentaje.toFixed(0)}%</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
