import { apiFetch } from '@/lib/api'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await apiFetch('/api/proveedores')
  return NextResponse.json(data)
}
export async function POST(req: Request) {
  const body = await req.json()
  const data = await apiFetch('/api/proveedores', { method: 'POST', body: JSON.stringify(body) })
  return NextResponse.json(data)
}
