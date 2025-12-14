"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Coffee,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  FileText,
  Users,
  Settings,
  Moon,
  Sun
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pedidos", href: "/pedidos", icon: ShoppingCart },
  { name: "Productos", href: "/productos", icon: Package },
  { name: "Inventario", href: "/inventario", icon: Warehouse },
  { name: "Reportes", href: "/reportes", icon: FileText },
  { name: "Clientes", href: "/clientes", icon: Users },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-white/20 relative overflow-hidden">
      {/* Coffee background image */}
      <div className="absolute inset-0 opacity-100">
        <img
          src="/coffe.jpg"
          alt="Coffee background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Theme-based overlay */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/40' : 'bg-black/20'}`} />

      <div className="flex flex-col items-center gap-2 px-6 py-4 relative z-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-full overflow-hidden">
          <img src="/logo.jpeg" alt="StarBugs Logo" className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">StarBugs</h1>
          <p className="text-md font-semibold text-white/80">Administrador de cafetería</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4 relative z-10">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : `text-white ${theme === 'dark' ? 'hover:bg-white/80 hover:text-black' : 'hover:bg-black/80 hover:text-white'} `
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute bottom-4 right-4 z-10 bg-black/20 hover:bg-black/30 border-0 p-2"
        >
          {mounted && theme === "dark" ?
            <Sun className="h-7 w-7 text-white text-2xl" /> :
            <Moon className="h-7 w-7 text-white text-2xl" />
          }
        </Button>
      </div>
    </div>
  )
}