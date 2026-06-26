'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const DepgrowLogo = () => (
  <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
    <path d="M4 16 C4 16 7 6 11 6 C15 6 18 16 18 16" stroke="#0E7A5A" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11 C8 11 9.5 14 11 14 C12.5 14 14 11 14 11" stroke="#16A97D" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="11" cy="6" r="2" fill="#0E7A5A"/>
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error: err } = await createClient().auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card card">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.75rem' }}>
          <DepgrowLogo />
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.1 }}>
              <span style={{ color: 'var(--green)' }}>Dep</span>
              <span style={{ color: 'var(--green-light)' }}>grow</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 13, fontWeight: 500, marginLeft: 6 }}>Leads</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 1 }}>Smart Lead Capture SaaS</div>
          </div>
        </div>

        <h1>Welcome back</h1>
        <p>Sign in to your dashboard</p>

        <form className="auth-form" onSubmit={submit}>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-msg">⚠ {error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? <><span className="spinner" /> Signing in…</> : 'Sign in →'}
          </button>
        </form>

        <div className="auth-footer">
          No account? <Link href="/register">Get started — ₹14,999</Link>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <Link href="https://depgrow.in" style={{ fontSize: 12, color: 'var(--text-dim)', textDecoration: 'none' }}>
            ← Back to depgrow.in
          </Link>
        </div>
      </div>
    </div>
  )
}
