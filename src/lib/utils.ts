import type { Lead, LeadSegment } from '@/types'
import { BUDGET_LABELS, URGENCY_LABELS } from '@/types'

export function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(' ')
}

export function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
  return 'desktop'
}

export function segmentBadgeStyle(segment: LeadSegment): string {
  if (segment === 'Hot')  return 'background:#FEE2E2;color:#991B1B;'
  if (segment === 'Warm') return 'background:#FEF3C7;color:#92400E;'
  return 'background:#F3F4F6;color:#374151;'
}

export function leadsToCSV(leads: Lead[]): string {
  const headers = [
    'Name','Phone','Email','Service','Budget','Urgency','Segment','Score','Message','Referrer','Device','Date'
  ]
  const rows = leads.map(l => [
    l.name, l.phone, l.email, l.service,
    BUDGET_LABELS[l.budget as keyof typeof BUDGET_LABELS] ?? l.budget,
    URGENCY_LABELS[l.urgency as keyof typeof URGENCY_LABELS] ?? l.urgency,
    l.segment, l.score,
    (l.message || '').replace(/,/g,''),
    l.referrer || '',
    l.device,
    new Date(l.created_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),
  ])
  return [headers, ...rows].map(r => r.join(',')).join('\n')
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
  })
}
