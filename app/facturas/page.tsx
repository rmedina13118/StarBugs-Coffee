"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Download, FileText, CreditCard } from "lucide-react"

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/facturas")
      .then((r) => r.json())
      .then((data) => setFacturas(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtradas = facturas.filter((f) => {
    const q = search.toLowerCase()
    return (
      String(f.id).includes(q) ||
      String(f.order?.id).includes(q) ||
      f.order?.customer?.name?.toLowerCase().includes(q) ||
      (f.paymentMethod ?? "").toLowerCase().includes(q)
    )
  })

  const metodoPagoColor = (metodo: string) => {
    switch ((metodo ?? "").toUpperCase()) {
      case "EFECTIVO":      return "bg-green-500/10 text-green-700 border-green-500/20"
      case "TARJETA":       return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "TRANSFERENCIA": return "bg-purple-500/10 text-purple-700 border-purple-500/20"
      case "NEQUI":         return "bg-pink-500/10 text-pink-700 border-pink-500/20"
      default:              return "bg-secondary text-secondary-foreground border-border"
    }
  }

  if (loading) return <div className="p-6">Cargando facturas...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Facturas</h1>
          <p className="text-muted-foreground">Administra y visualiza todas las facturas emitidas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-md font-semibold">
            <Plus className="h-4 w-4 mr-2" />Nueva Factura
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por ID, pedido, cliente o método de pago..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Facturas
            <Badge variant="secondary">{filtradas.length} de {facturas.length} en total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">ID Factura</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Pedido</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Cliente</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Fecha Emisión</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Método Pago</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Total</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No se encontraron facturas</td></tr>
                ) : filtradas.map((f, i) => (
                  <tr key={f.id ?? i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-4"><span className="font-bold text-primary">#{f.id}</span></td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">Pedido #{f.order?.id ?? "—"}</td>
                    <td className="py-4 px-4 font-medium">{f.order?.customer?.name ?? "—"}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {f.issueDate ? new Date(f.issueDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`text-xs font-medium border ${metodoPagoColor(f.paymentMethod)}`}>
                        <CreditCard className="h-3 w-3 mr-1" />
                        {f.paymentMethod ?? "—"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-primary text-lg">${Number(f.order?.total ?? 0).toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10"><Download className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
