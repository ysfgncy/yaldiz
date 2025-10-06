import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type CustomerRef = {
  id: string
  name: string
}

type JobRef = {
  id: string
  job_name: string
}

type PaymentRecord = {
  id: string
  amount: string | number
  payment_type: string
  payment_date: string
  notes: string | null
  customer: CustomerRef | null
  job: JobRef | null
}

type PaymentRecordRaw = Omit<PaymentRecord, 'customer' | 'job'> & {
  customer: CustomerRef[] | CustomerRef | null
  job: JobRef[] | JobRef | null
}

export const revalidate = 0
export const dynamic = 'force-dynamic'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

export default async function PaymentsPage() {
  const supabase = await createClient()

  const { data: payments, error } = await supabase
    .from('payments')
    .select('id, amount, payment_type, payment_date, notes, customer:customers(id, name), job:jobs(id, job_name)')
    .order('payment_date', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', error)
  }

  const paymentsRaw = (payments as PaymentRecordRaw[] | null) ?? []

  const normalizeRelation = <T extends CustomerRef | JobRef>(value: T[] | T | null): T | null => {
    if (!value) return null
    if (Array.isArray(value)) {
      return value[0] ?? null
    }
    return value
  }

  const normalizedPayments: PaymentRecord[] = paymentsRaw.map((payment) => ({
    ...payment,
    customer: normalizeRelation(payment.customer),
    job: normalizeRelation(payment.job),
  }))

  const totalPaid = normalizedPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)

  return (
    <MainLayout
      title="Ödemeler"
      description="Ödeme kayıtlarını görüntüle ve yönet"
    >
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-end">
          <div>
            <p className="text-sm text-gray-500">Toplam Tahsilat</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {currencyFormatter.format(totalPaid)}
            </p>
          </div>
          <Link href="/payments/new" className="w-full lg:w-auto">
            <Button className="w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ödeme
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ödeme Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            {normalizedPayments.length > 0 ? (
              <Table className="w-full table-fixed text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Müşteri</TableHead>
                    <TableHead className="w-1/4">Tutar</TableHead>
                    <TableHead className="w-1/4 text-right">Tarih</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {normalizedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="truncate">
                        {payment.customer ? (
                          <Link
                            href={`/customers/${payment.customer.id}`}
                            className="text-blue-600 hover:underline block truncate"
                          >
                            {payment.customer.name}
                          </Link>
                        ) : (
                          <span className="text-gray-500">Müşteri bilgisi yok</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        ₺{Math.trunc(Number(payment.amount || 0)).toLocaleString('tr-TR')}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {new Date(payment.payment_date).toLocaleDateString('tr-TR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  Henüz ödeme kaydı bulunmuyor
                </p>
                <Link href="/payments/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Ödemeyi Ekle
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
