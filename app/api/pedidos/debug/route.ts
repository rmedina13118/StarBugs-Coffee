import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const res = await query("SELECT 1 as ok")
    return NextResponse.json({ ok: true, result: res })
  } catch (error: any) {
    console.error("DB debug error:", error)
    return NextResponse.json({ ok: false, error: error.message || String(error) }, { status: 500 })
  }
}
