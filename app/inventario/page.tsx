
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, AlertTriangle, TrendingDown, TrendingUp, Package, Plus, Filter, Download } from "lucide-react"

export default function InventarioPage() {
  const insumos = [
    {
      id: 1,
      nombre: "Café en Grano",
      stock: 150.5,
      minimo: 50,
      unidad: "kg",
      tendencia: "up",
      proveedor: "Café Premium",
    },
    {
      id: 2,
      nombre: "Leche Entera",
      stock: 35.0,
      minimo: 50,
      unidad: "L",
      tendencia: "down",
      proveedor: "Lácteos del Valle",
    },
    { id: 3, nombre: "Azúcar", stock: 200.0, minimo: 100, unidad: "kg", tendencia: "up", proveedor: "Dulces SA" },
    {
      id: 4,
      nombre: "Harina",
      stock: 15.5,
      minimo: 50,
      unidad: "kg",
      tendencia: "down",
      proveedor: "Molino del Norte",
    },
    {
      id: 5,
      nombre: "Chocolate",
      stock: 120.0,
      minimo: 80,
      unidad: "kg",
      tendencia: "up",
      proveedor: "Chocolate Fino",
    },
    {
      id: 6,
      nombre: "Vasos Desechables",
      stock: 500,
      minimo: 1000,
      unidad: "unidad",
      tendencia: "down",
      proveedor: "Empaques Eco",
    },
  ]

  const stockBajo = insumos.filter((item) => item.stock < item.minimo).length

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Inventario</h1>
            <p className="text-muted-foreground">
              Control de insumos y stock de tu cafetería
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Insumo
            </Button>
          </div>
        </div>

        {stockBajo > 0 && (
          <Card className="border-destructive/50 bg-gradient-to-r from-destructive/5 to-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">
                    {stockBajo} insumo{stockBajo > 1 ? "s" : ""} con stock bajo
                  </p>
                  <p className="text-sm text-muted-foreground">Requieren reabastecimiento inmediato</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar insumos..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Estado del Inventario
              <Badge variant="secondary">{insumos.length} insumos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-sm">Insumo</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm">Proveedor</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm">Stock Actual</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm">Stock Mínimo</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm">Estado</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm">Tendencia</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos.map((item) => {
                    const porcentaje = (item.stock / item.minimo) * 100
                    const estado = porcentaje < 50 ? "Crítico" : porcentaje < 100 ? "Bajo" : "Normal"
                    
                    const getEstadoVariant = (estado: string) => {
                      switch (estado) {
                        case "Normal": return "default" as const
                        case "Bajo": return "warning" as const
                        case "Crítico": return "destructive" as const
                        default: return "secondary" as const
                      }
                    }

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.nombre}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="text-xs">{item.proveedor}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-primary">
                            {item.stock} {item.unidad}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {item.minimo} {item.unidad}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={getEstadoVariant(estado)} className="text-xs">
                            {estado}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {item.tendencia === "up" ? (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-success" />
                              <Badge variant="secondary" className="text-xs bg-success/10 text-success">Subiendo</Badge>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <TrendingDown className="h-4 w-4 text-destructive" />
                              <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive">Bajando</Badge>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Button size="sm" variant="outline" className="hover:bg-primary/10">
                            Reabastecer
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
