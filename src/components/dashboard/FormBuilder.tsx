'use client'
import { useState } from 'react'
import type { FormConfig } from '@/types'

interface Props { initialConfig: FormConfig | null; customerId: string }

const DEFAULT_SERVICES = ['Web Design','SEO','Social Media','Paid Ads','AI Automation','Branding','Other']

export default function FormBuilder({ initialConfig, customerId }: Props) {
  const [cfg, setCfg]     = useState<Partial<FormConfig>>(initialConfig || {
    title: 'Get a Free Quote', subtitle: 'Tell us about your project.',
    primary_color: '#7C3AED', bg_color: '#ffffff', text_color: '#111827',
    button_text: 'Get My Free Quote →',
    thank_you_title: '🎉 Thank you!',
    thank_you_message: "We've received your details and will reach out within 24 hours.",
    services: DEFAULT_SERVICES,
    whatsapp_number: '', embed_type: 'floating', is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast]   = useState<string | null>(null)
  const [newSvc, setNewSvc] = useState('')
  const [tab, setTab]       = useState<'content'|'design'|'advanced'>('content')

  function set<K extends keyof FormConfig>(k: K, v: FormConfig[K]) {
    setCfg(p => ({ ...p, [k]: v }))
  }

  async function save() {
    setSaving(true)
    const res = await fetch('/api/form/update', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg),
    })
    if (res.ok) { setToast('Form saved ✅') } else { setToast('Save failed ❌') }
    setTimeout(() => setToast(null), 2500)
    setSaving(false)
  }

  function addService() {
    if (!newSvc.trim()) return
    set('services', [...(cfg.services||[]), newSvc.trim()])
    setNewSvc('')
  }
  function removeService(s: string) {
    set('services', (cfg.services||[]).filter(x => x !== s))
  }

  const pc = cfg.primary_color || '#7C3AED'
  const bg = cfg.bg_color      || '#ffffff'
  const tc = cfg.text_color    || '#111827'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div>
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-white/5 pb-0">
          {(['content','design','advanced'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${tab===t?'border-brand text-brand':'border-transparent text-gray-500 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'content' && (
          <div className="flex flex-col gap-4">
            <div className="field"><label className="label">Form title</label>
              <input className="input" value={cfg.title||''} onChange={e=>set('title',e.target.value)} /></div>
            <div className="field"><label className="label">Subtitle</label>
              <textarea className="input" rows={2} value={cfg.subtitle||''} onChange={e=>set('subtitle',e.target.value)} /></div>
            <div className="field"><label className="label">Button text</label>
              <input className="input" value={cfg.button_text||''} onChange={e=>set('button_text',e.target.value)} /></div>
            <div className="field"><label className="label">Thank-you title</label>
              <input className="input" value={cfg.thank_you_title||''} onChange={e=>set('thank_you_title',e.target.value)} /></div>
            <div className="field"><label className="label">Thank-you message</label>
              <textarea className="input" rows={2} value={cfg.thank_you_message||''} onChange={e=>set('thank_you_message',e.target.value)} /></div>
            <div className="field">
              <label className="label">Services (shown in dropdown)</label>
              <div className="flex gap-2 mb-2">
                <input className="input" placeholder="Add a service…" value={newSvc} onChange={e=>setNewSvc(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addService())} />
                <button type="button" className="btn btn-ghost shrink-0" onClick={addService}>Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(cfg.services||[]).map(s => (
                  <span key={s} className="flex items-center gap-1.5 bg-gray-800 border border-white/10 rounded-lg px-3 py-1 text-xs">
                    {s}
                    <button type="button" onClick={()=>removeService(s)} className="text-gray-400 hover:text-red-400 ml-0.5">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'design' && (
          <div className="flex flex-col gap-4">
            <div className="field"><label className="label">Embed type</label>
              <select className="input" value={cfg.embed_type||'floating'} onChange={e=>set('embed_type',e.target.value as FormConfig['embed_type'])}>
                <option value="floating">Floating button</option>
                <option value="inline">Inline (auto-renders)</option>
              </select>
            </div>
            {[
              { label: 'Primary color',     key: 'primary_color' as const },
              { label: 'Background color',  key: 'bg_color'      as const },
              { label: 'Text color',        key: 'text_color'    as const },
            ].map(({ label, key }) => (
              <div key={key} className="field">
                <label className="label">{label}</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={(cfg[key] as string)||'#000'} onChange={e=>set(key,e.target.value)}
                    className="w-9 h-9 rounded-lg border border-white/10 p-0 cursor-pointer bg-transparent" />
                  <input className="input font-mono" value={(cfg[key] as string)||''} onChange={e=>set(key,e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'advanced' && (
          <div className="flex flex-col gap-4">
            <div className="field">
              <label className="label">WhatsApp number for alerts</label>
              <input className="input" placeholder="918309553962 (with country code)" value={cfg.whatsapp_number||''} onChange={e=>set('whatsapp_number',e.target.value)} />
              <p className="text-xs text-gray-500 mt-1">You'll get a WhatsApp message for every lead.</p>
            </div>
            <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
              <div><div className="text-sm font-medium">Form active</div><div className="text-xs text-gray-500">Disable to stop accepting submissions</div></div>
              <button
                onClick={() => set('is_active', !cfg.is_active)}
                className={`relative w-10 h-5.5 rounded-full transition-colors ${cfg.is_active?'bg-brand':'bg-gray-700'}`}
                style={{width:40,height:22}}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${cfg.is_active?'left-5':'left-0.5'}`} style={{width:18,height:18,top:2,left:cfg.is_active?20:2}}/>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button onClick={save} className="btn btn-brand" disabled={saving}>
            {saving ? 'Saving…' : 'Save form →'}
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="sticky top-4">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Live Preview</div>
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: bg }}>
          {/* browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-100">
            {['#FF5F57','#FFBD2E','#28CA41'].map(c => <span key={c} style={{width:10,height:10,borderRadius:'50%',background:c,display:'inline-block'}}/>)}
            <span className="flex-1 mx-2 bg-white rounded text-gray-400 text-xs px-2 py-0.5">yourwebsite.com</span>
          </div>
          {/* form preview */}
          <div className="p-6" style={{ color: tc }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: tc }}>{cfg.title || 'Get a Free Quote'}</h2>
            <p className="text-sm mb-5 opacity-70">{cfg.subtitle || 'Tell us about your project.'}</p>

            {/* Step preview */}
            <div className="flex flex-col gap-3">
              {['Your name', 'Phone number', 'Email address'].map(ph => (
                <input key={ph} disabled placeholder={ph} className="w-full rounded-lg px-3 py-2 text-sm border"
                  style={{ background: bg === '#ffffff' ? '#f9fafb' : 'rgba(0,0,0,0.06)', borderColor: 'rgba(0,0,0,0.12)', color: tc, opacity: 0.7 }} />
              ))}
              <select disabled className="w-full rounded-lg px-3 py-2 text-sm border"
                style={{ background: bg === '#ffffff' ? '#f9fafb' : 'rgba(0,0,0,0.06)', borderColor: 'rgba(0,0,0,0.12)', color: tc, opacity: 0.7 }}>
                <option>Select a service…</option>
              </select>
              <button disabled className="w-full rounded-lg py-2.5 text-sm font-bold text-white" style={{ background: pc }}>
                {cfg.button_text || 'Get My Free Quote →'}
              </button>
            </div>
            <p className="text-xs text-center mt-3 opacity-40">Powered by Depgrow</p>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-800 border border-white/10 rounded-xl px-5 py-3 text-sm font-medium shadow-2xl animate-slide-up z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
