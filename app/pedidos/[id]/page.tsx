"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, User, Calendar } from "lucide-react"
import Link from "next/link"
import { use } from "react"

export default function DetallePedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [pedido, setPedido] = useState<any>(null)
  const [detalles, setDetalles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/pedidos/${id}`).then((r) => r.json()),
      fetch("/api/reportes").then((r) => r.json()),
    ]).then(([p, dets]) => {
      setPedido(p)
      const lista = Array.isArray(dets) ? dets : []
      setDetalles(lista.filter((d: any) => d.order?.id === Number(id)))
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const estadoColor = (nombre: string) => {
    switch (nombre) {
      case "Entregado":      return "bg-green-500/10 text-green-700 border-green-500/20"
      case "En preparación": return "bg-amber-500/10 text-amber-700 border-amber-500/20"
      case "Listo":          return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "Cancelado":      return "bg-red-500/10 text-red-700 border-red-500/20"
      default:               return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  if (loading) return <div className="p-6">Cargando pedido...</div>
  if (!pedido) return <div className="p-6">Pedido no encontrado</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pedidos">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Pedido #{pedido.id}</h1>
          <p className="text-muted-foreground">Detalle completo del pedido</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Cliente</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">{pedido.customer?.name ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{pedido.customer?.email ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{pedido.customer?.phone ?? "—"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Info del Pedido</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <Badge className={`text-xs border ${estadoColor(pedido.state?.name)}`}>{pedido.state?.name ?? "—"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Modalidad</span>
              <Badge variant="outline">{pedido.status === "punto_venta" ? "Local" : "Domicilio"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha</span>
              <span className="text-sm">{pedido.date ? new Date(pedido.date).toLocaleString() : "—"}</span>
            </div>
            {pedido.deliveryAddress && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dirección</span>
                <span className="text-sm">{pedido.deliveryAddress}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Productos</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Producto</th>
                <th className="text-left py-3 px-4 font-medium">Cantidad</th>
                <th className="text-left py-3 px-4 font-medium">Precio Unit.</th>
                <th className="text-left py-3 px-4 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Sin detalles disponibles</td></tr>
              ) : detalles.map((d, i) => (
                <tr key={d.id ?? i} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium">{d.product?.name ?? "—"}</td>
                  <td className="py-3 px-4">{d.quantity}</td>
                  <td className="py-3 px-4">${Number(d.unitPrice ?? 0).toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-primary">${(Number(d.quantity) * Number(d.unitPrice ?? 0)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end pt-4 border-t border-border mt-4">
            <div className="text-right">
              <span className="text-muted-foreground mr-4">Total</span>
              <span className="text-2xl font-bold text-primary">${Number(pedido.total).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
