'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Clock, Plus } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

const statusStyles: Record<string, string> = {
  tamamlandı: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  bekliyor: 'bg-amber-100 text-amber-700 border border-amber-200',
}

const statusActions: Record<string, { label: string; nextLabel: string; Icon: typeof CheckCircle }> = {
  tamamlandı: {
    label: 'Tamamlandı',
    nextLabel: 'Beklemeye al',
    Icon: CheckCircle,
  },
  bekliyor: {
    label: 'Bekliyor',
    nextLabel: 'Tamamlandı işaretle',
    Icon: Clock,
  },
}

function formatDate(value: string) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

interface Job {
  id: string
  job_name: string
  job_details: string | null
  price: number
  status: string
  created_date: string
  customer: {
    id: string
    name: string
  } | null
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      let query = supabase
        .from('jobs')
        .select('*, customer:customers(id, name)')
        .order('created_date', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      toast.error('İşler yüklenirken hata oluştu', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      const supabase = createClient()
      const newStatus = currentStatus === 'bekliyor' ? 'tamamlandı' : 'bekliyor'
      const completedDate = newStatus === 'tamamlandı' ? new Date().toISOString().split('T')[0] : null

      const { error } = await supabase
        .from('jobs')
        .update({
          status: newStatus,
          completed_date: completedDate,
        })
        .eq('id', jobId)

      if (error) throw error

      toast.success('İş durumu güncellendi!')
      fetchJobs()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      toast.error('İş durumu güncellenirken hata oluştu', {
        description: message,
      })
    }
  }

  return (
    <MainLayout title="İşler" description="İş listesi ve yönetimi">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="w-full lg:w-[220px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm İşler</SelectItem>
                <SelectItem value="bekliyor">Bekliyor</SelectItem>
                <SelectItem value="tamamlandı">Tamamlandı</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Link href="/jobs/new" className="w-full lg:w-auto">
            <Button className="w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Yeni İş
            </Button>
          </Link>
        </div>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>İş Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Yükleniyor...</div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const customer = job.customer
                  const config = statusActions[job.status] ?? statusActions.bekliyor
                  const StatusIcon = config.Icon

                  return (
                    <div
                      key={job.id}
                      className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-lg font-semibold text-foreground hover:text-primary"
                          >
                            {job.job_name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                            {customer ? (
                              <Link
                                href={`/customers/${customer.id}`}
                                className="text-primary hover:underline"
                              >
                                {customer.name}
                              </Link>
                            ) : (
                              <span className="italic text-muted-foreground">Müşteri bilgisi yok</span>
                            )}
                            {customer ? (
                              <span className="hidden sm:inline" aria-hidden="true">
                                •
                              </span>
                            ) : null}
                            <span>{formatDate(job.created_date)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyles[job.status] ?? 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            {config.label}
                          </span>
                          <span className="text-lg font-semibold text-foreground">
                            {currencyFormatter.format(job.price)}
                          </span>
                        </div>
                      </div>

                      {job.job_details ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                          {job.job_details}
                        </p>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleJobStatus(job.id, job.status)}
                          className="flex items-center gap-2"
                        >
                          {job.status === 'tamamlandı' ? <Clock className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          {config.nextLabel}
                        </Button>
                        {customer ? (
                          <Link href={`/payments/new?customerId=${customer.id}&jobId=${job.id}`}>
                            <Button variant="outline" size="sm">
                              Ödeme Al
                            </Button>
                          </Link>
                        ) : null}
                        <Link href={`/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Düzenle
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {statusFilter === 'all'
                    ? 'Henüz iş kaydı bulunmuyor'
                    : `${statusFilter === 'bekliyor' ? 'Bekleyen' : 'Tamamlanmış'} iş bulunmuyor`}
                </p>
                <Link href="/jobs/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    İlk İşi Ekle
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
