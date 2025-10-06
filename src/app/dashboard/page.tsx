import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Users, Briefcase, CheckCircle, TrendingUp } from 'lucide-react'
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

type RecentJobRecordRaw = Omit<RecentJobRecord, 'customer'> & {
  customer: {
    id: string
    name: string
  }[] | null
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
    completedJobsRes,
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
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'tamamlandı')
      .gte('completed_date', monthStartStr)
      .lte('completed_date', monthEndStr),
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
    ['completedJobs', completedJobsRes.error],
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
  const completedThisMonth = completedJobsRes.count ?? 0

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
  const recentJobs: RecentJobRecord[] = recentJobsRaw.map((job) => ({
    ...job,
    customer: job.customer?.[0] ?? null,
  }))

  const stats = [
    {
      title: 'Toplam Müşteri',
      value: numberFormatter.format(totalCustomers),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Bekleyen İşler',
      value: numberFormatter.format(pendingJobs),
      icon: Briefcase,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Bu Ay Tamamlanan',
      value: numberFormatter.format(completedThisMonth),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Bu Ay Gelir',
      value: currencyFormatter.format(paymentsThisMonth),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <MainLayout
      title="Dashboard"
      description="Genel bakış ve özet istatistikler"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Eklenen İşler</CardTitle>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {job.job_name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {job.customer?.name ?? 'Müşteri bilgisi yok'} · {formatDate(job.created_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {currencyFormatter.format(Number(job.price ?? 0))}
                      </p>
                      <p className="text-xs text-gray-500">
                        {job.status === 'tamamlandı' ? 'Tamamlandı' : 'Bekliyor'}
                      </p>
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
              <CardTitle>Bekleyen Alacaklar</CardTitle>
              <span className="text-sm font-semibold text-gray-600">
                Toplam: {currencyFormatter.format(outstandingTotal)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {topOutstanding.length > 0 ? (
              <div className="space-y-4">
                {topOutstanding.map((customer) => (
                  <div key={customer.customer_id} className="flex items-center justify-between">
                    <div>
                      <Link
                        href={`/customers/${customer.customer_id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {customer.customer_name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Toplam İş: {currencyFormatter.format(Number(customer.total_jobs ?? 0))} ·
                        {' '}Ödeme: {currencyFormatter.format(Number(customer.total_payments ?? 0))}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-red-600">
                      {currencyFormatter.format(Number(customer.balance ?? 0))}
                    </p>
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
