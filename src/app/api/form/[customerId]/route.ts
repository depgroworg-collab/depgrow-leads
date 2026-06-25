import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase.server'

const CORS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=60' }

export async function GET(_: NextRequest, { params }: { params: { customerId: string } }) {
  try {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('form_configs')
      .select('*')
      .eq('customer_id', params.customerId)
      .single()

    if (error || !data) return NextResponse.json({ error: 'Form not found' }, { status: 404, headers: CORS })
    if (!data.is_active) return NextResponse.json({ error: 'Form inactive' }, { status: 403, headers: CORS })

    return NextResponse.json({ data }, { headers: CORS })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: CORS })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET, OPTIONS' } })
}
