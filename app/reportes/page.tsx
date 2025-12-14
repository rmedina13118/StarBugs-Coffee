
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, BarChart3, FileText, Calendar, Filter } from "lucide-react"

export default function ReportesPage() {
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
              <div className="text-2xl font-bold text-primary">$45,231</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">+20.1%</span>
                <span className="text-xs text-muted-foreground">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +15.3%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insumos Utilizados</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234 kg</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Pedido</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125.50</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8.2%
              </p>
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
            <div className="h-[300px] flex items-end justify-between gap-2">
              {[
                { mes: "Ene", valor: 35000, color: "bg-green-500" },
                { mes: "Feb", valor: 42000, color: "bg-green-500" },
                { mes: "Mar", valor: 38000, color: "bg-green-500" },
                { mes: "Abr", valor: 45000, color: "bg-green-500" },
                { mes: "May", valor: 41000, color: "bg-green-500" },
                { mes: "Jun", valor: 47000, color: "bg-green-500" },
                { mes: "Jul", valor: 52000, color: "bg-green-600" },
                { mes: "Ago", valor: 48000, color: "bg-green-500" },
                { mes: "Sep", valor: 51000, color: "bg-green-500" },
                { mes: "Oct", valor: 49000, color: "bg-green-500" },
                { mes: "Nov", valor: 53000, color: "bg-green-500" },
                { mes: "Dic", valor: 45231, color: "bg-green-600" },
              ].map((dato, i) => {
                const altura = (dato.valor / 60000) * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full group">
                      <div
                        className={`w-full ${dato.color} rounded-t-md transition-all hover:opacity-80`}
                        style={{ height: `${altura}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${dato.valor.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{dato.mes}</span>
                  </div>
                )
              })}
            </div>
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
              {[
                { producto: "Producto A", ventas: 450, porcentaje: 90 },
                { producto: "Producto B", ventas: 380, porcentaje: 76 },
                { producto: "Producto C", ventas: 320, porcentaje: 64 },
                { producto: "Producto D", ventas: 280, porcentaje: 56 },
                { producto: "Producto E", ventas: 240, porcentaje: 48 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.producto}</span>
                    <span className="text-muted-foreground">{item.ventas} unidades</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full transition-all"
                      style={{ width: `${item.porcentaje}%` }}
                    />
                  </div>
                </div>
              ))}
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
              {[
                { insumo: "Insumo A", stock: 15, minimo: 50, porcentaje: 30 },
                { insumo: "Insumo B", stock: 25, minimo: 60, porcentaje: 42 },
                { insumo: "Insumo C", stock: 18, minimo: 40, porcentaje: 45 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{item.insumo}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {item.stock} / Mínimo: {item.minimo}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: `${item.porcentaje}%` }} />
                    </div>
                    <span className="text-sm font-medium text-red-600">{item.porcentaje}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
