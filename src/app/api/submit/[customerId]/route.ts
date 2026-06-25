import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase.server'
import { scoreLead } from '@/lib/scoring'
import { sendWhatsAppNotification } from '@/lib/whatsapp'
import { detectDevice } from '@/lib/utils'
import type { SubmitFormPayload, BudgetRange, UrgencyLevel } from '@/types'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS })
}

export async function POST(req: NextRequest, { params }: { params: { customerId: string } }) {
  try {
    const body: SubmitFormPayload = await req.json()

    // ── Validate required fields ─────────────────────────────────────────
    const required: (keyof SubmitFormPayload)[] = ['name','phone','email','budget','service','urgency']
    for (const f of required) {
      if (!body[f]) return NextResponse.json({ error: `${f} is required` }, { status: 400, headers: CORS })
    }

    // Basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400, headers: CORS })
    }

    const sb = createServiceClient()

    // ── Load form config ─────────────────────────────────────────────────
    const { data: form, error: fErr } = await sb
      .from('form_configs')
      .select('*')
      .eq('customer_id', params.customerId)
      .single()

    if (fErr || !form) return NextResponse.json({ error: 'Form not found' }, { status: 404, headers: CORS })
    if (!form.is_active) return NextResponse.json({ error: 'Form inactive' }, { status: 403, headers: CORS })

    // ── Score lead ────────────────────────────────────────────────────────
    const { segment, score } = scoreLead(body.budget as BudgetRange, body.urgency as UrgencyLevel)

    // ── Device detect ─────────────────────────────────────────────────────
    const ua     = req.headers.get('user-agent') || body.user_agent || ''
    const device = detectDevice(ua)

    // ── Save lead ─────────────────────────────────────────────────────────
    const { data: lead, error: lErr } = await sb.from('leads').insert({
      customer_id: params.customerId,
      form_id:     form.id,
      name:        body.name.trim(),
      phone:       body.phone.replace(/\D/g,''),
      email:       body.email.trim().toLowerCase(),
      budget:      body.budget,
      service:     body.service,
      urgency:     body.urgency,
      message:     body.message?.trim() || null,
      segment,
      score,
      referrer:    body.referrer?.slice(0,500) || req.headers.get('referer') || null,
      device,
      notified:    false,
    }).select().single()

    if (lErr || !lead) {
      console.error('[submit] insert error:', lErr)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500, headers: CORS })
    }

    // ── Send WhatsApp (non-blocking) ──────────────────────────────────────
    // Use form's WA number, fallback to profile's number
    const notifyConfig = { ...form, whatsapp_number: form.whatsapp_number || '' }
    sendWhatsAppNotification(lead, notifyConfig)
      .then(ok => {
        if (ok) sb.from('leads').update({ notified: true }).eq('id', lead.id).then(() => {})
      })
      .catch(e => console.warn('[wa notify] error:', e))

    return NextResponse.json(
      {
        data: { id: lead.id, segment, score },
        error: null,
      },
      { status: 201, headers: CORS }
    )
  } catch (e) {
    console.error('[submit] unexpected:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: CORS })
  }
}
