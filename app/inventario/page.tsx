"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, AlertTriangle, Package, Plus, Filter, Download } from "lucide-react"

export default function InventarioPage() {
  const [insumos, setInsumos] = useState<any[]>([])
  const [proveedores, setProveedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [form, setForm] = useState({ cantidad: "", proveedor: "" })

  const reload = () =>
    Promise.all([
      fetch("/api/insumos").then((r) => r.json()),
      fetch("/api/proveedores").then((r) => r.json()),
    ]).then(([ins, prov]) => {
      setInsumos(Array.isArray(ins) ? ins : [])
      setProveedores(Array.isArray(prov) ? prov : [])
    }).finally(() => setLoading(false))

  useEffect(() => { reload() }, [])

  const filtrados = insumos.filter((i) =>
    i.name?.toLowerCase().includes(search.toLowerCase())
  )

  const stockBajo = insumos.filter((i) => Number(i.stock) < Number(i.minStock)).length

  const handleReabastecer = async () => {
    if (!form.cantidad || Number(form.cantidad) <= 0) return alert("Cantidad inválida")
    if (!form.proveedor) return alert("Selecciona un proveedor")
    await fetch("/api/movimientos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_insumo: selected.id, id_proveedor: Number(form.proveedor), tipo: "Entrada", cantidad: Number(form.cantidad) }),
    })
    setDialogOpen(false)
    reload()
  }

  const estadoColor = (stock: number, min: number) => {
    const pct = min > 0 ? (stock / min) * 100 : 100
    if (pct < 50) return { label: "Crítico", cls: "bg-red-500/10 text-red-700 border-red-500/20" }
    if (pct < 100) return { label: "Bajo", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20" }
    return { label: "Normal", cls: "bg-green-500/10 text-green-700 border-green-500/20" }
  }

  if (loading) return <div className="p-6">Cargando inventario...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Inventario</h1>
          <p className="text-muted-foreground">Control de insumos y stock de tu cafetería</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button>
          <Button className="bg-primary hover:bg-primary/90"><Plus className="h-4 w-4 mr-2" />Agregar Insumo</Button>
        </div>
      </div>

      {stockBajo > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <div>
                <p className="font-bold text-lg">{stockBajo} insumo{stockBajo > 1 ? "s" : ""} con stock bajo</p>
                <p className="text-sm text-muted-foreground">Requieren reabastecimiento inmediato</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar insumos..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Estado del Inventario
            <Badge variant="secondary">{filtrados.length} insumos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">Insumo</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Stock Actual</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Stock Mínimo</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Unidad</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Precio/Unidad</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Estado</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No hay insumos</td></tr>
                ) : filtrados.map((item, i) => {
                  const { label, cls } = estadoColor(Number(item.stock), Number(item.minStock))
                  return (
                    <tr key={item.id ?? i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-primary">{Number(item.stock).toLocaleString()} {item.unitMeasurement}</td>
                      <td className="py-4 px-4 text-muted-foreground">{Number(item.minStock).toLocaleString()} {item.unitMeasurement}</td>
                      <td className="py-4 px-4 text-muted-foreground">{item.unitMeasurement}</td>
                      <td className="py-4 px-4">${Number(item.price).toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <Badge className={`text-xs font-medium border ${cls}`}>{label}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Button size="sm" variant="outline"
                          className="hover:bg-blue-500/10 hover:text-blue-700 border-blue-500/20 text-blue-700"
                          onClick={() => { setSelected(item); setForm({ cantidad: "", proveedor: "" }); setDialogOpen(true) }}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reabastecer Insumo</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Insumo</Label><Input value={selected?.name ?? ""} disabled className="bg-muted" /></div>
            <div>
              <Label>Cantidad *</Label>
              <Input type="number" step="0.001" min="0.001" value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                placeholder={`Cantidad en ${selected?.unitMeasurement ?? ""}`} />
            </div>
            <div>
              <Label>Proveedor *</Label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={form.proveedor} onChange={(e) => setForm({ ...form, proveedor: e.target.value })}>
                <option value="">Seleccionar proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleReabastecer}>Reabastecer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
