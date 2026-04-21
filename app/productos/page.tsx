"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react"

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/productos")
      .then((r) => r.json())
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtrados = productos.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const categoriaColor = (nombre: string) => {
    switch (nombre) {
      case "Bebidas Calientes": return "bg-orange-500/10 text-orange-700 border-orange-500/20"
      case "Bebidas Frías":     return "bg-cyan-500/10 text-cyan-700 border-cyan-500/20"
      case "Repostería":        return "bg-pink-500/10 text-pink-700 border-pink-500/20"
      default:                  return "bg-secondary text-secondary-foreground border-border"
    }
  }

  if (loading) return <div className="p-6">Cargando productos...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra el menú completo de tu cafetería</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-md font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o categoría..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
      </div>

      {filtrados.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No hay productos disponibles</CardContent></Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((p, i) => (
            <Card key={p.id ?? i} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
              <CardHeader className="pb-3">
                <div className="aspect-video rounded-xl bg-muted mb-3 overflow-hidden relative">
                  <img src="/product.png" alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-2 right-2">
                    {p.availability
                      ? <Badge className="bg-green-500/90 text-white">Disponible</Badge>
                      : <Badge variant="destructive">No disponible</Badge>
                    }
                  </div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{p.name}</CardTitle>
                  <Badge className={`${categoriaColor(p.category?.name)} font-medium border`}>
                    {p.category?.name ?? "Sin categoría"}
                  </Badge>
                  {p.description && <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">${Number(p.price).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
