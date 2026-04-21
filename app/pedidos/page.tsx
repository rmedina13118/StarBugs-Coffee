"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Eye, Filter, Download, Grid3x3 } from "lucide-react"
import Link from "next/link"

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [mesasOpen, setMesasOpen] = useState(false)
  const [mesas, setMesas] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/pedidos")
      .then((r) => r.json())
      .then((data) => setPedidos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const abrirMesas = () => {
    fetch("/api/mesas")
      .then((r) => r.json())
      .then((d) => { setMesas(Array.isArray(d) ? d : d.mesas || []); setMesasOpen(true) })
      .catch(() => setMesasOpen(true))
  }

  const filtrados = pedidos.filter((p) => {
    const q = search.toLowerCase()
    return (
      String(p.id).includes(q) ||
      p.customer?.name?.toLowerCase().includes(q) ||
      p.state?.name?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q)
    )
  })

  const estadoColor = (nombre: string) => {
    switch (nombre) {
      case "Entregado":      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "En preparación": return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
      case "Listo":          return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "Pendiente":      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
      case "Cancelado":      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default:               return ""
    }
  }

  if (loading) return <div className="p-6">Cargando pedidos...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra y visualiza todos los pedidos de la cafetería</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={abrirMesas}>
            <Grid3x3 className="h-4 w-4 mr-2" />Ver Mesas
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
          <Input placeholder="Buscar por ID, cliente o estado..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Lista de Pedidos
            <Badge variant="secondary">{filtrados.length} de {pedidos.length} en total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Modalidad</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Cliente</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Fecha</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Total</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Estado</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No se encontraron pedidos</td></tr>
                ) : filtrados.map((p, i) => (
                  <tr key={p.id ?? i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-4"><span className="font-bold text-primary">#{p.id}</span></td>
                    <td className="py-4 px-4"><Badge variant="outline">{p.status === "punto_venta" ? "Local" : "Domicilio"}</Badge></td>
                    <td className="py-4 px-4 font-medium">{p.customer?.name ?? "—"}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {p.date ? new Date(p.date).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-4 px-4"><span className="font-bold text-primary">${Number(p.total).toLocaleString()}</span></td>
                    <td className="py-4 px-4">
                      <Badge className={`text-xs font-medium border ${estadoColor(p.state?.name)}`}>{p.state?.name ?? "—"}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={`/pedidos/${p.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10"><Eye className="h-4 w-4" /></Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={mesasOpen} onOpenChange={setMesasOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Estado de Mesas</DialogTitle></DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {mesas.length === 0
              ? <p className="col-span-3 text-center text-muted-foreground">No hay datos de mesas disponibles</p>
              : mesas.map((m, i) => {
                const disponible = m.Estado === "Disponible" || m.estado === "DISPONIBLE"
                return (
                  <Card key={m.ID_Mesa ?? m.id_mesa ?? i} className={`p-4 text-center ${disponible ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}>
                    <div className="text-2xl font-bold mb-2">Mesa {m.Numero ?? m.numero}</div>
                    <Badge variant={disponible ? "default" : "destructive"}>{m.Estado ?? m.estado}</Badge>
                    <div className="text-sm text-muted-foreground mt-2">Cap: {m.Capacidad ?? m.capacidad}</div>
                  </Card>
                )
              })
            }
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
