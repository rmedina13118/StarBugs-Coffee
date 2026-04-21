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

const API = ""

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [personas, setPersonas] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchClientes, setSearchClientes] = useState("")
  const [searchPersonas, setSearchPersonas] = useState("")

  // Dialogs
  const [clienteDialog, setClienteDialog] = useState<{ open: boolean; editing: any }>({ open: false, editing: null })
  const [personaDialog, setPersonaDialog] = useState<{ open: boolean; editing: any }>({ open: false, editing: null })
  const [clienteForm, setClienteForm] = useState({ name: "", email: "", phone: "" })
  const [personaForm, setPersonaForm] = useState({ name: "", email: "", phone: "", roleId: "" })
  const [saving, setSaving] = useState(false)

  const reload = () =>
    Promise.all([
      fetch(`${API}/api/clientes`).then((r) => r.json()),
      fetch(`${API}/api/personas`).then((r) => r.json()),
      fetch(`${API}/api/roles`).then((r) => r.json()),
    ]).then(([c, p, r]) => {
      setClientes(Array.isArray(c) ? c : [])
      setPersonas(Array.isArray(p) ? p : [])
      setRoles(Array.isArray(r) ? r : [])
    }).finally(() => setLoading(false))

  useEffect(() => { reload() }, [])

  // --- Clientes ---
  const openCreateCliente = () => { setClienteForm({ name: "", email: "", phone: "" }); setClienteDialog({ open: true, editing: null }) }
  const openEditCliente = (c: any) => { setClienteForm({ name: c.name, email: c.email ?? "", phone: c.phone ?? "" }); setClienteDialog({ open: true, editing: c }) }

  const handleSaveCliente = async () => {
    if (!clienteForm.name.trim()) return alert("Nombre requerido")
    setSaving(true)
    try {
      if (clienteDialog.editing) {
        await fetch(`${API}/api/clientes/${clienteDialog.editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...clienteDialog.editing, ...clienteForm }),
        })
      } else {
        await fetch(`${API}/api/clientes`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clienteForm),
        })
      }
      setClienteDialog({ open: false, editing: null })
      reload()
    } finally { setSaving(false) }
  }

  const handleDeleteCliente = async (c: any) => {
    if (!confirm(`¿Eliminar a ${c.name}?`)) return
    await fetch(`${API}/api/clientes/${c.id}`, { method: "DELETE" })
    reload()
  }

  // --- Personas ---
  const openCreatePersona = () => { setPersonaForm({ name: "", email: "", phone: "", roleId: "" }); setPersonaDialog({ open: true, editing: null }) }
  const openEditPersona = (p: any) => {
    setPersonaForm({ name: p.name, email: p.email ?? "", phone: p.phone ?? "", roleId: p.role?.id ?? "" })
    setPersonaDialog({ open: true, editing: p })
  }

  const handleSavePersona = async () => {
    if (!personaForm.name.trim() || !personaForm.roleId) return alert("Nombre y rol son requeridos")
    setSaving(true)
    try {
      const body = { name: personaForm.name, email: personaForm.email, phone: personaForm.phone, role: { id: Number(personaForm.roleId) } }
      if (personaDialog.editing) {
        await fetch(`${API}/api/personas/${personaDialog.editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...personaDialog.editing, ...body }),
        })
      } else {
        await fetch(`${API}/api/personas`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      }
      setPersonaDialog({ open: false, editing: null })
      reload()
    } finally { setSaving(false) }
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

  if (loading) return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clientes y Personal</h1>
          <p className="text-muted-foreground">Administra clientes y personal de StarBugs Coffee</p>
        </div>
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

        {/* CLIENTES */}
        <TabsContent value="clientes" className="mt-6 space-y-4">
          <div className="flex gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar clientes..." className="pl-10" value={searchClientes} onChange={(e) => setSearchClientes(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={openCreateCliente}>
                <Plus className="h-4 w-4 mr-2" />Nuevo Cliente
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />Lista de Clientes
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
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10" onClick={() => openEditCliente(c)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteCliente(c)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERSONAL */}
        <TabsContent value="personal" className="mt-6 space-y-4">
          <div className="flex gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar personal..." className="pl-10" value={searchPersonas} onChange={(e) => setSearchPersonas(e.target.value)} />
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={openCreatePersona}>
              <Plus className="h-4 w-4 mr-2" />Nuevo Personal
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />Personal
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
                    <th className="text-left py-3 px-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {personasFiltradas.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No hay personal</td></tr>
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
                        <Badge variant="outline" className="border-purple-500/20 bg-purple-500/10 text-purple-700">{p.role?.nombre ?? "—"}</Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{p.email ?? "—"}</td>
                      <td className="py-4 px-4 text-muted-foreground">{p.phone ?? "—"}</td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10" onClick={() => openEditPersona(p)}><Edit className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Cliente */}
      <Dialog open={clienteDialog.open} onOpenChange={(o) => setClienteDialog({ open: o, editing: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>{clienteDialog.editing ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Nombre *</Label><Input value={clienteForm.name} onChange={(e) => setClienteForm({ ...clienteForm, name: e.target.value })} placeholder="Nombre" /></div>
            <div><Label>Email</Label><Input type="email" value={clienteForm.email} onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })} placeholder="Email" /></div>
            <div><Label>Teléfono</Label><Input value={clienteForm.phone} onChange={(e) => setClienteForm({ ...clienteForm, phone: e.target.value })} placeholder="Teléfono" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClienteDialog({ open: false, editing: null })}>Cancelar</Button>
            <Button onClick={handleSaveCliente} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Persona */}
      <Dialog open={personaDialog.open} onOpenChange={(o) => setPersonaDialog({ open: o, editing: null })}>
        <DialogContent>
          <DialogHeader><DialogTitle>{personaDialog.editing ? "Editar Personal" : "Nuevo Personal"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Nombre *</Label><Input value={personaForm.name} onChange={(e) => setPersonaForm({ ...personaForm, name: e.target.value })} placeholder="Nombre" /></div>
            <div><Label>Email</Label><Input type="email" value={personaForm.email} onChange={(e) => setPersonaForm({ ...personaForm, email: e.target.value })} placeholder="Email" /></div>
            <div><Label>Teléfono</Label><Input value={personaForm.phone} onChange={(e) => setPersonaForm({ ...personaForm, phone: e.target.value })} placeholder="Teléfono" /></div>
            <div>
              <Label>Rol *</Label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={personaForm.roleId} onChange={(e) => setPersonaForm({ ...personaForm, roleId: e.target.value })}>
                <option value="">Seleccionar rol</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPersonaDialog({ open: false, editing: null })}>Cancelar</Button>
            <Button onClick={handleSavePersona} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
