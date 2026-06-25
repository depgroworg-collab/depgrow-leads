import type { Lead, FormConfig } from '@/types'
import { BUDGET_LABELS, URGENCY_LABELS, SEGMENT_COLORS } from '@/types'

/**
 * Send a WhatsApp notification to the business owner.
 * Tries WATI first (supports template messages + rich text).
 * Falls back to Twilio WhatsApp if WATI is not configured.
 */
export async function sendWhatsAppNotification(
  lead: Lead,
  config: FormConfig
): Promise<boolean> {
  const to = config.whatsapp_number?.replace(/\D/g, '')
  if (!to) return false

  const emoji = lead.segment === 'Hot' ? '🔥' : lead.segment === 'Warm' ? '🌤' : '❄️'

  const message = [
    `${emoji} *New ${lead.segment} Lead — ${config.title}*`,
    '',
    `👤 *Name:* ${lead.name}`,
    `📱 *Phone:* +${lead.phone}`,
    `📧 *Email:* ${lead.email}`,
    `💼 *Service:* ${lead.service}`,
    `💰 *Budget:* ${BUDGET_LABELS[lead.budget as keyof typeof BUDGET_LABELS] ?? lead.budget}`,
    `⏰ *Urgency:* ${URGENCY_LABELS[lead.urgency as keyof typeof URGENCY_LABELS] ?? lead.urgency}`,
    lead.message ? `💬 *Message:* ${lead.message}` : null,
    '',
    `📊 *Score:* ${lead.score}/100`,
    `📍 *Source:* ${lead.referrer || 'Direct'}`,
    `🕐 *Received:* ${new Date(lead.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
    '',
    `👉 View in dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/leads`,
  ].filter(Boolean).join('\n')

  // ── Try WATI ─────────────────────────────────────────────────────────
  if (process.env.WATI_API_KEY && process.env.WATI_API_ENDPOINT) {
    try {
      const res = await fetch(`${process.env.WATI_API_ENDPOINT}/api/v1/sendSessionMessage/${to}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WATI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageText: message }),
      })
      if (res.ok) return true
      const err = await res.text()
      console.warn('[WATI] send failed:', err)
    } catch (e) {
      console.warn('[WATI] exception:', e)
    }
  }

  // ── Fallback: Twilio WhatsApp ─────────────────────────────────────────
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WA_FROM
  ) {
    try {
      const sid  = process.env.TWILIO_ACCOUNT_SID
      const auth = process.env.TWILIO_AUTH_TOKEN
      const from = process.env.TWILIO_WA_FROM // e.g. "whatsapp:+14155238886"
      const toWA = `whatsapp:+${to}`

      const body = new URLSearchParams({ From: from, To: toWA, Body: message })
      const res  = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${sid}:${auth}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        }
      )
      if (res.ok) return true
      const err = await res.json()
      console.warn('[Twilio] send failed:', err)
    } catch (e) {
      console.warn('[Twilio] exception:', e)
    }
  }

  console.warn('[WhatsApp] No provider configured — skipping notification')
  return false
}
