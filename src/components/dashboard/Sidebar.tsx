'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Props { profile: { name: string; business: string; plan: string } }

const NAV = [
  { href: '/dashboard',          label: 'Overview',     icon: '🏠' },
  { href: '/dashboard/leads',    label: 'Leads',        icon: '📋' },
  { href: '/dashboard/form',     label: 'Form Builder', icon: '🎨' },
  { href: '/dashboard/settings', label: 'Settings',     icon: '⚙️' },
]

export default function Sidebar({ profile }: Props) {
  const path   = usePathname()
  const router = useRouter()

  async function signOut() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-56 bg-gray-900 border-r border-white/5 flex flex-col py-5 shrink-0 sticky top-0 h-screen">
      <div className="px-5 mb-6">
        <div className="text-lg font-extrabold"><span className="text-brand">Dep</span>grow <span className="text-gray-500 font-normal text-sm">Leads</span></div>
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {NAV.map(n => (
          <Link
            key={n.href}
            href={n.href}
            className={`sidebar-link${path === n.href || (n.href !== '/dashboard' && path.startsWith(n.href)) ? ' active' : ''}`}
          >
            <span className="text-base">{n.icon}</span>{n.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-4 pt-5 border-t border-white/5">
        <div className="text-sm font-semibold truncate">{profile.business || profile.name}</div>
        <div className="flex items-center justify-between mt-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${profile.plan === 'pro' ? 'bg-brand/20 text-brand' : 'bg-white/8 text-gray-400'}`}>{profile.plan}</span>
          <button onClick={signOut} className="text-xs text-gray-500 hover:text-white transition-colors">Sign out</button>
        </div>
      </div>
    </aside>
  )
}
