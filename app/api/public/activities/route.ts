/**
 * Public API — Lấy danh sách hoạt động đã publish
 * Dùng supabaseAdmin (service role) để bypass RLS
 * Cache 60s + stale-while-revalidate 5 phút
 */
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const revalidate = 60

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('activities')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  })
}
