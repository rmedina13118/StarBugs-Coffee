import { apiFetch } from '@/lib/api'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: any) {
  const { id } = await params
  const data = await apiFetch(`/api/proveedores/${id}`)
  return NextResponse.json(data)
}
export async function PUT(req: Request, { params }: any) {
  const { id } = await params
  const body = await req.json()
  const data = await apiFetch(`/api/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(body) })
  return NextResponse.json(data)
}
export async function DELETE(_: Request, { params }: any) {
  const { id } = await params
  const data = await apiFetch(`/api/proveedores/${id}`, { method: 'DELETE' })
  return NextResponse.json(data)
}
