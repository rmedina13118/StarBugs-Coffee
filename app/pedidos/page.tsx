"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Filter, Download } from "lucide-react"
import Link from "next/link"


export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch("/api/pedidos")
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return

        const normalized = (data.pedidos || []).map((p: any) => ({
          ...p,
          Fecha_Hora: p.Fecha_Hora ? new Date(p.Fecha_Hora).toLocaleString() : "",
          total_precio: Number(p.total_precio) || 0,
        }))

        setPedidos(normalized)
      })
      .catch((error) => {
        console.error("Error al obtener los pedidos:", error)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return <div>Cargando pedidos...</div>
  }

  // const pedidosExample = [
  //   {
  //     id: "001",
  //     fecha: "2024-01-15 10:30",
  //     cliente: "Juan Pérez",
  //     empleado: "Carlos Ruiz",
  //     total: 125.5,
  //     estado: "Entregado",
  //     items: 3,
  //   },
  //   {
  //     id: "002",
  //     fecha: "2024-01-15 10:45",
  //     cliente: "María García",
  //     empleado: "Ana López",
  //     total: 89.99,
  //     estado: "En preparación",
  //     items: 2,
  //   },
  //   {
  //     id: "003",
  //     fecha: "2024-01-15 11:00",
  //     cliente: "Carlos López",
  //     empleado: "Carlos Ruiz",
  //     total: 234.75,
  //     estado: "Pagado",
  //     items: 5,
  //   },
  //   {
  //     id: "004",
  //     fecha: "2024-01-15 11:15",
  //     cliente: "Ana Martínez",
  //     empleado: "Luis Mora",
  //     total: 156.3,
  //     estado: "Entregado",
  //     items: 4,
  //   },
  //   {
  //     id: "005",
  //     fecha: "2024-01-15 11:30",
  //     cliente: "Luis Rodríguez",
  //     empleado: "Ana López",
  //     total: 299.99,
  //     estado: "En preparación",
  //     items: 6,
  //   },
  //   {
  //     id: "006",
  //     fecha: "2024-01-15 11:45",
  //     cliente: "Sofia Hernández",
  //     empleado: "Carlos Ruiz",
  //     total: 178.45,
  //     estado: "Cancelado",
  //     items: 3,
  //   },
  // ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">
            Administra y visualiza todos los pedidos de la cafetería
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Link href="/pedidos/nuevo">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pedido
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o estado..."
            className="w-full h-10 pl-10 pr-4 bg-background/50 rounded-md text-sm border border-border outline-none focus:outline-none focus:ring-0 focus:border-border"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Lista de Pedidos
            <Badge variant="secondary">{pedidos.length} en total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-sm">ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Fecha y Hora</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">total productos</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Cliente</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Empleado</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Total</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Estado</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => {
                  const getEstadoVariant = (estado: string) => {
                    switch (estado) {
                      case "Entregado": return "default" as const
                      case "En preparación": return "outline" as const
                      case "Pagado": return "secondary" as const
                      case "Cancelado": return "destructive" as const
                      default: return "secondary" as const
                    }
                  }

                  return (
                    <tr
                      key={pedido.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-bold text-primary">#{pedido.id}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{pedido.Fecha_Hora}</td>
                      <td className="py-4 px-4 font-medium">{pedido.total_items}</td>
                      <td className="py-4 px-4 font-medium">{pedido.cliente_nombre}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{pedido.empleado_nombre}</td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-primary">${pedido.total_precio.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getEstadoVariant(pedido.Estado)} className="text-xs">
                          {pedido.Estado}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Link href={`/pedidos/${pedido.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
