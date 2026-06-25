import { createServerActionClient } from '@/lib/supabase'
import LeadsTable from '@/components/dashboard/LeadsTable'
import type { Lead } from '@/types'

interface Props { searchParams: { segment?: string; q?: string } }

export default async function LeadsPage({ searchParams }: Props) {
  const sb  = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()

  let query = sb.from('leads').select('*').eq('customer_id', user!.id).order('created_at', { ascending: false })

  if (searchParams.segment && searchParams.segment !== 'All') {
    query = query.eq('segment', searchParams.segment)
  }
  if (searchParams.q) {
    query = query.or(`name.ilike.%${searchParams.q}%,email.ilike.%${searchParams.q}%,phone.ilike.%${searchParams.q}%`)
  }

  const { data: leads } = await query.limit(200)

  const { data: stats } = await sb.from('lead_stats').select('*').eq('customer_id', user!.id).single()

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-gray-900">
        <h1 className="text-lg font-bold">Leads</h1>
        <div className="text-sm text-gray-500">{(leads || []).length} shown</div>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        <LeadsTable leads={(leads || []) as Lead[]} stats={stats} activeSegment={searchParams.segment || 'All'} search={searchParams.q || ''} />
      </div>
    </>
  )
}
