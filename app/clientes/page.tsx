"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, User, Users, Filter, Download } from "lucide-react"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [empleados, setEmpleados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchClientes, setSearchClientes] = useState("")
  const [searchEmpleados, setSearchEmpleados] = useState("")
  const [editingCliente, setEditingCliente] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ nombre: "", email: "", telefono: "" })
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ nombre: "", email: "", telefono: "" })

  useEffect(() => {
    // Cargar clientes
    fetch("/api/clientes")
      .then((res) => res.json())
      .then((data) => {
        if (data.clientes) {
          setClientes(data.clientes)
        }
      })
      .catch((err) => console.error("Error cargando clientes:", err))

    // Cargar empleados
    fetch("/api/empleados")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.empleados) {
          setEmpleados(data.empleados)
        }
      })
      .catch((err) => console.error("Error cargando empleados:", err))
      .finally(() => setLoading(false))
  }, [])

  // Contar pedidos por cliente (simplificado - en producción debería venir de la BD)
  const getPedidosCount = (clienteId: number) => {
    // Esto debería venir de una consulta a la BD, por ahora retornamos 0
    return 0
  }

  const clientesFiltrados = clientes.filter((c) =>
    c.Nombre?.toLowerCase().includes(searchClientes.toLowerCase()) ||
    c.Email?.toLowerCase().includes(searchClientes.toLowerCase()) ||
    c.Telefono?.includes(searchClientes)
  )

  const empleadosFiltrados = empleados.filter((e) =>
    e.Nombre?.toLowerCase().includes(searchEmpleados.toLowerCase()) ||
    e.Puesto?.toLowerCase().includes(searchEmpleados.toLowerCase()) ||
    e.Email?.toLowerCase().includes(searchEmpleados.toLowerCase())
  )

  const handleEditCliente = (cliente: any) => {
    setEditingCliente(cliente)
    setEditForm({
      nombre: cliente.Nombre || cliente.nombre || "",
      email: cliente.Email || cliente.email || "",
      telefono: cliente.Telefono || cliente.telefono || ""
    })
    setEditDialogOpen(true)
  }

  const handleSaveCliente = async () => {
    if (!editingCliente) return
    
    try {
      const clienteId = editingCliente.ID_Cliente || editingCliente.id
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editForm.nombre,
          email: editForm.email,
          telefono: editForm.telefono
        })
      })

      if (response.ok) {
        // Recargar clientes
        const clientesRes = await fetch("/api/clientes")
        const clientesData = await clientesRes.json()
        if (clientesData.clientes) {
          setClientes(clientesData.clientes)
        }
        setEditDialogOpen(false)
        setEditingCliente(null)
      } else {
        alert("Error al actualizar el cliente")
      }
    } catch (err) {
      console.error("Error actualizando cliente:", err)
      alert("Error al actualizar el cliente")
    }
  }

  const handleDeleteCliente = async (cliente: any) => {
    if (!confirm(`¿Estás seguro de eliminar a ${cliente.Nombre || cliente.nombre}?`)) return
    
    try {
      const clienteId = cliente.ID_Cliente || cliente.id
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        // Recargar clientes
        const clientesRes = await fetch("/api/clientes")
        const clientesData = await clientesRes.json()
        if (clientesData.clientes) {
          setClientes(clientesData.clientes)
        }
      } else {
        const error = await response.json()
        alert(error.error || "Error al eliminar el cliente")
      }
    } catch (err) {
      console.error("Error eliminando cliente:", err)
      alert("Error al eliminar el cliente")
    }
  }

  const handleCreateCliente = () => {
    setCreateForm({ nombre: "", email: "", telefono: "" })
    setCreateDialogOpen(true)
  }

  const handleSaveNewCliente = async () => {
    if (!createForm.nombre.trim()) {
      alert("El nombre es requerido")
      return
    }

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: createForm.nombre,
          email: createForm.email || null,
          telefono: createForm.telefono || null
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Recargar clientes
        const clientesRes = await fetch("/api/clientes")
        const clientesData = await clientesRes.json()
        if (clientesData.clientes) {
          setClientes(clientesData.clientes)
        }
        setCreateDialogOpen(false)
        setCreateForm({ nombre: "", email: "", telefono: "" })
      } else {
        alert(data.error || "Error al crear el cliente")
      }
    } catch (err) {
      console.error("Error creando cliente:", err)
      alert("Error al crear el cliente")
    }
  }

  if (loading) {
    return <div className="p-6">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Clientes y Empleados</h1>
            <p className="text-muted-foreground">
              Administra la información de clientes y empleados de StarBugs Coffee
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleCreateCliente}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Nuevo
            </Button>
          </div>
        </div>
        <Tabs defaultValue="clientes" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary/50">
            <TabsTrigger value="clientes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="empleados" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4 mr-2" />
              Empleados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clientes" className="mt-6">
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar clientes..." 
                  className="pl-10" 
                  value={searchClientes}
                  onChange={(e) => setSearchClientes(e.target.value)}
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
                  <Users className="h-5 w-5 text-primary" />
                  Lista de Clientes
                  <Badge variant="secondary">{clientesFiltrados.length} clientes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Cliente</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Teléfono</th>
                        <th className="text-left py-3 px-4 font-medium">Fecha Registro</th>
                        <th className="text-left py-3 px-4 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No hay clientes registrados
                          </td>
                        </tr>
                      ) : (
                        clientesFiltrados.map((cliente) => (
                          <tr key={cliente.id || cliente.ID_Cliente} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-medium">{cliente.Nombre || cliente.nombre}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">{cliente.Email || cliente.email || "N/A"}</td>
                            <td className="py-4 px-4 text-muted-foreground">{cliente.Telefono || cliente.telefono || "N/A"}</td>
                            <td className="py-4 px-4 text-muted-foreground text-sm">
                              {cliente.Fecha_Registro ? new Date(cliente.Fecha_Registro).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="hover:bg-primary/10"
                                  onClick={() => handleEditCliente(cliente)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => handleDeleteCliente(cliente)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empleados" className="mt-6">
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar empleados..." 
                  className="pl-10" 
                  value={searchEmpleados}
                  onChange={(e) => setSearchEmpleados(e.target.value)}
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
                  <User className="h-5 w-5 text-accent" />
                  Lista de Empleados
                  <Badge variant="secondary">{empleadosFiltrados.length} empleados</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Empleado</th>
                        <th className="text-left py-3 px-4 font-medium">Puesto</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Teléfono</th>
                        <th className="text-left py-3 px-4 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleadosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No hay empleados registrados
                          </td>
                        </tr>
                      ) : (
                        empleadosFiltrados.map((empleado) => (
                          <tr key={empleado.ID_Empleado || empleado.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                                  <User className="h-5 w-5 text-accent" />
                                </div>
                                <span className="font-medium">{empleado.Nombre || empleado.nombre}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge 
                                variant="outline" 
                                className="text-xs font-medium border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400"
                              >
                                {empleado.Puesto || empleado.puesto || empleado.cargo}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground">{empleado.Email || empleado.email || "N/A"}</td>
                            <td className="py-4 px-4 text-muted-foreground">{empleado.Telefono || empleado.telefono || "N/A"}</td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de edición */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input
                id="edit-nombre"
                value={editForm.nombre}
                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Email del cliente"
              />
            </div>
            <div>
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                type="tel"
                value={editForm.telefono}
                onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                placeholder="Teléfono del cliente"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCliente}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de creación */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="create-nombre">Nombre *</Label>
              <Input
                id="create-nombre"
                value={createForm.nombre}
                onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })}
                placeholder="Nombre del cliente"
                required
              />
            </div>
            <div>
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="Email del cliente (opcional)"
              />
            </div>
            <div>
              <Label htmlFor="create-telefono">Teléfono</Label>
              <Input
                id="create-telefono"
                type="tel"
                value={createForm.telefono}
                onChange={(e) => setCreateForm({ ...createForm, telefono: e.target.value })}
                placeholder="Teléfono del cliente (opcional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNewCliente}>
              Crear Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
