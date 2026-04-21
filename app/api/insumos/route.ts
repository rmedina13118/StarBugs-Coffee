import { apiFetch } from '@/lib/api'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await apiFetch('/api/insumos')
  return NextResponse.json(data)
}
export async function POST(req: Request) {
  const body = await req.json()
  const data = await apiFetch('/api/insumos', { method: 'POST', body: JSON.stringify(body) })
  return NextResponse.json(data)
}
