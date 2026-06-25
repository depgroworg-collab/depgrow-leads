import { createServerActionClient } from '@/lib/supabase.server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Lead } from '@/types'

export default async function DashboardPage() {
  const sb   = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  const uid  = user!.id

  const [{ data: stats }, { data: recent }, { data: form }] = await Promise.all([
    sb.from('lead_stats').select('*').eq('customer_id', uid).single(),
    sb.from('leads').select('*').eq('customer_id', uid).order('created_at', { ascending: false }).limit(5),
    sb.from('form_configs').select('id,is_active,embed_type').eq('customer_id', uid).single(),
  ])

  const s = stats || { total:0, hot:0, warm:0, cold:0, today:0, this_week:0, this_month:0 }

  const APP = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const embedSnippet = form?.id
    ? `<script src="${APP}/embed/form.js" data-form="${uid}" async></script>`
    : null

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-gray-900">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <Link href="/dashboard/leads" className="btn btn-brand btn-sm">View all leads →</Link>
      </header>

      <div className="p-8 overflow-y-auto flex-1">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { val: s.total,      lbl: 'Total leads',  color: 'text-white' },
            { val: s.hot,        lbl: '🔥 Hot',         color: 'text-red-400' },
            { val: s.warm,       lbl: '🌤 Warm',         color: 'text-amber-400' },
            { val: s.this_month, lbl: 'This month',    color: 'text-brand' },
          ].map(s => (
            <div key={s.lbl} className="stat-card">
              <div className={`stat-val ${s.color}`}>{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Embed code */}
        {embedSnippet && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-base">Your embed code</h2>
              <CopyBtn text={embedSnippet} />
            </div>
            <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-green-300 break-all">{embedSnippet}</div>
            <p className="text-xs text-gray-500 mt-2">Paste before <code className="text-gray-400">&lt;/body&gt;</code> on your website.</p>
          </div>
        )}

        {/* Recent leads */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base">Recent leads</h2>
            <Link href="/dashboard/leads" className="text-xs text-brand hover:underline">View all →</Link>
          </div>
          {!recent || recent.length === 0 ? (
            <div className="text-center py-10 text-gray-600">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">No leads yet. Embed your form and share your website!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-gray-500 border-b border-white/5">
                  {['Name','Service','Budget','Segment','Date'].map(h => <th key={h} className="text-left py-2 pr-4 font-semibold">{h}</th>)}
                </tr></thead>
                <tbody>
                  {(recent as Lead[]).map(l => (
                    <tr key={l.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-2.5 pr-4 font-medium">{l.name}</td>
                      <td className="py-2.5 pr-4 text-gray-400">{l.service}</td>
                      <td className="py-2.5 pr-4 text-gray-400 text-xs">{l.budget}</td>
                      <td className="py-2.5 pr-4"><SegmentBadge s={l.segment as Lead['segment']} /></td>
                      <td className="py-2.5 text-gray-500 text-xs">{formatDate(l.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function SegmentBadge({ s }: { s: 'Hot' | 'Warm' | 'Cold' }) {
  if (s === 'Hot')  return <span className="badge-hot">🔥 Hot</span>
  if (s === 'Warm') return <span className="badge-warm">🌤 Warm</span>
  return <span className="badge-cold">❄️ Cold</span>
}

function CopyBtn({ text }: { text: string }) {
  // Client-side copy — wrapped in 'use client' separately not needed for simple inline
  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => { if (typeof navigator !== 'undefined') navigator.clipboard.writeText(text) }}
    >
      📋 Copy
    </button>
  )
}
