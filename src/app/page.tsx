'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const Logo = () => (
  <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
    <path d="M4 16 C4 16 7 6 11 6 C15 6 18 16 18 16" stroke="#0E7A5A" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11 C8 11 9.5 14 11 14 C12.5 14 14 11 14 11" stroke="#16A97D" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="11" cy="6" r="2" fill="#0E7A5A"/>
  </svg>
)

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <nav id="main-nav">
        <Link href="/" className="nav-brand">
          <Logo />
          <span><span className="dep">Dep</span><span className="grow">grow</span></span>
          <span style={{fontSize:12,fontWeight:500,color:'var(--text-sec)',marginLeft:4}}>Leads</span>
        </Link>
        <div className="nav-links">
          <Link href="/dashboard" className="nav-btn">Dashboard</Link>
          <Link href="/login" className="nav-btn">Login</Link>
        </div>
        <Link href="/register" className="nav-cta">Get started free</Link>
        <button className={`hamburger${open?' open':''}`} onClick={()=>setOpen(!open)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`mobile-menu${open?' open':''}`}>
        <Link href="/dashboard" className="mobile-menu-btn" onClick={()=>setOpen(false)}>Dashboard</Link>
        <Link href="/login" className="mobile-menu-btn" onClick={()=>setOpen(false)}>Login</Link>
        <Link href="/register" className="mobile-cta" onClick={()=>setOpen(false)}>🚀 Get started free</Link>
      </div>
    </>
  )
}

