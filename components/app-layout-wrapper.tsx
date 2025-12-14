"use client"

import { usePathname } from "next/navigation"
import { AppLayout } from "./app-layout"

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Homepage doesn't use AppLayout
  if (pathname === "/") {
    return <>{children}</>
  }
  
  // All other pages use AppLayout
  return <AppLayout>{children}</AppLayout>
}