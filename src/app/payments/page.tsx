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

type PaymentRecord = {
  id: string
  amount: string | number
  payment_type: string
  payment_date: string
  notes: string | null
  customer: {
    id: string
    name: string
  } | null
  job: {
    id: string
    job_name: string
  } | null
}

type PaymentRecordRaw = Omit<PaymentRecord, 'customer' | 'job'> & {
  customer: {
    id: string
    name: string
  }[] | null
  job: {
    id: string
    job_name: string
  }[] | null
}

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
  const normalizedPayments: PaymentRecord[] = paymentsRaw.map((payment) => ({
    ...payment,
    customer: payment.customer?.[0] ?? null,
    job: payment.job?.[0] ?? null,
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
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Müşteri</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Ödeme Tipi</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>İlişkili İş</TableHead>
                    <TableHead>Not</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {normalizedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.customer ? (
                          <Link
                            href={`/customers/${payment.customer.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {payment.customer.name}
                          </Link>
                        ) : (
                          <span className="text-gray-500">Müşteri bilgisi yok</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {currencyFormatter.format(Number(payment.amount || 0))}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {payment.payment_type === 'nakit'
                            ? 'Nakit'
                            : payment.payment_type === 'havale'
                              ? 'Havale/EFT'
                              : 'Çek'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.payment_date).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell>
                        {payment.job ? (
                          <Link
                            href={`/jobs/${payment.job.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {payment.job.job_name}
                          </Link>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {payment.notes ? (
                          <span className="line-clamp-1">{payment.notes}</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/payments/${payment.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Düzenle
                          </Button>
                        </Link>
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
