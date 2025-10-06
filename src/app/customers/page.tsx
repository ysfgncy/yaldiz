import { MainLayout } from '@/components/layout/main-layout'
import { createClient } from '@/lib/supabase/server'
import CustomersClient from './customers-client'

export const revalidate = 0
export const dynamic = 'force-dynamic'

type CustomerRecord = {
  id: string
  name: string
  contact_info: string | null
  notes: string | null
  created_at: string | null
}

export default async function CustomersPage() {
  const supabase = await createClient()

  const [customersResponse, summaryResponse] = await Promise.all([
    supabase.from('customers').select('*').order('created_at', { ascending: false }),
    supabase.from('account_summary').select('customer_id, balance'),
  ])

  const customers = (customersResponse.data as CustomerRecord[]) ?? []
  const accountSummary = (summaryResponse.data as { customer_id: string; balance: number | null }[]) ?? []

  if (customersResponse.error) {
    console.error('Error fetching customers:', customersResponse.error)
  }

  if (summaryResponse.error) {
    console.error('Error fetching account summary:', summaryResponse.error)
  }

  const balanceMap = new Map<string, number>()
  accountSummary.forEach((record: { customer_id: string; balance: number | null }) => {
    balanceMap.set(record.customer_id, Number(record.balance ?? 0))
  })

  const customersWithBalance = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    contact_info: customer.contact_info ?? null,
    notes: customer.notes ?? null,
    balance: balanceMap.get(customer.id) ?? 0,
  }))

  return (
    <MainLayout
      title="Müşteriler"
      description="Müşteri listesi ve yönetimi"
    >
      <CustomersClient customers={customersWithBalance} />
    </MainLayout>
  )
}
