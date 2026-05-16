/**
 * Public API — Lấy mùa tuyển dụng đang mở
 * Cache 30s vì dữ liệu hay thay đổi hơn
 */
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const revalidate = 30

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('recruitment')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 's-maxage=30, stale-while-revalidate=120',
    },
  })
}
