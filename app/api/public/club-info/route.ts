/**
 * Public API — Lấy toàn bộ club_info dưới dạng object key-value
 * Cache 60s
 */
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const revalidate = 60

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('club_info')
    .select('key, value, label')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Chuyển array → object { key: value } cho dễ dùng ở client
  const result: Record<string, string> = {}
  data?.forEach(row => { result[row.key] = row.value })

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  })
}
