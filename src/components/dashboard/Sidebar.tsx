'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Props { profile: { name: string; business: string; plan: string } }

const NAV = [
  { href: '/dashboard',          label: 'Overview',     icon: 'ti-home' },
  { href: '/dashboard/leads',    label: 'Leads',        icon: 'ti-users' },
  { href: '/dashboard/form',     label: 'Form Builder', icon: 'ti-layout' },
  { href: '/dashboard/settings', label: 'Settings',     icon: 'ti-settings' },
]

const DepgrowLogo = () => (
  <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
    <path d="M4 16 C4 16 7 6 11 6 C15 6 18 16 18 16" stroke="#0E7A5A" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11 C8 11 9.5 14 11 14 C12.5 14 14 11 14 11" stroke="#16A97D" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="11" cy="6" r="2" fill="#0E7A5A"/>
  </svg>
)

export default function Sidebar({ profile }: Props) {
  const pathname = usePathname()
  const router   = useRouter()

  async function signOut() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo-wrap">
        <Link href="/dashboard" className="depgrow-logo" style={{ textDecoration: 'none' }}>
          <DepgrowLogo />
          <span>
            <span className="dep">Dep</span><span className="grow">grow</span>
          </span>
          <span className="depgrow-logo-sub">Leads</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="sidebar-section">Menu</div>
      {NAV.map(n => (
        <Link
          key={n.href}
          href={n.href}
          className={`sidebar-link${pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)) ? ' active' : ''}`}
        >
          <i className={`ti ${n.icon}`} />
          {n.label}
        </Link>
      ))}

      {/* User */}
      <div className="sidebar-bottom">
        <div className="sidebar-user-name">{profile.business || profile.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span className={`badge badge-${profile.plan === 'pro' ? 'green' : 'gray'}`}>
            {profile.plan}
          </span>
          <button onClick={signOut} className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}>
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}
