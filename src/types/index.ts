// ── Lead scoring ──────────────────────────────────────────────────────────
export type LeadSegment = 'Hot' | 'Warm' | 'Cold'

// ── Budget ranges ─────────────────────────────────────────────────────────
export type BudgetRange =
  | 'under_10k'
  | '10k_20k'
  | '20k_50k'
  | '50k_1L'
  | 'above_1L'

export type UrgencyLevel =
  | 'this_week'
  | 'this_month'
  | 'next_3_months'
  | 'just_exploring'

// ── Form config (what the customer customises) ────────────────────────────
export interface FormConfig {
  id: string
  customer_id: string
  title: string
  subtitle: string
  logo_url: string | null
  primary_color: string
  bg_color: string
  text_color: string
  button_text: string
  thank_you_title: string
  thank_you_message: string
  services: string[]          // options shown in "service needed" step
  whatsapp_number: string     // owner's WA number for notifications
  is_active: boolean
  embed_type: 'floating' | 'inline'
  created_at: string
  updated_at: string
}

// ── Lead ──────────────────────────────────────────────────────────────────
export interface Lead {
  id: string
  customer_id: string
  form_id: string
  name: string
  phone: string
  email: string
  budget: BudgetRange
  service: string
  urgency: UrgencyLevel
  message: string | null
  segment: LeadSegment
  score: number
  referrer: string | null
  device: 'mobile' | 'tablet' | 'desktop'
  notified: boolean           // WA notification sent?
  created_at: string
}

// ── Supabase profile ──────────────────────────────────────────────────────
export interface Profile {
  id: string
  email: string
  name: string
  business_name: string
  plan: 'free' | 'pro'
  whatsapp_number: string | null
  razorpay_payment_id: string | null
  created_at: string
}

// ── API shapes ────────────────────────────────────────────────────────────
export interface SubmitFormPayload {
  name: string
  phone: string
  email: string
  budget: BudgetRange
  service: string
  urgency: UrgencyLevel
  message?: string
  referrer?: string
  user_agent?: string
}

export interface ApiOk<T>    { data: T;    error: null }
export interface ApiErr      { data: null; error: string }
export type ApiRes<T> = ApiOk<T> | ApiErr

// ── Dashboard analytics ───────────────────────────────────────────────────
export interface LeadStats {
  total: number
  hot: number
  warm: number
  cold: number
  today: number
  this_week: number
  this_month: number
}

// ── Scoring result ────────────────────────────────────────────────────────
export interface ScoreResult {
  segment: LeadSegment
  score: number             // 0-100
}

// ── Budget label map ──────────────────────────────────────────────────────
export const BUDGET_LABELS: Record<BudgetRange, string> = {
  under_10k: 'Under ₹10,000',
  '10k_20k': '₹10,000 – ₹20,000',
  '20k_50k': '₹20,000 – ₹50,000',
  '50k_1L':  '₹50,000 – ₹1,00,000',
  above_1L:  'Above ₹1,00,000',
}

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  this_week:      '🔥 This week',
  this_month:     '📅 This month',
  next_3_months:  '🗓 Next 3 months',
  just_exploring: '👀 Just exploring',
}

export const SEGMENT_COLORS: Record<LeadSegment, string> = {
  Hot:  '#EF4444',
  Warm: '#F59E0B',
  Cold: '#6B7280',
}
