"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, AlertTriangle, TrendingDown, TrendingUp, Package, Plus, Filter, Download } from "lucide-react"

export default function InventarioPage() {
  const [insumos, setInsumos] = useState<any[]>([])
  const [proveedores, setProveedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [reabastecerDialogOpen, setReabastecerDialogOpen] = useState(false)
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<any>(null)
  const [reabastecerForm, setReabastecerForm] = useState({ cantidad: "", proveedor: "" })

  useEffect(() => {
    Promise.all([
      fetch("/api/insumos").then(res => res.json()),
      fetch("/api/proveedores").then(res => res.json())
    ]).then(([insumosData, proveedoresData]) => {
      if (insumosData.ok && insumosData.insumos) {
        setInsumos(insumosData.insumos)
      }
      if (proveedoresData.ok && proveedoresData.proveedores) {
        setProveedores(proveedoresData.proveedores)
      }
    }).catch((err) => console.error("Error cargando datos:", err))
      .finally(() => setLoading(false))
  }, [])

  const insumosFiltrados = insumos.filter((i) =>
    (i.Nombre || i.nombre)?.toLowerCase().includes(search.toLowerCase())
  )

  const stockBajo = insumos.filter((item) => {
    const stock = Number(item.Stock_Actual || item.stock || 0)
    const minimo = Number(item.Stock_Minimo || item.minimo || 0)
    return stock < minimo
  }).length

  const handleReabastecer = (insumo: any) => {
    setInsumoSeleccionado(insumo)
    setReabastecerForm({ cantidad: "", proveedor: "" })
    setReabastecerDialogOpen(true)
  }

  const handleSaveReabastecer = async () => {
    if (!insumoSeleccionado) return
    
    const cantidad = parseFloat(reabastecerForm.cantidad)
    if (!cantidad || cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0")
      return
    }

    if (!reabastecerForm.proveedor) {
      alert("Debe seleccionar un proveedor")
      return
    }

    try {
      const response = await fetch("/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID_Insumo: insumoSeleccionado.ID_Insumo || insumoSeleccionado.id,
          ID_Proveedor: reabastecerForm.proveedor,
          Tipo: "Entrada",
          Cantidad: cantidad
        })
      })

      const data = await response.json()

      if (data.ok) {
        // Recargar insumos
        const insumosRes = await fetch("/api/insumos")
        const insumosData = await insumosRes.json()
        if (insumosData.ok && insumosData.insumos) {
          setInsumos(insumosData.insumos)
        }
        setReabastecerDialogOpen(false)
        setInsumoSeleccionado(null)
        setReabastecerForm({ cantidad: "", proveedor: "" })
        alert("Insumo reabastecido exitosamente")
      } else {
        alert(data.error || "Error al reabastecer el insumo")
      }
    } catch (err) {
      console.error("Error reabasteciendo insumo:", err)
      alert("Error al reabastecer el insumo")
    }
  }

  if (loading) {
    return <div className="p-6">Cargando inventario...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Inventario</h1>
            <p className="text-muted-foreground">
              Control de insumos y stock de tu cafetería
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Insumo
            </Button>
          </div>
        </div>

        {stockBajo > 0 && (
          <Card className="border-destructive/50 bg-gradient-to-r from-destructive/5 to-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">
                    {stockBajo} insumo{stockBajo > 1 ? "s" : ""} con stock bajo
                  </p>
                  <p className="text-sm text-muted-foreground">Requieren reabastecimiento inmediato</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar insumos..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              <Package className="h-5 w-5 text-primary" />
              Estado del Inventario
              <Badge variant="secondary">{insumosFiltrados.length} insumos</Badge>
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
                    <th className="text-left py-4 px-4 font-semibold text-sm">Precio Unidad</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm">Estado</th>
                    <th className="text-left py-4 px-4 font-semibold text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {insumosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No hay insumos registrados
                      </td>
                    </tr>
                  ) : (
                    insumosFiltrados.map((item) => {
                      const stock = Number(item.Stock_Actual || item.stock || 0)
                      const minimo = Number(item.Stock_Minimo || item.minimo || 0)
                      const unidad = item.Unidad_Medida || item.unidad || ""
                      const porcentaje = minimo > 0 ? (stock / minimo) * 100 : 0
                      const estado = porcentaje < 50 ? "Crítico" : porcentaje < 100 ? "Bajo" : "Normal"
                      
                      const getEstadoVariant = (estado: string) => {
                        switch (estado) {
                          case "Normal": return "default" as const
                          case "Bajo": return "warning" as const
                          case "Crítico": return "destructive" as const
                          default: return "secondary" as const
                        }
                      }

                      const getEstadoColor = (estado: string) => {
                        switch (estado) {
                          case "Normal": return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                          case "Bajo": return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                          case "Crítico": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                          default: return ""
                        }
                      }

                      return (
                        <tr
                          key={item.ID_Insumo || item.id}
                          className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{item.Nombre || item.nombre}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-primary">
                              {stock.toFixed(3)} {unidad}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {minimo.toFixed(3)} {unidad}
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {unidad}
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {item.Precio_Unidad ? `$${Number(item.Precio_Unidad).toFixed(2)}` : "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant={getEstadoVariant(estado)} 
                              className={`text-xs font-medium border ${getEstadoColor(estado)}`}
                            >
                              {estado}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-500/30 border-blue-500/20 text-blue-700 dark:text-blue-400 font-medium"
                              onClick={() => handleReabastecer(item)}
                            >
                              Reabastecer
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de reabastecer */}
      <Dialog open={reabastecerDialogOpen} onOpenChange={setReabastecerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reabastecer Insumo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Insumo</Label>
              <Input
                value={insumoSeleccionado?.Nombre || insumoSeleccionado?.nombre || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="reabastecer-cantidad">Cantidad *</Label>
              <Input
                id="reabastecer-cantidad"
                type="number"
                step="0.001"
                min="0.001"
                value={reabastecerForm.cantidad}
                onChange={(e) => setReabastecerForm({ ...reabastecerForm, cantidad: e.target.value })}
                placeholder="Cantidad a agregar"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unidad: {insumoSeleccionado?.Unidad_Medida || insumoSeleccionado?.unidad || ""}
              </p>
            </div>
            <div>
              <Label htmlFor="reabastecer-proveedor">Proveedor *</Label>
              <select
                id="reabastecer-proveedor"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={reabastecerForm.proveedor}
                onChange={(e) => setReabastecerForm({ ...reabastecerForm, proveedor: e.target.value })}
                required
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.ID_Proveedor || p.id} value={p.ID_Proveedor || p.id}>
                    {p.Nombre || p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReabastecerDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveReabastecer}>
              Reabastecer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
