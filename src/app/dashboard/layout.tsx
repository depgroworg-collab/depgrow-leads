import { redirect } from 'next/navigation'
import { createServerActionClient } from '@/lib/supabase.server'
import DashSidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await sb.from('profiles').select('name,business_name,plan').eq('id', user.id).single()

  return (
    <div className="flex min-h-screen">
      <DashSidebar profile={{ name: profile?.name || '', business: profile?.business_name || '', plan: profile?.plan || 'free' }} />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  )
}
