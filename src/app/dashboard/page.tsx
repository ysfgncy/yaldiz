import { MainLayout } from '@/components/layout/main-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { Briefcase, CreditCard, UserPlus } from 'lucide-react'
import Link from 'next/link'

const numberFormatter = new Intl.NumberFormat('tr-TR')
const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

type PaymentAggregate = {
  amount: number | string | null
}

type AccountSummaryRecord = {
  customer_id: string
  customer_name: string
  total_jobs: number | string | null
  total_payments: number | string | null
  balance: number | string | null
}

type RecentJobRecord = {
  id: string
  job_name: string
  price: number | string | null
  status: 'bekliyor' | 'tamamlandı'
  created_date: string | null
  customer: {
    id: string
    name: string
  } | null
}

type CustomerRelation = {
  id: string
  name: string
}

type RecentJobRecordRaw = Omit<RecentJobRecord, 'customer'> & {
  customer: CustomerRelation | CustomerRelation[] | null | undefined
}

function formatDate(value: string | null): string {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('tr-TR')
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const monthStartStr = monthStart.toISOString().slice(0, 10)
  const monthEndStr = monthEnd.toISOString().slice(0, 10)

  const [
    customersRes,
    pendingJobsRes,
    paymentsThisMonthRes,
    accountSummaryRes,
    recentJobsRes,
  ] = await Promise.all([
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'bekliyor'),
    supabase
      .from('payments')
      .select('amount, payment_date')
      .gte('payment_date', monthStartStr)
      .lte('payment_date', monthEndStr),
    supabase
      .from('account_summary')
      .select('customer_id, customer_name, total_jobs, total_payments, balance'),
    supabase
      .from('jobs')
      .select('id, job_name, price, status, created_date, customer:customers(id, name)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const dashboardErrors: Array<[string, typeof customersRes.error]> = [
    ['customers', customersRes.error],
    ['pendingJobs', pendingJobsRes.error],
    ['payments', paymentsThisMonthRes.error],
    ['accountSummary', accountSummaryRes.error],
    ['recentJobs', recentJobsRes.error],
  ]

  dashboardErrors.forEach(([label, error]) => {
    if (error) {
      console.error(`Dashboard ${label} fetch error:`, error.message)
    }
  })

  const totalCustomers = customersRes.count ?? 0
  const pendingJobs = pendingJobsRes.count ?? 0

  const paymentsThisMonth = ((paymentsThisMonthRes.data as PaymentAggregate[]) ?? []).reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  )

  const accountSummary = (accountSummaryRes.data as AccountSummaryRecord[]) ?? []
  const outstandingTotal = accountSummary.reduce((sum, record) => {
    const balance = Number(record.balance ?? 0)
    return balance > 0 ? sum + balance : sum
  }, 0)

  const topOutstanding = accountSummary
    .filter((record) => Number(record.balance ?? 0) > 0)
    .sort((a, b) => Number(b.balance ?? 0) - Number(a.balance ?? 0))
    .slice(0, 5)

  const recentJobsRaw = (recentJobsRes.data as RecentJobRecordRaw[]) ?? []
  const recentJobs: RecentJobRecord[] = recentJobsRaw.map(({ customer, ...job }) => {
    const normalizedCustomer = Array.isArray(customer) ? customer[0] : customer

    return {
      ...job,
      customer: normalizedCustomer ?? null,
    }
  })

  const quickActions = [
    {
      title: 'İş Ekle',
      href: '/jobs/new',
      icon: Briefcase,
      subtitle: `${numberFormatter.format(pendingJobs)} bekleyen iş`,
    },
    {
      title: 'Müşteri Ekle',
      href: '/customers/new',
      icon: UserPlus,
      subtitle: `${numberFormatter.format(totalCustomers)} kayıtlı müşteri`,
    },
    {
      title: 'Ödeme Ekle',
      href: '/payments/new',
      icon: CreditCard,
      subtitle: currencyFormatter.format(paymentsThisMonth) + ' bu ay',
    },
  ]

  return (
    <MainLayout
      title="Dashboard"
      description="Hızlı işlemler ve güncel durum"
    >
      {/* Quick actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>
            Sık kullanılan kayıtları buradan birkaç dokunuşla ekleyin. Mobil ekranlar için genişletilmiş butonlar sunulmaktadır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <Button
                  asChild
                  key={action.title}
                  size="lg"
                  className="h-auto flex-col items-start gap-1 rounded-xl border px-4 py-4 text-left text-base font-semibold shadow-none transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md sm:h-28"
                >
                  <Link href={action.href}>
                    <Icon className="mb-2 h-6 w-6 text-primary" />
                    <span>{action.title}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {action.subtitle}
                    </span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Son Eklenen İşler</CardTitle>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-semibold text-gray-900 hover:underline"
                        >
                          {job.job_name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {job.customer?.name ?? 'Müşteri bilgisi yok'} · {formatDate(job.created_date)}
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end">
                        <p className="text-base font-semibold text-gray-900">
                          {currencyFormatter.format(Number(job.price ?? 0))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.status === 'tamamlandı' ? 'Tamamlandı' : 'Bekliyor'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Henüz iş kaydı bulunmuyor
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bekleyen Ödemeler</CardTitle>
              <span className="text-sm font-semibold text-gray-600">
                Toplam: {currencyFormatter.format(outstandingTotal)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {topOutstanding.length > 0 ? (
              <div className="space-y-4">
                {topOutstanding.map((customer) => (
                  <div
                    key={customer.customer_id}
                    className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <Link
                        href={`/customers/${customer.customer_id}`}
                        className="font-semibold text-gray-900 hover:underline"
                      >
                        {customer.customer_name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Toplam İş: {currencyFormatter.format(Number(customer.total_jobs ?? 0))} · Ödeme:{' '}
                        {currencyFormatter.format(Number(customer.total_payments ?? 0))}
                      </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-sm font-semibold text-red-600">
                        {currencyFormatter.format(Number(customer.balance ?? 0))}
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mt-2 min-w-[140px] sm:mt-0"
                      >
                        <Link href={`/payments/new?customerId=${customer.customer_id}`}>
                          Ödeme Al
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Bekleyen alacak bulunmuyor
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
