import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const revalidate = 60

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('club_info')
    .select('*')
    .order('key')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Convert array [{key, value}] → object {key: value} for easy consumption
  const info = Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]))

  return NextResponse.json(info, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  })
}
