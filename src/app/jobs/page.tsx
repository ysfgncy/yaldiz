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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Clock, Plus } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

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
  }
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
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Durum</TableHead>
                    <TableHead>İş Adı</TableHead>
                    <TableHead>Müşteri</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleJobStatus(job.id, job.status)}
                          className="p-1"
                        >
                          {job.status === 'tamamlandı' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-600" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="hover:underline"
                        >
                          {job.job_name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/customers/${job.customer.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {job.customer.name}
                        </Link>
                      </TableCell>
                      <TableCell>₺{job.price.toLocaleString('tr-TR')}</TableCell>
                      <TableCell>
                        {new Date(job.created_date).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/jobs/${job.id}/edit`}>
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
