"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react"

const API = ""
const EMPTY = { name: "", price: "", description: "", categoryId: "", availability: true }

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  const reload = () =>
    Promise.all([
      fetch(`${API}/api/productos`).then((r) => r.json()),
      fetch(`${API}/api/categorias`).then((r) => r.json()),
    ]).then(([p, c]) => {
      setProductos(Array.isArray(p) ? p : [])
      setCategorias(Array.isArray(c) ? c : [])
    }).finally(() => setLoading(false))

  useEffect(() => { reload() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setDialogOpen(true) }
  const openEdit = (p: any) => {
    setEditing(p)
    setForm({ name: p.name, price: p.price, description: p.description ?? "", categoryId: p.category?.id ?? "", availability: p.availability })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.categoryId) return alert("Nombre, precio y categoría son requeridos")
    setSaving(true)
    const body = { name: form.name, price: Number(form.price), description: form.description, availability: form.availability, category: { id: Number(form.categoryId) } }
    try {
      if (editing) {
        await fetch(`${API}/api/productos/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, id: editing.id }) })
      } else {
        await fetch(`${API}/api/productos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      }
      setDialogOpen(false)
      reload()
    } finally { setSaving(false) }
  }

  const handleDelete = async (p: any) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return
    await fetch(`${API}/api/productos/${p.id}`, { method: "DELETE" })
    reload()
  }

  const toggleDisponibilidad = async (p: any) => {
    await fetch(`${API}/api/productos/${p.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, category: p.category, availability: !p.availability }),
    })
    reload()
  }

  const filtrados = productos.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const categoriaColor = (nombre: string) => {
    if (!nombre) return "bg-secondary text-secondary-foreground border-border"
    if (nombre.includes("Caliente")) return "bg-orange-500/10 text-orange-700 border-orange-500/20"
    if (nombre.includes("Fría") || nombre.includes("Fria")) return "bg-cyan-500/10 text-cyan-700 border-cyan-500/20"
    if (nombre.includes("Repost")) return "bg-pink-500/10 text-pink-700 border-pink-500/20"
    return "bg-secondary text-secondary-foreground border-border"
  }

  if (loading) return (
    <div className="grid gap-6 md:grid-cols-3">
      {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra el menú completo de tu cafetería</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-md font-semibold" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />Nuevo Producto
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o categoría..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
      </div>

      {filtrados.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No hay productos disponibles</CardContent></Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((p, i) => (
            <Card key={p.id ?? i} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="pb-3">
                <div className="aspect-video rounded-xl bg-muted mb-3 overflow-hidden relative">
                  <img src="/product.png" alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-2 right-2">
                    <button onClick={() => toggleDisponibilidad(p)} className="cursor-pointer">
                      {p.availability
                        ? <Badge className="bg-green-500/90 text-white hover:bg-green-600">Disponible</Badge>
                        : <Badge variant="destructive" className="hover:bg-red-700">No disponible</Badge>
                      }
                    </button>
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
                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary" onClick={() => openEdit(p)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(p)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar Producto" : "Nuevo Producto"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Nombre *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre del producto" /></div>
            <div><Label>Precio *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Precio" /></div>
            <div>
              <Label>Categoría *</Label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><Label>Descripción</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción (opcional)" /></div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="disponible" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} className="h-4 w-4" />
              <Label htmlFor="disponible">Disponible</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
