import { apiFetch } from '@/lib/api'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: any) {
  const { id } = await params
  const data = await apiFetch(`/api/movimientos/${id}`)
  return NextResponse.json(data)
}
export async function PUT(req: Request, { params }: any) {
  const { id } = await params
  const body = await req.json()
  const data = await apiFetch(`/api/movimientos/${id}`, { method: 'PUT', body: JSON.stringify(body) })
  return NextResponse.json(data)
}
export async function DELETE(_: Request, { params }: any) {
  const { id } = await params
  const data = await apiFetch(`/api/movimientos/${id}`, { method: 'DELETE' })
  return NextResponse.json(data)
}
