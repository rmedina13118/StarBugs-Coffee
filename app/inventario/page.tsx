"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, AlertTriangle, Package, Plus, Filter, Edit } from "lucide-react"

const API = ""
const EMPTY_INSUMO = { name: "", stock: "", minStock: "", price: "", unitMeasurement: "" }

export default function InventarioPage() {
  const [insumos, setInsumos] = useState<any[]>([])
  const [proveedores, setProveedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Reabastecer
  const [reabDialog, setReabDialog] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [reabForm, setReabForm] = useState({ cantidad: "", proveedorId: "" })
  const [saving, setSaving] = useState(false)

  // Editar/Crear insumo
  const [insumoDialog, setInsumoDialog] = useState<{ open: boolean; editing: any }>({ open: false, editing: null })
  const [insumoForm, setInsumoForm] = useState<any>(EMPTY_INSUMO)

  const reload = () =>
    Promise.all([
      fetch(`${API}/api/insumos`).then((r) => r.json()),
      fetch(`${API}/api/proveedores`).then((r) => r.json()),
    ]).then(([ins, prov]) => {
      setInsumos(Array.isArray(ins) ? ins : [])
      setProveedores(Array.isArray(prov) ? prov : [])
    }).finally(() => setLoading(false))

  useEffect(() => { reload() }, [])

  const filtrados = insumos.filter((i) => i.name?.toLowerCase().includes(search.toLowerCase()))
  const stockBajo = insumos.filter((i) => Number(i.stock) < Number(i.minStock)).length

  // Reabastecer — body correcto: { material:{id}, stock, type:"entrada" }
  const handleReabastecer = async () => {
    if (!reabForm.cantidad || Number(reabForm.cantidad) <= 0) return alert("Cantidad inválida")
    setSaving(true)
    try {
      await fetch(`${API}/api/movimientos`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: { id: selected.id },
          stock: Number(reabForm.cantidad),
          type: "entrada",
          ...(reabForm.proveedorId && { person: null }),
        }),
      })
      // Actualizar stock del insumo directamente
      await fetch(`${API}/api/insumos/${selected.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selected, stock: Number(selected.stock) + Number(reabForm.cantidad) }),
      })
      setReabDialog(false)
      reload()
    } finally { setSaving(false) }
  }

  // Editar/Crear insumo
  const openEdit = (item: any) => {
    setInsumoForm({ name: item.name, stock: item.stock, minStock: item.minStock, price: item.price, unitMeasurement: item.unitMeasurement })
    setInsumoDialog({ open: true, editing: item })
  }
  const openCreate = () => { setInsumoForm(EMPTY_INSUMO); setInsumoDialog({ open: true, editing: null }) }

  const handleSaveInsumo = async () => {
    if (!insumoForm.name.trim()) return alert("Nombre requerido")
    setSaving(true)
    const body = { name: insumoForm.name, stock: Number(insumoForm.stock), minStock: Number(insumoForm.minStock), price: Number(insumoForm.price), unitMeasurement: insumoForm.unitMeasurement }
    try {
      if (insumoDialog.editing) {
        await fetch(`${API}/api/insumos/${insumoDialog.editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...insumoDialog.editing, ...body }),
        })
      } else {
        await fetch(`${API}/api/insumos`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      }
      setInsumoDialog({ open: false, editing: null })
      reload()
    } finally { setSaving(false) }
  }

  const estadoColor = (stock: number, min: number) => {
    const pct = min > 0 ? (stock / min) * 100 : 100
    if (pct < 50) return { label: "Crítico", cls: "bg-red-500/10 text-red-700 border-red-500/20" }
    if (pct < 100) return { label: "Bajo", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20" }
    return { label: "Normal", cls: "bg-green-500/10 text-green-700 border-green-500/20" }
  }

  if (loading) return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Inventario</h1>
          <p className="text-muted-foreground">Control de insumos y stock de tu cafetería</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />Agregar Insumo
        </Button>
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
                      <td className="py-4 px-4"><Badge className={`text-xs font-medium border ${cls}`}>{label}</Badge></td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="hover:bg-primary/10 hover:text-primary" onClick={() => openEdit(item)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline"
                            className="hover:bg-blue-500/10 hover:text-blue-700 border-blue-500/20 text-blue-700"
                            onClick={() => { setSelected(item); setReabForm({ cantidad: "", proveedorId: "" }); setReabDialog(true) }}>
                            Reabastecer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Reabastecer */}
      <Dialog open={reabDialog} onOpenChange={setReabDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reabastecer — {selected?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Cantidad a agregar *</Label>
              <Input type="number" step="0.001" min="0.001" value={reabForm.cantidad}
                onChange={(e) => setReabForm({ ...reabForm, cantidad: e.target.value })}
                placeholder={`Cantidad en ${selected?.unitMeasurement ?? ""}`} />
            </div>
            <div>
              <Label>Proveedor (opcional)</Label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={reabForm.proveedorId} onChange={(e) => setReabForm({ ...reabForm, proveedorId: e.target.value })}>
                <option value="">Sin proveedor</option>
                {proveedores.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              Stock actual: <strong>{selected?.stock} {selected?.unitMeasurement}</strong>
              {reabForm.cantidad && Number(reabForm.cantidad) > 0 && (
                <> → <strong className="text-green-600">{Number(selected?.stock) + Number(reabForm.cantidad)} {selected?.unitMeasurement}</strong></>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReabDialog(false)}>Cancelar</Button>
            <Button onClick={handleReabastecer} disabled={saving}>{saving ? "Guardando..." : "Reabastecer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Insumo */}
      <Dialog open={insumoDialog.open} onOpenChange={(o) => setInsumoDialog({ open: o, editing: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>{insumoDialog.editing ? "Editar Insumo" : "Nuevo Insumo"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Nombre *</Label><Input value={insumoForm.name} onChange={(e) => setInsumoForm({ ...insumoForm, name: e.target.value })} placeholder="Nombre del insumo" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Stock Actual</Label><Input type="number" value={insumoForm.stock} onChange={(e) => setInsumoForm({ ...insumoForm, stock: e.target.value })} placeholder="0" /></div>
              <div><Label>Stock Mínimo</Label><Input type="number" value={insumoForm.minStock} onChange={(e) => setInsumoForm({ ...insumoForm, minStock: e.target.value })} placeholder="0" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Precio/Unidad</Label><Input type="number" value={insumoForm.price} onChange={(e) => setInsumoForm({ ...insumoForm, price: e.target.value })} placeholder="0" /></div>
              <div><Label>Unidad de Medida</Label><Input value={insumoForm.unitMeasurement} onChange={(e) => setInsumoForm({ ...insumoForm, unitMeasurement: e.target.value })} placeholder="kg, litros, unidad..." /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInsumoDialog({ open: false, editing: null })}>Cancelar</Button>
            <Button onClick={handleSaveInsumo} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
