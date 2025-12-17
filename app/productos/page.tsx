"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Filter, Grid, List } from "lucide-react"

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data)
        }
      })
      .catch((err) => console.error("Error cargando productos:", err))
      .finally(() => setLoading(false))
  }, [])

  const productosFiltrados = productos.filter((p) =>
    (p.Nombre || p.nombre)?.toLowerCase().includes(search.toLowerCase()) ||
    (p.Categoria_Nombre || p.categoria)?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="p-6">Cargando productos...</div>
  }

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
            <Button className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar productos por nombre o categoría..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
        </div>

        {productosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No hay productos disponibles
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productosFiltrados.map((producto) => {
              const categoriaNombre = producto.Categoria_Nombre || producto.categoria || "Sin categoría"
              const nombreProducto = producto.Nombre || producto.nombre
              const precio = Number(producto.Precio || producto.precio || 0)
              const disponible = producto.Disponibilidad !== undefined ? producto.Disponibilidad : producto.disponible !== false
              
              const getCategoriaColor = (categoria: string) => {
                switch (categoria) {
                  case "Bebidas Calientes": return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20"
                  case "Bebidas Frías": return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20"
                  case "Panadería": return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                  case "Repostería": return "bg-pink-500/10 text-pink-700 dark:text-pink-400 border border-pink-500/20"
                  case "Desayunos": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20"
                  default: return "bg-secondary text-secondary-foreground border border-border"
                }
              }
              
              return (
                <Card key={producto.ID_Producto || producto.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-card/50 border-2 hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-muted to-muted/50 mb-3 overflow-hidden relative">
                      <img
                        src="/product.png"
                        alt={nombreProducto}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        {disponible ? (
                          <Badge className="bg-green-500/90 text-white backdrop-blur-sm border border-green-600/30 font-medium shadow-sm">Disponible</Badge>
                        ) : (
                          <Badge variant="destructive" className="backdrop-blur-sm border border-red-600/30 font-medium shadow-sm">No disponible</Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{nombreProducto}</CardTitle>
                      </div>
                      <Badge className={`${getCategoriaColor(categoriaNombre)} font-medium`}>
                        {categoriaNombre}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">${precio.toFixed(2)}</div>
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
        )}
      </div>
    </div>
  )
}
