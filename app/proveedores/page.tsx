"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react"

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/proveedores")
      .then((r) => r.json())
      .then((d) => setProveedores(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtrados = proveedores.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-6">Cargando proveedores...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Proveedores</h1>
          <p className="text-muted-foreground">Administra los proveedores de insumos</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 font-semibold">
          <Plus className="h-4 w-4 mr-2" />Nuevo Proveedor
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar proveedores..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Lista de Proveedores
            <Badge variant="secondary">{filtrados.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Nombre</th>
                <th className="text-left py-3 px-4 font-medium">Teléfono</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Ciudad</th>
                <th className="text-left py-3 px-4 font-medium">Dirección</th>
                <th className="text-left py-3 px-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No hay proveedores</td></tr>
              ) : filtrados.map((p, i) => (
                <tr key={p.id ?? i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-4 px-4 font-medium">{p.name}</td>
                  <td className="py-4 px-4 text-muted-foreground">{p.phone ?? "—"}</td>
                  <td className="py-4 px-4 text-muted-foreground">{p.email ?? "—"}</td>
                  <td className="py-4 px-4 text-muted-foreground">{p.city ?? "—"}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {p.street ? `${p.street} #${p.numberStreet}` : "—"}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
