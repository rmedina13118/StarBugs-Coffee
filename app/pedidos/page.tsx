"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Eye, Edit, Filter, Download, Users, Package, User, Calendar, ChefHat, Bike } from "lucide-react"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const API = ""

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [personas, setPersonas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [personalOpen, setPersonalOpen] = useState(false)
  const [verOpen, setVerOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState<any>(null)
  const [estados, setEstados] = useState<any[]>([])
  const [editEstado, setEditEstado] = useState<string>("")
  const [editPreparador, setEditPreparador] = useState<string>("")
  const [editEntregador, setEditEntregador] = useState<string>("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/pedidos`).then((r) => r.json()),
      fetch(`${API}/api/personas`).then((r) => r.json()),
      fetch(`${API}/api/estados`).then((r) => r.json()),
    ]).then(([p, pers, ests]) => {
      setPedidos(Array.isArray(p) ? p : [])
      setPersonas(Array.isArray(pers) ? pers : [])
      setEstados(Array.isArray(ests) ? ests : [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const getPersona = (id: number | null) =>
    id ? personas.find((p) => p.id === id) : null

  const filtrados = pedidos.filter((p) => {
    const q = search.toLowerCase()
    return (
      String(p.id).includes(q) ||
      p.customer?.name?.toLowerCase().includes(q) ||
      p.state?.name?.toLowerCase().includes(q)
    )
  })

  const estadoColor = (nombre: string) => {
    switch (nombre) {
      case "Entregado":      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "En preparación": return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
      case "Listo":          return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "Pendiente":      return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
      case "Cancelado":      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default:               return ""
    }
  }

  const openVer = (p: any) => { setSelectedPedido(p); setVerOpen(true) }
  const openEdit = (p: any) => {
    setSelectedPedido(p)
    setEditEstado(String(p.state?.id ?? ""))
    setEditPreparador(String(p.preparadorId ?? ""))
    setEditEntregador(String(p.entregadorId ?? ""))
    setEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedPedido) return
    setSaving(true)
    try {
      await fetch(`${API}/api/pedidos/${selectedPedido.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selectedPedido,
          state: { id: Number(editEstado) },
          preparadorId: editPreparador ? Number(editPreparador) : null,
          entregadorId: editEntregador ? Number(editEntregador) : null,
        }),
      })
      const updated = await fetch(`${API}/api/pedidos`).then((r) => r.json())
      setPedidos(Array.isArray(updated) ? updated : [])
      setEditOpen(false)
    } finally { setSaving(false) }
  }

  const preparadores = personas.filter((p) => p.role?.nombre === "Preparador")
  const domiciliarios = personas.filter((p) => p.role?.nombre === "Domiciliario")
  const cajeros = personas.filter((p) => p.role?.nombre === "Cajero")

  if (loading) return (
    <div className="space-y-6">
      <div className="h-10 w-64 bg-muted animate-pulse rounded-lg" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra y visualiza todos los pedidos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPersonalOpen(true)}>
            <Users className="h-4 w-4 mr-2" />Personal
          </Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button>
          <Link href="/pedidos/nuevo">
            <Button className="bg-primary hover:bg-primary/90 shadow-md font-semibold">
              <Plus className="h-4 w-4 mr-2" />Nuevo Pedido
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por ID, cliente o estado..." className="pl-10"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Lista de Pedidos
            <Badge variant="secondary">{filtrados.length} de {pedidos.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Cliente</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Modalidad</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Preparador</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Entregador / Mesero</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Fecha</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Total</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Estado</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr><td colSpan={9} className="py-8 text-center text-muted-foreground">No se encontraron pedidos</td></tr>
                ) : filtrados.map((p, i) => {
                  const preparador = getPersona(p.preparadorId)
                  const entregador = getPersona(p.entregadorId)
                  return (
                    <tr key={p.id ?? i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-4"><span className="font-bold text-primary">#{p.id}</span></td>
                      <td className="py-4 px-4 font-medium">{p.customer?.name ?? "—"}</td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="text-xs">
                          {p.status === "punto_venta" ? "🏠 Local" : "🛵 Domicilio"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {preparador
                          ? <div className="flex flex-col"><span className="text-sm font-medium">{preparador.name}</span><span className="text-xs text-muted-foreground">{preparador.role?.nombre}</span></div>
                          : <span className="text-xs text-muted-foreground">Sin asignar</span>
                        }
                      </td>
                      <td className="py-4 px-4">
                        {entregador
                          ? <div className="flex flex-col"><span className="text-sm font-medium">{entregador.name}</span><span className="text-xs text-muted-foreground">{p.status === "punto_venta" ? "Mesero" : "Entregador"}</span></div>
                          : <span className="text-xs text-muted-foreground">Sin asignar</span>
                        }
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {p.date ? new Date(p.date).toLocaleDateString("es-CO") : "—"}
                      </td>
                      <td className="py-4 px-4"><span className="font-bold text-primary">${Number(p.total).toLocaleString()}</span></td>
                      <td className="py-4 px-4">
                        <Badge className={`text-xs font-medium border ${estadoColor(p.state?.name)}`}>
                          {p.state?.name ?? "—"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10" onClick={() => openVer(p)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-amber-500/10 hover:text-amber-700" onClick={() => openEdit(p)}>
                            <Edit className="h-4 w-4" />
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

      {/* Modal Ver Pedido */}
      {selectedPedido && (
        <Dialog open={verOpen} onOpenChange={setVerOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Pedido #{selectedPedido.id}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Cliente</span><p className="font-medium">{selectedPedido.customer?.name ?? "—"}</p></div>
                <div><span className="text-muted-foreground">Modalidad</span><p className="font-medium">{selectedPedido.status === "punto_venta" ? "🏠 Local" : "🛵 Domicilio"}</p></div>
                <div><span className="text-muted-foreground">Estado</span>
                  <Badge className={`text-xs border ${estadoColor(selectedPedido.state?.name)}`}>{selectedPedido.state?.name}</Badge>
                </div>
                <div><span className="text-muted-foreground">Fecha</span><p className="font-medium">{selectedPedido.date ? new Date(selectedPedido.date).toLocaleString("es-CO") : "—"}</p></div>
                <div><span className="text-muted-foreground">Preparador</span><p className="font-medium">{getPersona(selectedPedido.preparadorId)?.name ?? "Sin asignar"}</p></div>
                <div><span className="text-muted-foreground">{selectedPedido.status === "punto_venta" ? "Mesero" : "Entregador"}</span><p className="font-medium">{getPersona(selectedPedido.entregadorId)?.name ?? "Sin asignar"}</p></div>
                {selectedPedido.deliveryAddress && (
                  <div className="col-span-2"><span className="text-muted-foreground">Dirección</span><p className="font-medium">{selectedPedido.deliveryAddress}</p></div>
                )}
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary text-lg">${Number(selectedPedido.total).toLocaleString()}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Editar Pedido */}
      {selectedPedido && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Editar Pedido #{selectedPedido.id}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Estado</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={editEstado} onChange={(e) => setEditEstado(e.target.value)}>
                  {estados.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Preparador</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={editPreparador} onChange={(e) => setEditPreparador(e.target.value)}>
                  <option value="">Sin asignar</option>
                  {preparadores.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <Label>{selectedPedido.status === "punto_venta" ? "Mesero" : "Entregador"}</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={editEntregador} onChange={(e) => setEditEntregador(e.target.value)}>
                  <option value="">Sin asignar</option>
                  {personas
                    .filter((p) => selectedPedido.status === "punto_venta"
                      ? ["Cajero", "Mesero"].includes(p.role?.nombre)
                      : p.role?.nombre === "Domiciliario")
                    .map((p) => <option key={p.id} value={p.id}>{p.name} ({p.role?.nombre})</option>)
                  }
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveEdit} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Panel de personal disponible */}
      <Dialog open={personalOpen} onOpenChange={setPersonalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Personal Disponible</DialogTitle></DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <div>
              <h3 className="font-semibold text-sm mb-3 text-amber-700">👨‍🍳 Preparadores</h3>
              <div className="space-y-2">
                {preparadores.map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.phone}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3 text-blue-700">🛵 Domiciliarios</h3>
              <div className="space-y-2">
                {domiciliarios.map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.phone}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3 text-green-700">💰 Cajeros</h3>
              <div className="space-y-2">
                {cajeros.map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
