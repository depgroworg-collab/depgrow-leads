import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createServerActionClient(): Promise<any> {
  const cookieStore = await cookies()
  return createServerClient(URL, ANON, {
    cookies: {
      getAll()      { return cookieStore.getAll() },
      setAll(toSet) { try { toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
    },
  }) as any
}

export function createServiceClient(): any {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  ) as any
}