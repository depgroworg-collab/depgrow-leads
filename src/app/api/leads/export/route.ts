import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@/lib/supabase.server'
import { leadsToCSV } from '@/lib/utils'
import type { Lead } from '@/types'

export async function GET(req: NextRequest) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const segment = req.nextUrl.searchParams.get('segment')

  let query = sb.from('leads').select('*').eq('customer_id', user.id).order('created_at', { ascending: false })
  if (segment && segment !== 'All') query = query.eq('segment', segment)

  const { data } = await query
  const csv = leadsToCSV((data || []) as Lead[])

  return new NextResponse(csv, {
    headers: {
      'Content-Type':        'text/csv',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  })
}
