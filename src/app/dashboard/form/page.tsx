import { createServerActionClient } from '@/lib/supabase'
import FormBuilder from '@/components/dashboard/FormBuilder'

export default async function FormPage() {
  const sb = await createServerActionClient()
  const { data: { user } } = await sb.auth.getUser()

  const { data: form } = await sb
    .from('form_configs')
    .select('*')
    .eq('customer_id', user!.id)
    .single()

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-gray-900">
        <h1 className="text-lg font-bold">Form Builder</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        <FormBuilder initialConfig={form} customerId={user!.id} />
      </div>
    </>
  )
}
