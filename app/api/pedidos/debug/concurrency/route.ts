import { NextResponse } from "next/server"

export async function GET() {
  const pending = (global as any).__pedidosPending || 0
  return NextResponse.json({ ok: true, pid: process.pid, pending })
}
