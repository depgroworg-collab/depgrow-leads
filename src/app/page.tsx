import Link from 'next/link'

const DepgrowLogo = () => (
  <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
    <path d="M4 16 C4 16 7 6 11 6 C15 6 18 16 18 16" stroke="#0E7A5A" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11 C8 11 9.5 14 11 14 C12.5 14 14 11 14 11" stroke="#16A97D" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="11" cy="6" r="2" fill="#0E7A5A"/>
  </svg>
)

export default function LandingPage() {
  return (
    <div style={{ background: '#040a08', minHeight: '100vh', color: '#fff' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 56, borderBottom: '1px solid rgba(14,122,90,0.2)', background: 'rgba(4,10,8,0.95)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 17 }}>
          <DepgrowLogo />
          <span><span style={{ color: '#0E7A5A' }}>Dep</span><span style={{ color: '#16A97D' }}>grow</span></span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>Leads</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>Login</Link>
          <Link href="/register" style={{ fontSize: 13, fontWeight: 700, color: '#000', background: 'linear-gradient(100deg,#0E7A5A,#16A97D)', padding: '8px 18px', borderRadius: 8, textDecoration: 'none' }}>Start free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem 4rem', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#1aff9c', background: 'rgba(26,255,156,0.08)', border: '1px solid rgba(26,255,156,0.25)', padding: '7px 16px', borderRadius: 30, marginBottom: 24, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1aff9c', boxShadow: '0 0 8px #1aff9c', display: 'inline-block' }} />
          Smart Lead Capture SaaS
        </div>
        <h1 style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20 }}>
          Capture leads.{' '}
          <span style={{ background: 'linear-gradient(100deg,#1aff9c,#3fd0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Score them instantly.</span>
          {' '}Close more deals.
        </h1>
        <p style={{ fontSize: 17, color: '#9ab8ad', lineHeight: 1.75, marginBottom: 36, maxWidth: 540, margin: '0 auto 36px' }}>
          A multi-step form that qualifies every lead as 🔥 Hot, 🌤 Warm, or ❄️ Cold — and pings you on WhatsApp the moment someone submits.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: 'linear-gradient(100deg,#0E7A5A,#16A97D)', color: '#fff', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px rgba(26,255,156,0.2)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            🚀 Get started free
          </Link>
          <Link href="/login" style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            Sign in →
          </Link>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 14 }}>₹14,999 one-time · Unlimited leads · No monthly fees</p>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '2rem 2rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { icon: '🎯', title: 'Auto lead scoring',       desc: 'Every lead is instantly scored 0–100 and tagged Hot / Warm / Cold based on budget and urgency. No manual work.' },
          { icon: '📲', title: 'WhatsApp alerts',          desc: 'Get a detailed WhatsApp message the moment a lead submits — name, budget, urgency, score, and a dashboard link.' },
          { icon: '🎨', title: 'Fully customisable form',  desc: 'Change colours, logo, questions, and thank-you message from your dashboard. Live preview before publishing.' },
          { icon: '📊', title: 'Lead CRM',                 desc: 'Filter by Hot / Warm / Cold, search by name or email, and export all leads to CSV in one click.' },
          { icon: '⚡', title: '1-line embed',              desc: 'One script tag embeds the form on any website — WordPress, Webflow, Wix, React, anything.' },
          { icon: '🔒', title: 'Secure & private',         desc: 'Your lead data is private. Each form is tied to your account — no data shared with third parties.' },
        ].map(f => (
          <div key={f.title} style={{ background: 'rgba(14,122,90,0.06)', border: '1px solid rgba(14,122,90,0.2)', borderRadius: 16, padding: '1.75rem' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#fff' }}>{f.title}</h3>
            <p style={{ fontSize: 13.5, color: '#9ab8ad', lineHeight: 1.65 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Scoring visual */}
      <div style={{ maxWidth: 700, margin: '0 auto 5rem', padding: '0 2rem' }}>
        <div style={{ background: 'rgba(14,122,90,0.08)', border: '1px solid rgba(14,122,90,0.25)', borderRadius: 16, padding: '2rem' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 1.25, textAlign: 'center', marginBottom: 20 }}>Lead Scoring Logic</h3>
          {[
            { seg: '🔥 Hot',  color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  rule: 'Budget ≥ ₹50,000 AND Urgency = "This week"' },
            { seg: '🌤 Warm', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', rule: 'Budget ₹20k–₹50k OR Urgency = "This month"' },
            { seg: '❄️ Cold', color: '#6B7280', bg: 'rgba(107,114,128,0.1)',border: 'rgba(107,114,128,0.3)',rule: 'Everything else — still tracked, just lower priority' },
          ].map(s => (
            <div key={s.seg} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: s.color, minWidth: 70, flexShrink: 0 }}>{s.seg}</span>
              <span style={{ fontSize: 13.5, color: '#9ab8ad' }}>{s.rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg,#0A2E22,#0e3d2a)', padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(14,122,90,0.3)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Ready to stop leaking leads?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 28 }}>One-time setup. Instant results. WhatsApp alerts on every lead.</p>
        <Link href="/register" style={{ background: 'linear-gradient(100deg,#0E7A5A,#16A97D)', color: '#fff', padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginBottom: 14 }}>
          Get started — ₹14,999 →
        </Link>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>One-time · Unlimited leads · No monthly fees</p>
      </div>

      {/* Footer */}
      <div style={{ background: '#0A2E22', padding: '1.5rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          © 2026 <Link href="https://depgrow.in" style={{ color: '#16A97D', textDecoration: 'none' }}>Depgrow</Link> · Built in Hyderabad 🇮🇳
        </p>
      </div>
    </div>
  )
}
