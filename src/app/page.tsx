import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="text-xl font-extrabold"><span className="text-brand">Dep</span>grow <span className="text-gray-400 font-normal text-base">Leads</span></div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link href="/register" className="btn btn-brand btn-sm">Start free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center px-6 py-20 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          Smart Lead Capture SaaS
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-5">
          Capture leads.<br />
          <span className="text-brand">Score them instantly.</span><br />
          Close more deals.
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
          A multi-step form that qualifies every lead as Hot, Warm, or Cold — and pings you on WhatsApp the moment someone submits.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register" className="btn btn-brand btn-lg">🚀 Get started free</Link>
          <Link href="/login"    className="btn btn-ghost btn-lg">Sign in →</Link>
        </div>
        <p className="text-xs text-gray-600 mt-4">₹14,999 one-time · Unlimited leads · No monthly fees</p>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-4">
        {[
          { icon: '🎯', title: 'Auto lead scoring',      desc: 'Every lead is instantly scored and tagged Hot / Warm / Cold based on budget and urgency. No manual work.' },
          { icon: '📲', title: 'WhatsApp alerts',         desc: 'Get a detailed WhatsApp message the moment a lead submits — name, budget, urgency, and a dashboard link.' },
          { icon: '🎨', title: 'Fully customisable form', desc: 'Change colours, logo, questions, and thank-you message from your dashboard. Live preview before publishing.' },
          { icon: '📊', title: 'Lead CRM',                desc: 'Filter by Hot / Warm / Cold, search, and export all leads to CSV in one click.' },
          { icon: '⚡', title: '1-line embed',             desc: 'One script tag embeds the form on any website — WordPress, Webflow, Wix, React, anything.' },
          { icon: '🔒', title: 'Domain-locked',           desc: 'Forms only work on your whitelisted domain. Your lead data stays private and secure.' },
        ].map(f => (
          <div key={f.title} className="card-sm hover:border-brand/30 transition-colors">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-base mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center text-gray-700 text-xs pb-10">© 2026 Depgrow · Built in Hyderabad 🇮🇳</div>
    </div>
  )
}
