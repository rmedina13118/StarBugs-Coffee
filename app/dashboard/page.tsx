import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ShoppingBag, DollarSign, AlertCircle, Package, Clock, Users } from "lucide-react"

export default function DashboardPage() {
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
              <div className="text-2xl font-bold text-primary">$1,284.50</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">+12.5%</span>
                <span className="text-xs text-muted-foreground">vs ayer</span>
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
              <div className="text-2xl font-bold text-accent">24</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">8 en preparación</Badge>
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
              <div className="text-2xl font-bold text-info">156</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success font-medium">+23%</span>
                <span className="text-xs text-muted-foreground">vs ayer</span>
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
              <div className="text-2xl font-bold text-destructive">7</div>
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
                {[
                  { nombre: "Café Americano", ventas: 45, porcentaje: 85, color: "bg-primary" },
                  { nombre: "Cappuccino", ventas: 38, porcentaje: 72, color: "bg-accent" },
                  { nombre: "Croissant", ventas: 32, porcentaje: 60, color: "bg-warning" },
                  { nombre: "Latte", ventas: 28, porcentaje: 53, color: "bg-info" },
                  { nombre: "Pastel de Chocolate", ventas: 22, porcentaje: 42, color: "bg-success" },
                ].map((producto, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{producto.nombre}</span>
                      <Badge variant="secondary">{producto.ventas} vendidos</Badge>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${producto.color} transition-all rounded-full`} style={{ width: `${producto.porcentaje}%` }} />
                    </div>
                  </div>
                ))}
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
                {[
                  {
                    id: "#001",
                    cliente: "Juan Pérez",
                    items: "2x Café, 1x Croissant",
                    total: "$12.50",
                    tiempo: "Hace 5 min",
                    estado: "En preparación",
                    variant: "outline" as const
                  },
                  {
                    id: "#002",
                    cliente: "María García",
                    items: "1x Latte, 1x Pastel",
                    total: "$15.00",
                    tiempo: "Hace 12 min",
                    estado: "Entregado",
                    variant: "default" as const
                  },
                  {
                    id: "#003",
                    cliente: "Carlos López",
                    items: "3x Cappuccino",
                    total: "$21.00",
                    tiempo: "Hace 18 min",
                    estado: "Entregado",
                    variant: "default" as const
                  },
                  {
                    id: "#004",
                    cliente: "Ana Martínez",
                    items: "1x Americano",
                    total: "$8.00",
                    tiempo: "Hace 25 min",
                    estado: "Pagado",
                    variant: "secondary" as const
                  },
                ].map((pedido) => (
                  <div
                    key={pedido.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{pedido.id}</span>
                        <Badge variant={pedido.variant} className="text-xs">
                          {pedido.estado}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{pedido.cliente}</p>
                      <p className="text-xs text-muted-foreground">{pedido.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">{pedido.total}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {pedido.tiempo}
                      </p>
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