function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef  = useRef<HTMLDivElement>(null)
  const innerRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let w = 0, h = 0, animId = 0
    let particles: {x:number;y:number;vx:number;vy:number;r:number;a:number;hue:string}[] = []

    function resize() {
      const host = canvas!.parentElement!
      w = canvas!.width  = host.offsetWidth
      h = canvas!.height = host.offsetHeight
    }
    function init() {
      particles = Array.from({length:46},()=>({
        x:Math.random()*w, y:Math.random()*h,
        vx:(Math.random()-.5)*.1, vy:(Math.random()-.5)*.1,
        r:Math.random()*1.5+.4,
        a:Math.random()*.45+.12,
        hue:Math.random()>.5?'26,255,156':'63,208,255',
      }))
    }
    function tick() {
      ctx.clearRect(0,0,w,h)
      for (const p of particles) {
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0)p.x=w; if(p.x>w)p.x=0
        if(p.y<0)p.y=h; if(p.y>h)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(${p.hue},${p.a})`; ctx.fill()
      }
      animId=requestAnimationFrame(tick)
    }
    resize(); init(); tick()
    window.addEventListener('resize',()=>{resize();init()})

    // 3D tilt
    let mx=window.innerWidth/2, my=window.innerHeight/2, cx2=mx, cy2=my, rafId=0
    const stage=stageRef.current, inner=innerRef.current
    if(stage&&inner) {
      const onMove=(e:MouseEvent)=>{mx=e.clientX;my=e.clientY}
      window.addEventListener('mousemove',onMove)
      const raf2 = () => {
        cx2+=(mx-cx2)*.08; cy2+=(my-cy2)*.08
        const rect=stage!.getBoundingClientRect()
        const rx=(cx2-(rect.left+rect.width/2))/rect.width
        const ry=(cy2-(rect.top+rect.height/2))/rect.height
        const cl=(v:number)=>Math.max(-1,Math.min(1,v))
        inner!.style.transform=`rotateY(${cl(rx)*4}deg) rotateX(${-cl(ry)*4}deg) translate(${cl(rx)*5}px,${cl(ry)*5}px)`
        rafId=requestAnimationFrame(raf2)
      }
      raf2()
      return ()=>{
        window.removeEventListener('mousemove',onMove)
        cancelAnimationFrame(animId)
        cancelAnimationFrame(rafId)
      }
    }
    return ()=>cancelAnimationFrame(animId)
  },[])

  const nodes = [
    { cls:'n2-leads',    label:'Leads',     delay:'0s',   icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
    { cls:'n2-followup', label:'Follow-Up', delay:'.8s',  icon:<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></> },
    { cls:'n2-bookings', label:'Bookings',  delay:'1.6s', icon:<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
    { cls:'n2-calls',    label:'24/7 Calls',delay:'3.2s', icon:<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2.99 .22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/> },
  ]

  return (
    <section className="hero2">
      <canvas id="particles2" ref={canvasRef} />
      <div className="hero2-grid">
        <div>
          <div className="hero2-eyebrow"><span className="dot"/>SMART LEAD CAPTURE SAAS</div>
          <h1 className="hero2-h1">
            Capture leads. <span className="leak">LEADS/span> in 60 seconds
          </h1>
          <p className="hero2-sub">A multi-step form that qualifies every lead as Hot, Warm, or Cold � and pings you on WhatsApp the moment someone submits.</p>
          <div className="hero2-actions">
            <Link href="/register" className="hero2-btn-p">🚀 Get started free</Link>
            <Link href="/login" className="hero2-btn-s">Sign in →</Link>
          </div>
          <div className="hero2-trust">
            <span className="hero2-trust-item"><i className="ti ti-shield-check"/>Zero-conflict embed</span>
            <span className="hero2-trust-item"><i className="ti ti-clock"/>Live in 60 seconds</span>
            <span className="hero2-trust-item"><i className="ti ti-chart-bar"/>Full analytics</span>
          </div>
        </div>
        <div className="stage2" ref={stageRef}>
          <div className="guide-ring2" style={{width:'80%',height:'80%'}}/>
          <div className="guide-ring2" style={{width:'110%',height:'110%'}}/>
          <svg className="connections2" viewBox="0 0 480 460" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1aff9c" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#3fd0ff" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            {['M 70 52 L 240 230','M 410 52 L 240 230','M 32 230 L 240 230','M 448 230 L 240 230','M 240 368 L 240 230'].map((d,i)=>(
              <path key={i} className="conn-line2" d={d}/>
            ))}
          </svg>
          <div className="stage2-inner" ref={innerRef}>
            <div className="hub2">
              <div className="hub2-ring r1"/><div className="hub2-ring r2"/><div className="hub2-ring r3"/>
              <div className="hub2-core">
                <h2>YOUR<span>Leads</span></h2>
                <p>LEADS</p>
              </div>
            </div>
            <div className="chip2">EMBED. <span>TRACK. GROW.</span></div>
            {nodes.map(n=>(
              <div key={n.cls} className={`node2 node2-float ${n.cls}`} style={{animationDelay:n.delay}}>
                <div className="node2-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{n.icon}</svg>
                </div>
                <div className="node2-label">{n.label}</div>
              </div>
            ))}
            {/* WhatsApp node */}
            <div className="node2 node2-float n2-whatsapp" style={{animationDelay:'2.4s'}}>
              <div className="node2-circle">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width:19,height:19,color:'#1aff9c'}}>
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2zm4.52 14.13c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13s-.64.81-.78.97c-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31s-.87.85-.87 2.08.89 2.41 1.02 2.58c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z"/>
                </svg>
              </div>
              <div className="node2-label">WhatsApp</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const tickerItems = ['WhatsApp Leads','Click Analytics','Domain Whitelisting','Live Preview','Multi-Leads','60s Setup','Zero Conflicts','Embed Anywhere']
const tickerIcons = ['ti-brand-whatsapp','ti-chart-bar','ti-lock','ti-eye','ti-layout-grid','ti-bolt','ti-shield-check','ti-code']

const clients = [
  {icon:'ti-building',name:'Mehta Clinics'},
  {icon:'ti-home',name:'Skyline Realty'},
  {icon:'ti-school',name:'GrowthEdge Academy'},
  {icon:'ti-truck',name:'SwiftLogix'},
  {icon:'ti-heart',name:'WellCare Health'},
  {icon:'ti-device-laptop',name:'TechSphere SaaS'},
  {icon:'ti-building-store',name:'RetailPro India'},
]

const features = [
  {icon:'ti-bolt',title:'60-second setup',desc:'Paste one script tag into your website. The button appears instantly — no React, no build step, no dependencies.'},
  {icon:'ti-palette',title:'Live preview builder',desc:'Choose position, colors, button size, tooltip text, and pre-filled message. Preview changes live before publishing.'},
  {icon:'ti-chart-bar',title:'Full click analytics',desc:'Track every click with country, device, and daily breakdowns. Know exactly where your WhatsApp leads come from.'},
  {icon:'ti-lock',title:'Domain whitelisting',desc:'Lock each Leads to specific domains. Your embed code only works where you intend it to.'},
  {icon:'ti-world',title:'Works everywhere',desc:'Zero-conflict isolated styles. Works on WordPress, Webflow, Wix, Shopify, plain HTML — LEADS'},
  {icon:'ti-infinity',title:'Unlimited Leadss',desc:'Create separate Leadss for each client or brand. Different numbers, messages, and designs — all in one dashboard.'},
]

const process = [
  {num:'01',title:'Create account',desc:'Sign up free and access your dashboard instantly.'},
  {num:'02',title:'Create Leads',desc:'Set your WhatsApp number, message, colors, and position.'},
  {num:'03',title:'Copy embed code',desc:'One script tag — paste it before </body> on LEADS'},
  {num:'04',title:'Track & optimise',desc:'See clicks by country, device, and day. Know what works.'},
]

export default function LandingPage() {
  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"/>
      <Navbar/>
      <Hero/>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...tickerItems,...tickerItems].map((item,i)=>(
            <span key={i} className="ticker-item">
              <i className={`ti ${tickerIcons[i%tickerIcons.length]}`}/>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Logo Strip */}
      <div className="logo-strip">
        <div className="logo-strip-inner">
          <p className="logo-strip-label">Trusted by businesses across India</p>
          <div className="logo-marquee-wrap">
            <div className="logo-marquee-track">
              {[...clients,...clients].map((c,i)=>(
                <div key={i} className="logo-pill"><i className={`ti ${c.icon}`}/>{c.name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="section" style={{marginTop:'5rem'}}>
        <p className="sec-label">Features</p>
        <h2 className="sec-h">Everything you need to capture WhatsApp leads.</h2>
        <p className="sec-sub">Built for agencies and businesses who want results, not complexity.</p>
        <div className="leak-grid">
          {features.map((f,i)=>(
            <div key={i} className="leak-card">
              <i className={`ti ${f.icon}`} style={{fontSize:28,marginBottom:'0.75rem',display:'block',color:'#16A97D'}}/>
              <div className="leak-title">{f.title}</div>
              <p className="leak-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics">
        <div className="metrics-inner">
          {[
            {val:'60s',label:'Setup time'},
            {val:'∞',label:'Websites supported'},
            {val:'100%',label:'CSS conflict free'},
            {val:'24/7',label:'Leads uptime'},
          ].map(m=>(
            <div key={m.label} className="metric">
              <div className="metric-val">{m.val}</div>
              <div className="metric-lbl">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="section">
        <p className="sec-label">How it works</p>
        <h2 className="sec-h">Live in 60 seconds. No developer needed.</h2>
        <p className="sec-sub">Four simple steps from signup to live Leads.</p>
        <div className="proc-steps">
          {process.map(p=>(
            <div key={p.num} className="proc-step">
              <div className="proc-num">{p.num}</div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why section */}
      <div className="section">
        <p className="sec-label">Why Depgrow Leads</p>
        <h2 className="sec-h">Not just a button. A revenue tool.</h2>
        <p className="sec-sub">Most WhatsApp buttons are static. Ours tracks, customises, and scales.</p>
        <div className="why-grid">
          {[
            {icon:'ti-bolt',title:'Instant response',desc:'WhatsApp opens immediately — no forms, no friction. Visitors connect in one click.'},
            {icon:'ti-chart-bar',title:'Full analytics',desc:'Track every click with country, device, and daily data. Know exactly what drives contacts.'},
            {icon:'ti-palette',title:'Live preview builder',desc:'Customise colors, position, size, and message — see changes instantly before publishing.'},
            {icon:'ti-shield-check',title:'Domain locked',desc:'Your embed code only works on your whitelisted domains — no unauthorised usage.'},
          ].map(w=>(
            <div key={w.title} className="why-card">
              <i className={`ti ${w.icon}`}/>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee */}
      <div className="guarantee-strip">
        <div className="guarantee-inner">
          <div className="guarantee-badge">⚡</div>
          <h2>Live in 60 seconds. Guaranteed.</h2>
          <p>If you can paste a script tag, you can embed a Depgrow WhatsApp Leads. Works on LEADS any platform, any CMS.</p>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-band">
        <h2>Ready to add WhatsApp to your website?</h2>
        <p>Free to start. One line of code. Full analytics. No developer needed.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/register" className="btn-white">🚀 Get started free</Link>
          <a href="https://wa.me/918309553962" target="_blank" rel="noopener noreferrer" className="btn-wa-cta">
            <i className="ti ti-brand-whatsapp"/>WhatsApp us
          </a>
        </div>
        <p className="cta-note">No credit card required · Free forever plan available</p>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-brand"><Logo/><span style={{color:'#fff'}}><span style={{color:'#1aff9c'}}>Dep</span><span style={{color:'#3fd0ff'}}>grow</span> Leads</span></div>
            <p className="footer-tagline">WhatsApp chat Leadss with full analytics — built for Depgrow clients and beyond.</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/depgrow" target="_blank" rel="noopener noreferrer"><i className="ti ti-brand-instagram"/></a>
              <a href="https://www.linkedin.com/in/valluri-satyannarayana-247463418" target="_blank" rel="noopener noreferrer"><i className="ti ti-brand-linkedin"/></a>
              <a href="https://wa.me/918309553962" target="_blank" rel="noopener noreferrer"><i className="ti ti-brand-whatsapp"/></a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <ul className="footer-col-links">
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/register">Create Leads</Link></li>
              <li><Link href="/login">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-col-links">
              <li><a href="https://depgrow.in" target="_blank" rel="noopener noreferrer">Depgrow.in</a></li>
              <li><a href="https://wa.me/918309553962" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-col-links">
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Depgrow. All rights reserved. Hyderabad, India.</div>
          <div className="footer-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
