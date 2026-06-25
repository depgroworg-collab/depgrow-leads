'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

declare global { interface Window { Razorpay: any } }

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep]         = useState<'details' | 'payment'>('details')
  const [name, setName]         = useState('')
  const [business, setBusiness] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleDetails(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError(null)
    setStep('payment')
  }

  async function handlePayment() {
    setLoading(true); setError(null)
    try {
      // 1. Create Razorpay order
      const orderRes = await fetch('/api/razorpay/order', { method: 'POST' })
      const { orderId, amount, currency } = await orderRes.json()

      // 2. Load Razorpay script
      await new Promise<void>((res, rej) => {
        if (window.Razorpay) return res()
        const s = document.createElement('script')
        s.src = 'https://checkout.razorpay.com/v1/checkout.js'
        s.onload = () => res(); s.onerror = rej
        document.head.appendChild(s)
      })

      // 3. Open checkout
      await new Promise<void>((resolve, reject) => {
        const rz = new window.Razorpay({
          key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount, currency,
          order_id:    orderId,
          name:        'Depgrow Leads',
          description: 'Smart Lead Capture — One-time licence',
          prefill:     { name, email },
          theme:       { color: '#7C3AED' },
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            // 4. Verify payment
            const vRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            if (!vRes.ok) { reject(new Error('Payment verification failed')); return }
            resolve()
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        })
        rz.open()
      })

      // 5. Create Supabase account
      const { error: authErr } = await createClient().auth.signUp({
        email, password,
        options: { data: { name, business_name: business } },
      })
      if (authErr) throw authErr

      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm card animate-fade-in">
        <div className="text-xl font-extrabold mb-6"><span className="text-brand">Dep</span>grow Leads</div>

        {step === 'details' ? (
          <>
            <h1 className="text-2xl font-bold mb-1">Create account</h1>
            <p className="text-sm text-gray-500 mb-6">₹14,999 one-time · Unlimited leads</p>
            <form onSubmit={handleDetails} className="flex flex-col gap-4">
              <div className="field"><label className="label">Your name</label><input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required /></div>
              <div className="field"><label className="label">Business name</label><input className="input" placeholder="Your company" value={business} onChange={e=>setBusiness(e.target.value)} required /></div>
              <div className="field"><label className="label">Email</label><input className="input" type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
              <div className="field"><label className="label">Password</label><input className="input" type="password" placeholder="Min 8 characters" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
              {error && <p className="text-red-400 text-xs">⚠ {error}</p>}
              <button className="btn btn-brand w-full justify-center" type="submit">Continue to payment →</button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-1">One last step</h1>
            <p className="text-sm text-gray-500 mb-6">Complete payment to activate your account.</p>
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div><div className="font-semibold">Depgrow Leads — Lifetime Access</div><div className="text-xs text-gray-500 mt-0.5">Unlimited leads · WhatsApp alerts · Lead CRM</div></div>
                <div className="text-xl font-bold text-brand">₹14,999</div>
              </div>
            </div>
            {error && <p className="text-red-400 text-xs mb-4">⚠ {error}</p>}
            <button className="btn btn-brand w-full justify-center btn-lg" onClick={handlePayment} disabled={loading}>
              {loading ? 'Processing…' : '🔒 Pay ₹14,999 & Activate'}
            </button>
            <button className="btn btn-ghost w-full justify-center mt-2 text-xs" onClick={() => setStep('details')}>← Back</button>
            <p className="text-center text-xs text-gray-600 mt-3">Secured by Razorpay</p>
          </>
        )}
        <p className="text-center text-sm text-gray-500 mt-5">Already have an account? <Link href="/login" className="text-brand font-semibold">Sign in</Link></p>
      </div>
    </div>
  )
}
