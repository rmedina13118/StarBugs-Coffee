"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ArrowLeft, Search, Plus, Minus, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NuevoPedidoPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [personas, setPersonas] = useState<any[]>([])
  const [mesas, setMesas] = useState<any[]>([])
  const [estados, setEstados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCliente, setSelectedCliente] = useState("")
  const [selectedPreparador, setSelectedPreparador] = useState("")
  const [selectedMesa, setSelectedMesa] = useState("")
  const [modalidad, setModalidad] = useState<"punto_venta" | "domicilio">("punto_venta")
  const [direccion, setDireccion] = useState("")
  const [carrito, setCarrito] = useState<Record<number, number>>({})
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false)
  const [clienteForm, setClienteForm] = useState({ name: "", email: "", phone: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/productos").then((r) => r.json()),
      fetch("/api/clientes").then((r) => r.json()),
      fetch("/api/personas").then((r) => r.json()),
      fetch("/api/mesas").then((r) => r.json()),
      fetch("/api/estados").then((r) => r.json()),
    ]).then(([prods, clts, pers, mes, ests]) => {
      setProductos(Array.isArray(prods) ? prods.filter((p: any) => p.availability !== false) : [])
      setClientes(Array.isArray(clts) ? clts : [])
      setPersonas(Array.isArray(pers) ? pers : [])
      setMesas(Array.isArray(mes) ? mes.filter((m: any) => m.Estado === "Disponible" || m.estado === "DISPONIBLE") : [])
      setEstados(Array.isArray(ests) ? ests : [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const productosFiltrados = productos.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  const agregar = (id: number) => setCarrito((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  const quitar = (id: number) => setCarrito((prev) => {
    const n = { ...prev }
    if (n[id] > 1) n[id]--; else delete n[id]
    return n
  })

  const total = Object.entries(carrito).reduce((sum, [id, qty]) => {
    const p = productos.find((p) => p.id === Number(id))
    return sum + (Number(p?.price || 0) * qty)
  }, 0)

  const handleCrearCliente = async () => {
    if (!clienteForm.name.trim()) return alert("Nombre requerido")
    const res = await fetch("/api/clientes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clienteForm),
    })
    const data = await res.json()
    const newId = data.id ?? data.id_cliente
    const cltsRes = await fetch("/api/clientes").then((r) => r.json())
    setClientes(Array.isArray(cltsRes) ? cltsRes : [])
    if (newId) setSelectedCliente(String(newId))
    setClienteDialogOpen(false)
    setClienteForm({ name: "", email: "", phone: "" })
  }

  const handleSubmit = async () => {
    if (!selectedCliente) return alert("Selecciona un cliente")
    if (Object.keys(carrito).length === 0) return alert("Agrega productos al pedido")
    const estadoPendiente = estados.find((e) => e.name === "Pendiente")
    setSubmitting(true)
    try {
      const body: any = {
        id_cliente: Number(selectedCliente),
        id_estado: estadoPendiente?.id ?? 1,
        modalidad,
        total,
        ...(selectedPreparador && { id_preparador: Number(selectedPreparador) }),
        ...(modalidad === "punto_venta" && selectedMesa && { id_mesa: Number(selectedMesa) }),
        ...(modalidad === "domicilio" && direccion && { direccion_entrega: direccion }),
      }
      const pedidoRes = await fetch("/api/pedidos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const pedido = await pedidoRes.json()
      router.push(`/pedidos/${pedido.id ?? pedido.id_pedido}`)
    } catch (err) {
      console.error(err)
      alert("Error al crear el pedido")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6">Cargando...</div>

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/pedidos"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <h1 className="text-2xl font-bold">Nuevo Pedido</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Información del Pedido</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Modalidad</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={modalidad} onChange={(e) => setModalidad(e.target.value as any)}>
                  <option value="punto_venta">En Local (Mesa)</option>
                  <option value="domicilio">Domicilio</option>
                </select>
              </div>

              {modalidad === "punto_venta" && (
                <div>
                  <Label>Mesa</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={selectedMesa} onChange={(e) => setSelectedMesa(e.target.value)}>
                    <option value="">Seleccionar mesa</option>
                    {mesas.map((m) => (
                      <option key={m.ID_Mesa ?? m.id_mesa} value={m.ID_Mesa ?? m.id_mesa}>
                        Mesa {m.Numero ?? m.numero} (Cap: {m.Capacidad ?? m.capacidad})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modalidad === "domicilio" && (
                <div>
                  <Label>Dirección de entrega</Label>
                  <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección completa" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Cliente</Label>
                  <Button type="button" variant="ghost" size="sm" className="h-7 text-xs"
                    onClick={() => setClienteDialogOpen(true)}>
                    <UserPlus className="h-3 w-3 mr-1" />Nuevo
                  </Button>
                </div>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <Label>Preparador</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedPreparador} onChange={(e) => setSelectedPreparador(e.target.value)}>
                  <option value="">Seleccionar preparador</option>
                  {personas.filter((p) => p.role?.nombre === "Preparador").map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Resumen del Pedido</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {Object.entries(carrito).map(([id, qty]) => {
                  const p = productos.find((p) => p.id === Number(id))
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span>{p?.name} x{qty}</span>
                      <span>${(Number(p?.price || 0) * qty).toLocaleString()}</span>
                    </div>
                  )
                })}
                {Object.keys(carrito).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Sin productos</p>
                )}
              </div>
              <div className="flex justify-between border-t pt-4 mb-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg text-primary">${total.toLocaleString()}</span>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 font-semibold" size="lg"
                disabled={!selectedCliente || Object.keys(carrito).length === 0 || submitting}
                onClick={handleSubmit}>
                {submitting ? "Creando..." : "Crear Pedido"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Seleccionar Productos</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar productos..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productosFiltrados.map((p) => {
                const qty = carrito[p.id] || 0
                return (
                  <Card key={p.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted">
                      <img src="/product.png" alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{p.name}</h3>
                      <p className="text-lg font-bold text-primary mb-3">${Number(p.price).toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => quitar(p.id)} disabled={qty === 0}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input type="number" value={qty} readOnly className="h-8 w-16 text-center" />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => agregar(p.id)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={clienteDialogOpen} onOpenChange={setClienteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo Cliente</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Nombre *</Label><Input value={clienteForm.name} onChange={(e) => setClienteForm({ ...clienteForm, name: e.target.value })} placeholder="Nombre" /></div>
            <div><Label>Email</Label><Input type="email" value={clienteForm.email} onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })} placeholder="Email" /></div>
            <div><Label>Teléfono</Label><Input value={clienteForm.phone} onChange={(e) => setClienteForm({ ...clienteForm, phone: e.target.value })} placeholder="Teléfono" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClienteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCrearCliente}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
