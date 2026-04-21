"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Download, TrendingUp, BarChart3, FileText, Calendar, Filter, AlertTriangle } from "lucide-react"

const chartConfig = { total: { label: "Ventas", color: "#2563eb" } }

export default function ReportesPage() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [insumos, setInsumos] = useState<any[]>([])
  const [detalles, setDetalles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/pedidos").then((r) => r.json()),
      fetch("/api/insumos").then((r) => r.json()),
      fetch("/api/reportes").then((r) => r.json()),
    ]).then(([p, ins, det]) => {
      setPedidos(Array.isArray(p) ? p : [])
      setInsumos(Array.isArray(ins) ? ins : [])
      setDetalles(Array.isArray(det) ? det : [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Ventas totales
  const totalVentas = pedidos.reduce((s, p) => s + Number(p.total || 0), 0)
  const promedio = pedidos.length > 0 ? totalVentas / pedidos.length : 0
  const bajStock = insumos.filter((i) => Number(i.stock) < Number(i.minStock))

  // Productos más vendidos desde detalles de pedido
  const conteo: Record<string, any> = {}
  detalles.forEach((d) => {
    const nombre = d.product?.name ?? "Desconocido"
    if (!conteo[nombre]) conteo[nombre] = { nombre, total: 0 }
    conteo[nombre].total += Number(d.quantity || 0)
  })
  const productosVendidos = Object.values(conteo).sort((a, b) => b.total - a.total)
  const maxVendido = productosVendidos.length > 0 ? productosVendidos[0].total : 1

  // Ventas agrupadas por fecha para el gráfico
  const ventasPorFecha: Record<string, number> = {}
  pedidos.forEach((p) => {
    const fecha = p.date ? new Date(p.date).toLocaleDateString("es-CO", { month: "short", day: "numeric" }) : "—"
    ventasPorFecha[fecha] = (ventasPorFecha[fecha] || 0) + Number(p.total || 0)
  })
  const chartData = Object.entries(ventasPorFecha).map(([fecha, total]) => ({ fecha, total })).slice(-10)

  if (loading) return <div className="p-6">Cargando reportes...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Generación de Reportes</h1>
          <p className="text-muted-foreground">Análisis detallado de ventas, productos e inventario</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Calendar className="h-4 w-4 mr-2" />Periodo</Button>
          <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
          <Button className="bg-primary hover:bg-primary/90"><Download className="h-4 w-4 mr-2" />Exportar</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Ventas</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalVentas.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{pedidos.length} pedidos en total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{detalles.length}</div>
            <p className="text-xs text-muted-foreground">Líneas de detalle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insumos Bajo Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{bajStock.length}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Pedido</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${promedio.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">Promedio general</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Ventas por Fecha
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">No hay datos</div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="fecha" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => `$${Number(v).toLocaleString()}`} />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Productos Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productosVendidos.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-4">Sin datos</p>
            ) : productosVendidos.slice(0, 5).map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.nombre}</span>
                  <span className="text-muted-foreground">{item.total} uds</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(item.total / maxVendido) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-destructive" />
              Insumos en Riesgo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bajStock.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-4">Todos los insumos tienen stock suficiente</p>
            ) : bajStock.map((item, i) => {
              const pct = Number(item.minStock) > 0 ? (Number(item.stock) / Number(item.minStock)) * 100 : 0
              return (
                <div key={item.id ?? i} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {item.stock} / Mín: {item.minStock} {item.unitMeasurement}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-destructive">{pct.toFixed(0)}%</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
