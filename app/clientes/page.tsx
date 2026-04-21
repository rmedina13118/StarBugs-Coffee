"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, User, Users, Filter } from "lucide-react"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [personas, setPersonas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchClientes, setSearchClientes] = useState("")
  const [searchPersonas, setSearchPersonas] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })

  const reload = () =>
    Promise.all([
      fetch("/api/clientes").then((r) => r.json()),
      fetch("/api/personas").then((r) => r.json()),
    ]).then(([c, p]) => {
      setClientes(Array.isArray(c) ? c : [])
      setPersonas(Array.isArray(p) ? p : [])
    }).finally(() => setLoading(false))

  useEffect(() => { reload() }, [])

  const handleCreate = async () => {
    if (!form.name.trim()) return alert("El nombre es requerido")
    await fetch("/api/clientes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setCreateOpen(false)
    setForm({ name: "", email: "", phone: "" })
    reload()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este cliente?")) return
    await fetch(`/api/clientes/${id}`, { method: "DELETE" })
    reload()
  }

  const clientesFiltrados = clientes.filter((c) =>
    c.name?.toLowerCase().includes(searchClientes.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchClientes.toLowerCase()) ||
    c.phone?.includes(searchClientes)
  )

  const personasFiltradas = personas.filter((p) =>
    p.name?.toLowerCase().includes(searchPersonas.toLowerCase()) ||
    p.role?.nombre?.toLowerCase().includes(searchPersonas.toLowerCase())
  )

  if (loading) return <div className="p-6">Cargando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clientes y Personal</h1>
          <p className="text-muted-foreground">Administra clientes y personal de StarBugs Coffee</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />Agregar Cliente
        </Button>
      </div>

      <Tabs defaultValue="clientes" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary/50">
          <TabsTrigger value="clientes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4 mr-2" />Clientes
          </TabsTrigger>
          <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4 mr-2" />Personal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clientes" className="mt-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar clientes..." className="pl-10" value={searchClientes} onChange={(e) => setSearchClientes(e.target.value)} />
            </div>
            <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Lista de Clientes
                <Badge variant="secondary">{clientesFiltrados.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Teléfono</th>
                    <th className="text-left py-3 px-4 font-medium">Registro</th>
                    <th className="text-left py-3 px-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No hay clientes</td></tr>
                  ) : clientesFiltrados.map((c, i) => (
                    <tr key={c.id ?? i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{c.email ?? "—"}</td>
                      <td className="py-4 px-4 text-muted-foreground">{c.phone ?? "—"}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {c.register ? new Date(c.register).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="mt-6 space-y-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar personal..." className="pl-10" value={searchPersonas} onChange={(e) => setSearchPersonas(e.target.value)} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                Personal
                <Badge variant="secondary">{personasFiltradas.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium">Rol</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {personasFiltradas.length === 0 ? (
                    <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No hay personal</td></tr>
                  ) : personasFiltradas.map((p, i) => (
                    <tr key={p.id ?? i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="border-purple-500/20 bg-purple-500/10 text-purple-700">
                          {p.role?.nombre ?? "—"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{p.email ?? "—"}</td>
                      <td className="py-4 px-4 text-muted-foreground">{p.phone ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo Cliente</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Nombre *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" /></div>
            <div><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Teléfono" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
