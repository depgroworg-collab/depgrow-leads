'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function SettingsPage() {
  const [name, setName]   = useState('')
  const [biz, setBiz]     = useState('')
  const [wa, setWa]       = useState('')
  const [saving, setSave] = useState(false)
  const [toast, setToast] = useState<string|null>(null)

  useEffect(() => {
    const sb = createClient()
    sb.from('profiles').select('name,business_name,whatsapp_number').single().then(({ data }) => {
      if (data) { setName(data.name||''); setBiz(data.business_name||''); setWa(data.whatsapp_number||'') }
    })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSave(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    await sb.from('profiles').update({ name, business_name: biz, whatsapp_number: wa.replace(/\D/g,'') }).eq('id', user!.id)
    setToast('Saved ✅'); setTimeout(() => setToast(null), 2500); setSave(false)
  }

  return (
    <>
      <header className="flex items-center px-8 py-4 border-b border-white/5 bg-gray-900">
        <h1 className="text-lg font-bold">Settings</h1>
      </header>
      <div className="flex-1 p-8 max-w-lg">
        <div className="card">
          <h2 className="font-bold text-base mb-5">Account</h2>
          <form onSubmit={save} className="flex flex-col gap-4">
            <div className="field"><label className="label">Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
            <div className="field"><label className="label">Business name</label><input className="input" value={biz} onChange={e=>setBiz(e.target.value)} /></div>
            <div className="field">
              <label className="label">WhatsApp number (for lead alerts)</label>
              <input className="input" placeholder="918309553962 (with country code)" value={wa} onChange={e=>setWa(e.target.value)} />
              <p className="text-xs text-gray-500 mt-1">This is where new lead notifications are sent.</p>
            </div>
            <button className="btn btn-brand self-start" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          </form>
        </div>
        {toast && (
          <div className="fixed bottom-6 right-6 bg-gray-800 border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-xl animate-slide-up">
            {toast}
          </div>
        )}
      </div>
    </>
  )
}
