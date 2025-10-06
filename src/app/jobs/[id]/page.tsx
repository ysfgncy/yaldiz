'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Job {
  id: string
  job_name: string
  job_details: string | null
  price: number
  status: string
  created_date: string
  completed_date: string | null
  customer_id: string
}

interface Customer {
  id: string
  name: string
  contact_info: string | null
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const supabase = createClient()

        // Fetch job
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single()

        if (jobError) throw jobError
        setJob(jobData)

        // Fetch customer
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id, name, contact_info')
          .eq('id', jobData.customer_id)
          .single()

        if (customerError) throw customerError
        setCustomer(customerData)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
        toast.error('İş bilgileri yüklenemedi', {
          description: message,
        })
        router.push('/jobs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobData()
  }, [id, router])

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('jobs').delete().eq('id', id)

      if (error) throw error

      toast.success('İş başarıyla silindi!')
      router.push('/jobs')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      toast.error('İş silinirken hata oluştu', {
        description: message,
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout title="İş Detayı" description="Yükleniyor...">
        <div className="text-center py-12">Yükleniyor...</div>
      </MainLayout>
    )
  }

  if (!job || !customer) {
    return (
      <MainLayout title="İş Detayı" description="İş bulunamadı">
        <div className="text-center py-12">İş bulunamadı</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      title={job.job_name}
      description="İş detay bilgileri"
    >
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Link href={`/jobs/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>

        {/* Job Info */}
        <Card>
          <CardHeader>
            <CardTitle>İş Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">İş Adı</p>
              <p className="font-medium">{job.job_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">İş Detayları</p>
              <p className="font-medium whitespace-pre-wrap">{job.job_details || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fiyat</p>
              <p className="font-medium text-lg">₺{job.price.toLocaleString('tr-TR')}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Durum</p>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  job.status === 'tamamlandı'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {job.status === 'tamamlandı' ? 'Tamamlandı' : 'Bekliyor'}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">İş Tarihi</p>
              <p className="font-medium">
                {new Date(job.created_date).toLocaleDateString('tr-TR')}
              </p>
            </div>

            {job.completed_date && (
              <div>
                <p className="text-sm text-gray-500">Tamamlanma Tarihi</p>
                <p className="font-medium">
                  {new Date(job.completed_date).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Müşteri Adı</p>
              <Link
                href={`/customers/${customer.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {customer.name}
              </Link>
            </div>

            {customer.contact_info && (
              <div>
                <p className="text-sm text-gray-500">İletişim Bilgileri</p>
                <p className="font-medium">{customer.contact_info}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>İşi Sil</DialogTitle>
              <DialogDescription>
                Bu işi silmek istediğinizden emin misiniz? Bu işlem geri
                alınamaz.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                İptal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
