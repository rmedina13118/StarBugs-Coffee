
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Filter, Grid, List } from "lucide-react"

export default function ProductosPage() {
  const productos = [
    { id: 1, nombre: "Café Americano", categoria: "Bebidas Calientes", precio: 35.0, disponible: true },
    { id: 2, nombre: "Cappuccino", categoria: "Bebidas Calientes", precio: 45.0, disponible: true },
    { id: 3, nombre: "Latte", categoria: "Bebidas Calientes", precio: 48.0, disponible: true },
    { id: 4, nombre: "Croissant", categoria: "Panadería", precio: 28.0, disponible: true },
    { id: 5, nombre: "Pastel de Chocolate", categoria: "Postres", precio: 55.0, disponible: false },
    { id: 6, nombre: "Jugo de Naranja", categoria: "Bebidas Frías", precio: 32.0, disponible: true },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Productos</h1>
            <p className="text-muted-foreground">Administra el menú completo de tu cafetería</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <List className="h-4 w-4 mr-2" />
              Vista Lista
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar productos por nombre o categoría..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => {
            const getCategoriaColor = (categoria: string) => {
              switch (categoria) {
                case "Bebidas Calientes": return "bg-primary/10 text-primary"
                case "Bebidas Frías": return "bg-info/10 text-info"
                case "Panadería": return "bg-warning/10 text-warning"
                case "Postres": return "bg-accent/10 text-accent"
                default: return "bg-secondary text-secondary-foreground"
              }
            }
            
            return (
              <Card key={producto.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-muted to-muted/50 mb-3 overflow-hidden relative">
                    <img
                      src={`/aa2w3.jpg`}
                      alt={producto.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      {producto.disponible ? (
                        <Badge className="bg-success/90 text-success-foreground backdrop-blur-sm">Disponible</Badge>
                      ) : (
                        <Badge variant="destructive" className="backdrop-blur-sm">No disponible</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{producto.nombre}</CardTitle>
                    </div>
                    <Badge className={getCategoriaColor(producto.categoria)} variant="secondary">
                      {producto.categoria}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">${producto.precio.toFixed(2)}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/20">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
