'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
    <path d="M4 16 C4 16 7 6 11 6 C15 6 18 16 18 16" stroke="#0E7A5A" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11 C8 11 9.5 14 11 14 C12.5 14 14 11 14 11" stroke="#16A97D" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="11" cy="6" r="2" fill="#0E7A5A"/>
  </svg>
)

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'details'|'payment'>('details')
  const [name, setName] = useState('')
  const [business, setBusiness] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  async function handleDetails(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError(null); setStep('payment')
  }

  async function handlePayment() {
    setLoading(true); setError(null)
    try {
      const { error: err } = await createClient().auth.signUp({
        email, password,
        options: { data: { name, business_name: business } },
      })
      if (err) throw err
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message || 'Something went wrong.')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width:'100%', border:'none', outline:'none',
    padding:'12px 14px', fontSize:14, color:'#111827',
    borderRadius:10, background:'transparent',
    fontFamily:'inherit', boxSizing:'border-box'
  }
  const wrapStyle = (focused=false): React.CSSProperties => ({
    border:`1.5px solid ${focused?'#0E7A5A':'#E5E7EB'}`,
    borderRadius:10, background:'#fff'
  })

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      <div style={{width:'100%',maxWidth:480,background:'#fff',borderRadius:20,padding:'2.5rem',boxShadow:'0 4px 32px rgba(0,0,0,0.08)',border:'1px solid #E5E7EB'}}>

        {/* Logo */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'2rem'}}>
          <Logo />
          <span style={{fontSize:20,fontWeight:800}}>
            <span style={{color:'#0E7A5A'}}>Dep</span><span style={{color:'#16A97D'}}>grow</span>
            <span style={{fontSize:13,fontWeight:500,color:'#9CA3AF',marginLeft:6}}>Leads</span>
          </span>
        </div>

        {step === 'details' ? (
          <>
            <h1 style={{fontSize:26,fontWeight:800,color:'#111827',marginBottom:6}}>Create account</h1>
            <p style={{fontSize:14,color:'#6B7280',marginBottom:'2rem'}}>₹14,999 one-time · Unlimited leads</p>
            {error && <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#DC2626',marginBottom:'1rem'}}>⚠ {error}</div>}
            <form onSubmit={handleDetails} style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              {[
                {label:'Your name',type:'text',val:name,set:setName,ph:'Full name'},
                {label:'Business name',type:'text',val:business,set:setBusiness,ph:'Your company'},
                {label:'Email address',type:'email',val:email,set:setEmail,ph:'you@company.com'},
                {label:'Password',type:'password',val:password,set:setPassword,ph:'Min 8 characters'},
              ].map(f => (
                <div key={f.label}>
                  <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6}}>{f.label} *</label>
                  <div style={wrapStyle()}>
                    <input type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} required style={inputStyle}
                      onFocus={e=>(e.target.parentElement!.style.borderColor='#0E7A5A')}
                      onBlur={e=>(e.target.parentElement!.style.borderColor='#E5E7EB')}
                    />
                  </div>
                </div>
              ))}
              <button type="submit" style={{width:'100%',padding:'14px',background:'linear-gradient(100deg,#0E7A5A,#16A97D)',color:'#fff',border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:'0 8px 24px rgba(14,122,90,0.25)',marginTop:4}}>
                Continue to payment →
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{fontSize:26,fontWeight:800,color:'#111827',marginBottom:6}}>One last step</h1>
            <p style={{fontSize:14,color:'#6B7280',marginBottom:'1.5rem'}}>Complete payment to activate your account.</p>
            <div style={{background:'#F0FDF7',border:'1px solid #D6F4EC',borderRadius:14,padding:'1.25rem',marginBottom:'1.5rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:'#111827'}}>Depgrow Leads — Lifetime Access</div>
                  <div style={{fontSize:12,color:'#6B7280',marginTop:3}}>Unlimited leads · WhatsApp alerts · Lead CRM</div>
                </div>
                <div style={{fontSize:22,fontWeight:800,color:'#0E7A5A'}}>₹14,999</div>
              </div>
            </div>
            {error && <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#DC2626',marginBottom:'1rem'}}>⚠ {error}</div>}
            <button onClick={handlePayment} disabled={loading}
              style={{width:'100%',padding:'14px',background:'linear-gradient(100deg,#0E7A5A,#16A97D)',color:'#fff',border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,fontFamily:'inherit',boxShadow:'0 8px 24px rgba(14,122,90,0.25)',marginBottom:10}}>
              {loading ? '⏳ Processing…' : '🔒 Pay ₹14,999 & Activate'}
            </button>
            <button onClick={()=>setStep('details')} style={{width:'100%',padding:'10px',background:'transparent',border:'1px solid #E5E7EB',borderRadius:10,fontSize:13,color:'#6B7280',cursor:'pointer',fontFamily:'inherit'}}>
              ← Back
            </button>
            <p style={{textAlign:'center',fontSize:12,color:'#9CA3AF',marginTop:10}}>Secured by Razorpay</p>
          </>
        )}

        <p style={{textAlign:'center',fontSize:13,color:'#6B7280',marginTop:'1.5rem'}}>
          Already have an account? <Link href="/login" style={{color:'#0E7A5A',fontWeight:600,textDecoration:'none'}}>Sign in</Link>
        </p>
        <div style={{textAlign:'center',marginTop:'1.25rem',paddingTop:'1.25rem',borderTop:'1px solid #F3F4F6'}}>
          <Link href="/" style={{fontSize:12,color:'#9CA3AF',textDecoration:'none'}}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
