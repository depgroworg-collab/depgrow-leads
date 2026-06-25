import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@/lib/supabase.server'

export async function PATCH(req: NextRequest) {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id: _, customer_id: __, created_at: ___, ...updateable } = body

  const { data, error } = await sb
    .from('form_configs')
    .update(updateable)
    .eq('customer_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
