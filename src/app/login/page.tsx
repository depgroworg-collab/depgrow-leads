'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
    <path d="M4 16 C4 16 7 6 11 6 C15 6 18 16 18 16" stroke="#0E7A5A" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11 C8 11 9.5 14 11 14 C12.5 14 14 11 14 11" stroke="#16A97D" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="11" cy="6" r="2" fill="#0E7A5A"/>
  </svg>
)

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error: err } = await createClient().auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    router.push(searchParams.get('redirect') ?? '/dashboard')
    router.refresh()
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'2rem'}}>
          <Logo />
          <span style={{fontSize:20,fontWeight:800}}>
            <span style={{color:'#0E7A5A'}}>Dep</span><span style={{color:'#16A97D'}}>grow</span>
            <span style={{fontSize:13,fontWeight:500,color:'#9CA3AF',marginLeft:6}}>Leads</span>
          </span>
        </div>
        <h1 style={{fontSize:26,fontWeight:800,color:'#111827',marginBottom:6}}>Welcome back</h1>
        <p style={{fontSize:14,color:'#6B7280',marginBottom:'2rem'}}>Sign in to your dashboard</p>
        {error && <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#DC2626',marginBottom:'1rem'}}>⚠ {error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          {[
            {label:'Email',type:'email',val:email,set:setEmail,ph:'you@company.com'},
            {label:'Password',type:'password',val:password,set:setPassword,ph:'••••••••'},
          ].map(f => (
            <div key={f.label} className="field">
              <label className="label">{f.label}</label>
              <div style={{border:'1.5px solid #E5E7EB',borderRadius:10,background:'#fff'}}>
                <input type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} required
                  style={{width:'100%',border:'none',outline:'none',padding:'12px 14px',fontSize:14,color:'#111827',borderRadius:10,background:'transparent',fontFamily:'inherit',boxSizing:'border-box'}}
                  onFocus={e=>(e.target.parentElement!.style.borderColor='#0E7A5A')}
                  onBlur={e=>(e.target.parentElement!.style.borderColor='#E5E7EB')}
                />
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{width:'100%',padding:'14px',background:'linear-gradient(100deg,#0E7A5A,#16A97D)',color:'#fff',border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,fontFamily:'inherit',boxShadow:'0 8px 24px rgba(14,122,90,0.25)',marginTop:4}}>
            {loading ? '⏳ Signing in…' : 'Sign in →'}
          </button>
        </form>
        <div className="auth-footer">No account? <Link href="/register">Get started — ₹14,999</Link></div>
        <div style={{textAlign:'center',marginTop:'1.5rem',paddingTop:'1.5rem',borderTop:'1px solid #F3F4F6'}}>
          <Link href="/" style={{fontSize:12,color:'#9CA3AF',textDecoration:'none'}}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-wrap"><div style={{color:'#0E7A5A'}}>Loading…</div></div>}>
      <LoginInner />
    </Suspense>
  )
}
