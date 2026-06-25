'use client'
import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Lead } from '@/types'
import { BUDGET_LABELS, URGENCY_LABELS } from '@/types'
import { formatDate } from '@/lib/utils'

interface Props {
  leads: Lead[]
  stats: { total: number; hot: number; warm: number; cold: number } | null
  activeSegment: string
  search: string
}

const SEGMENTS = ['All','Hot','Warm','Cold'] as const

export default function LeadsTable({ leads, stats, activeSegment, search }: Props) {
  const router   = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [q, setQ]           = useState(search)
  const [expanded, setExp]  = useState<string | null>(null)

  function navigate(segment: string, query: string) {
    const params = new URLSearchParams()
    if (segment !== 'All') params.set('segment', segment)
    if (query)             params.set('q', query)
    startTransition(() => router.push(pathname + (params.toString() ? '?' + params : '')))
  }

  function exportCSV() {
    const url = `/api/leads/export?segment=${activeSegment}`
    const a   = document.createElement('a')
    a.href    = url; a.download = 'leads.csv'
    a.click()
  }

  const s = stats || { total: 0, hot: 0, warm: 0, cold: 0 }

  return (
    <div>
      {/* Segment filter pills */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {SEGMENTS.map(seg => {
          const count = seg === 'All' ? s.total : s[seg.toLowerCase() as 'hot'|'warm'|'cold']
          const active = activeSegment === seg
          return (
            <button key={seg} onClick={() => navigate(seg, q)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                active
                  ? seg==='Hot'  ? 'bg-red-500/15 border-red-500/50 text-red-400'
                  : seg==='Warm' ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                  : seg==='Cold' ? 'bg-gray-500/15 border-gray-500/40 text-gray-300'
                  :                'bg-brand/15 border-brand/40 text-brand'
                  : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/25'
              }`}>
              {seg === 'Hot' ? '🔥' : seg === 'Warm' ? '🌤' : seg === 'Cold' ? '❄️' : ''}
              {seg} <span className="opacity-70">{count}</span>
            </button>
          )
        })}
        <div className="ml-auto flex items-center gap-2">
          <input
            className="input h-9 text-sm w-52"
            placeholder="Search name, email, phone…"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate(activeSegment, q)}
          />
          <button onClick={exportCSV} className="btn btn-ghost btn-sm shrink-0">⬇ CSV</button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-base font-medium">No leads found</p>
          <p className="text-sm mt-1">Try a different filter or embed your form on your website.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-gray-800/50">
                  {['Name','Contact','Service','Budget','Urgency','Segment','Score','Date',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map(l => (
                  <>
                    <tr key={l.id} className="border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer" onClick={() => setExp(expanded === l.id ? null : l.id)}>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{l.name}</td>
                      <td className="px-4 py-3 text-gray-400">
                        <div className="text-xs">{l.email}</div>
                        <div className="text-xs text-gray-600">+{l.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{l.service}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{BUDGET_LABELS[l.budget as keyof typeof BUDGET_LABELS] ?? l.budget}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{URGENCY_LABELS[l.urgency as keyof typeof URGENCY_LABELS] ?? l.urgency}</td>
                      <td className="px-4 py-3">
                        {l.segment === 'Hot'  && <span className="badge-hot">🔥 Hot</span>}
                        {l.segment === 'Warm' && <span className="badge-warm">🌤 Warm</span>}
                        {l.segment === 'Cold' && <span className="badge-cold">❄️ Cold</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${l.score}%`, background: l.segment === 'Hot' ? '#EF4444' : l.segment === 'Warm' ? '#F59E0B' : '#6B7280' }} />
                          </div>
                          <span className="text-xs text-gray-500">{l.score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(l.created_at)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{expanded === l.id ? '▲' : '▼'}</td>
                    </tr>
                    {expanded === l.id && (
                      <tr key={l.id + '-exp'} className="bg-gray-800/40">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            {[
                              { label: 'Message',  val: l.message || '—' },
                              { label: 'Device',   val: l.device },
                              { label: 'Referrer', val: l.referrer || 'Direct' },
                              { label: 'Notified', val: l.notified ? '✅ Yes' : '⏳ Pending' },
                            ].map(({ label, val }) => (
                              <div key={label}>
                                <div className="text-gray-500 uppercase tracking-wide mb-0.5">{label}</div>
                                <div className="text-gray-300 break-all">{val}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <a href={`tel:+${l.phone}`} className="btn btn-ghost btn-sm">📞 Call</a>
                            <a href={`https://wa.me/${l.phone}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">💬 WhatsApp</a>
                            <a href={`mailto:${l.email}`} className="btn btn-ghost btn-sm">✉️ Email</a>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
