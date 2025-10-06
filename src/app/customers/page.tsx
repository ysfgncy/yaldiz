import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0
export const dynamic = 'force-dynamic'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

export default async function CustomersPage() {
  const supabase = await createClient()

  const [customersResponse, summaryResponse] = await Promise.all([
    supabase.from('customers').select('*').order('created_at', { ascending: false }),
    supabase.from('account_summary').select('customer_id, balance'),
  ])

  const customers = customersResponse.data ?? []
  const accountSummary = summaryResponse.data ?? []

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

  return (
    <MainLayout
      title="Müşteriler"
      description="Müşteri listesi ve yönetimi"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative flex-1 min-w-0 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Müşteri ara..."
              className="pl-10"
            />
          </div>
          <Link href="/customers/new" className="w-full lg:w-auto">
            <Button className="w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Müşteri
            </Button>
          </Link>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            {customers && customers.length > 0 ? (
              <div className="-mx-4 sm:mx-0 overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Müşteri Adı</TableHead>
                      <TableHead>Bakiye Durumu</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => {
                      const balance = balanceMap.get(customer.id) ?? 0
                      const balanceColor = balance > 0
                        ? 'text-red-600'
                        : balance < 0
                          ? 'text-green-600'
                          : 'text-gray-600'

                      return (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">
                            <Link
                              href={`/customers/${customer.id}`}
                              className="hover:underline"
                            >
                              {customer.name}
                            </Link>
                          </TableCell>
                          <TableCell className={balanceColor}>
                            {currencyFormatter.format(balance)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/payments/new?customerId=${customer.id}`}>
                                <Button variant="outline" size="sm">
                                  Ödeme Ekle
                                </Button>
                              </Link>
                              <Link href={`/jobs/new?customerId=${customer.id}`}>
                                <Button variant="outline" size="sm">
                                  İş Ekle
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  Henüz müşteri kaydı bulunmuyor
                </p>
                <Link href="/customers/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Müşteriyi Ekle
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
