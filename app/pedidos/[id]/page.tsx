"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, User, Calendar, ChefHat, Bike } from "lucide-react"
import Link from "next/link"

const API = ""

export default function DetallePedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [pedido, setPedido] = useState<any>(null)
  const [detalles, setDetalles] = useState<any[]>([])
  const [personas, setPersonas] = useState<any[]>([])
  const [estados, setEstados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const reload = () =>
    Promise.all([
      fetch(`${API}/api/pedidos/${id}`).then((r) => r.json()),
      fetch(`${API}/api/reportes`).then((r) => r.json()),
      fetch(`${API}/api/personas`).then((r) => r.json()),
      fetch(`${API}/api/estados`).then((r) => r.json()),
    ]).then(([p, dets, pers, ests]) => {
      setPedido(p)
      const lista = Array.isArray(dets) ? dets : []
      setDetalles(lista.filter((d: any) => d.order?.id === Number(id)))
      setPersonas(Array.isArray(pers) ? pers : [])
      setEstados(Array.isArray(ests) ? ests : [])
    }).catch(console.error)
      .finally(() => setLoading(false))

  useEffect(() => { reload() }, [id])

  const getPersona = (id: number | null) => id ? personas.find((p) => p.id === id) : null

  const handleUpdate = async (campo: string, valor: any) => {
    setSaving(true)
    try {
      await fetch(`${API}/api/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [campo]: valor }),
      })
      await reload()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const estadoColor = (nombre: string) => {
    switch (nombre) {
      case "Entregado": return "bg-green-500/10 text-green-700 border-green-500/20"
      case "En preparación": return "bg-amber-500/10 text-amber-700 border-amber-500/20"
      case "Listo": return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "Pendiente": return "bg-gray-500/10 text-gray-600 border-gray-500/20"
      case "Cancelado": return "bg-red-500/10 text-red-700 border-red-500/20"
      default: return ""
    }
  }

  const preparadores = personas.filter((p) => p.role?.nombre === "Preparador")
  const entregadores = personas.filter((p) => ["Domiciliario", "Cajero", "Mesero"].includes(p.role?.nombre))

  if (loading) return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
    </div>
  )
  if (!pedido || pedido.error) return <div className="p-6">Pedido no encontrado</div>

  const preparador = getPersona(pedido.preparadorId)
  const entregador = getPersona(pedido.entregadorId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pedidos">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Pedido #{pedido.id}</h1>
          <p className="text-muted-foreground">Detalle y gestión del pedido</p>
        </div>
        <Badge className={`text-sm font-medium border px-3 py-1 ${estadoColor(pedido.state?.name)}`}>
          {pedido.state?.name ?? "—"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Cliente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" />Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-semibold">{pedido.customer?.name ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{pedido.customer?.email ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{pedido.customer?.phone ?? "—"}</p>
          </CardContent>
        </Card>

        {/* Info pedido */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-4 w-4" />Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Modalidad</span>
              <Badge variant="outline">{pedido.status === "punto_venta" ? "🏠 Local" : "🛵 Domicilio"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha</span>
              <span>{pedido.date ? new Date(pedido.date).toLocaleString("es-CO") : "—"}</span>
            </div>
            {pedido.deliveryAddress && (
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Dirección</span>
                <span className="text-right">{pedido.deliveryAddress}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-1 border-t border-border">
              <span>Total</span>
              <span className="text-primary">${Number(pedido.total).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Cambiar estado */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cambiar Estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {estados.map((e) => (
              <Button key={e.id} variant={pedido.state?.id === e.id ? "default" : "outline"}
                size="sm" className="w-full justify-start text-xs"
                disabled={saving || pedido.state?.id === e.id}
                onClick={() => handleUpdate("id_estado", e.id)}>
                {e.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Preparador y Entregador */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><ChefHat className="h-4 w-4 text-amber-600" />Preparador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {preparador ? (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                <p className="font-semibold">{preparador.name}</p>
                <p className="text-xs text-muted-foreground">{preparador.role?.nombre} · {preparador.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin preparador asignado</p>
            )}
            <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              defaultValue=""
              onChange={(e) => e.target.value && handleUpdate("preparadorId", Number(e.target.value))}>
              <option value="">Asignar preparador...</option>
              {preparadores.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Bike className="h-4 w-4 text-blue-600" />Entregador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entregador ? (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <p className="font-semibold">{entregador.name}</p>
                <p className="text-xs text-muted-foreground">{entregador.role?.nombre} · {entregador.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin entregador asignado</p>
            )}
            <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              defaultValue=""
              onChange={(e) => e.target.value && handleUpdate("entregadorId", Number(e.target.value))}>
              <option value="">Asignar entregador...</option>
              {entregadores.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.role?.nombre})</option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {/* Productos del pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Productos del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Producto</th>
                <th className="text-left py-3 px-4 font-medium">Categoría</th>
                <th className="text-left py-3 px-4 font-medium">Cantidad</th>
                <th className="text-left py-3 px-4 font-medium">Precio Unit.</th>
                <th className="text-left py-3 px-4 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Sin detalles disponibles</td></tr>
              ) : detalles.map((d, i) => (
                <tr key={d.id ?? i} className="border-b border-border last:border-0 hover:bg-secondary/20">
                  <td className="py-3 px-4 font-medium">{d.product?.name ?? "—"}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{d.product?.category?.name ?? "—"}</td>
                  <td className="py-3 px-4">{d.quantity}</td>
                  <td className="py-3 px-4">${Number(d.unitPrice ?? d.product?.price ?? 0).toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-primary">
                    ${(Number(d.quantity) * Number(d.unitPrice ?? d.product?.price ?? 0)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end pt-4 border-t border-border mt-2">
            <span className="text-muted-foreground mr-4">Total</span>
            <span className="text-2xl font-bold text-primary">${Number(pedido.total).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
