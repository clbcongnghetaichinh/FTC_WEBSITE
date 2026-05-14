import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Cache 60s on CDN/Next.js, serve stale up to 5min while revalidating
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
