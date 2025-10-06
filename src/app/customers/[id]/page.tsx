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
import { use, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

interface Customer {
  id: string
  name: string
  contact_info: string | null
  notes: string | null
  created_at: string
}

interface Job {
  id: string
  job_name: string
  price: number
  status: string
  created_date: string
}

interface Payment {
  id: string
  amount: number | string
  payment_type: string
  payment_date: string
  notes: string | null
}

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

const paymentTypeLabels: Record<string, string> = {
  nakit: 'Nakit',
  havale: 'Havale / EFT',
  çek: 'Çek',
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const supabase = createClient()

        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single()

        if (customerError) throw customerError
        setCustomer(customerData)

        const [jobsResponse, paymentsResponse] = await Promise.all([
          supabase
            .from('jobs')
            .select('*')
            .eq('customer_id', id)
            .order('created_date', { ascending: false }),
          supabase
            .from('payments')
            .select('id, amount, payment_type, payment_date, notes')
            .eq('customer_id', id)
            .order('payment_date', { ascending: false }),
        ])

        if (jobsResponse.error) throw jobsResponse.error
        if (paymentsResponse.error) throw paymentsResponse.error

        setJobs(jobsResponse.data || [])
        setPayments(paymentsResponse.data || [])
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
        toast.error('Müşteri bilgileri yüklenemedi', {
          description: message,
        })
        router.push('/customers')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerData()
  }, [id, router])

  const totalJobAmount = useMemo(
    () => jobs.reduce((sum, job) => sum + job.price, 0),
    [jobs]
  )

  const totalPaymentAmount = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments]
  )

  const balance = totalJobAmount - totalPaymentAmount

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('customers').delete().eq('id', id)

      if (error) throw error

      toast.success('Müşteri başarıyla silindi!')
      router.push('/customers')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      toast.error('Müşteri silinirken hata oluştu', {
        description: message,
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout title="Müşteri Detayı" description="Yükleniyor...">
        <div className="text-center py-12">Yükleniyor...</div>
      </MainLayout>
    )
  }

  if (!customer) {
    return (
      <MainLayout title="Müşteri Detayı" description="Müşteri bulunamadı">
        <div className="text-center py-12">Müşteri bulunamadı</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      title={customer.name}
      description="Müşteri detay bilgileri"
    >
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Link href={`/customers/${id}/edit`}>
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

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Müşteri Adı</p>
              <p className="font-medium">{customer.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">İletişim Bilgileri</p>
              <p className="font-medium">{customer.contact_info || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Notlar</p>
              <p className="font-medium">{customer.notes || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Kayıt Tarihi</p>
              <p className="font-medium">
                {new Date(customer.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Balance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Cari Durum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">Toplam İş Tutarı</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {currencyFormatter.format(totalJobAmount)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">Toplam Ödeme</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {currencyFormatter.format(totalPaymentAmount)}
                </p>
              </div>
              <div
                className={`rounded-lg border p-4 ${
                  balance >= 0
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <p className="text-sm text-gray-500">
                  {balance >= 0 ? 'Kalan Alacak' : 'Ödenen Fazla Tutar'}
                </p>
                <p className={`mt-2 text-lg font-semibold ${balance >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {currencyFormatter.format(Math.abs(balance))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>İşler ({jobs.length})</CardTitle>
            <Link href={`/jobs/new`}>
              <Button size="sm">Yeni İş Ekle</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{job.job_name}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              job.status === 'tamamlandı'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {job.status === 'tamamlandı' ? 'Tamamlandı' : 'Bekliyor'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(job.created_date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {currencyFormatter.format(job.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Toplam
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {currencyFormatter.format(totalJobAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="mb-4 text-gray-500">
                  Bu müşteriye ait henüz iş kaydı bulunmuyor
                </p>
                <Link href={`/jobs/new`}>
                  <Button size="sm">İlk İşi Ekle</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payments Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ödemeler ({payments.length})</CardTitle>
            <Link href={`/payments/new`}>
              <Button size="sm">Yeni Ödeme Ekle</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Ödeme Tarihi</p>
                        <p className="font-medium">
                          {new Date(payment.payment_date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {currencyFormatter.format(Number(payment.amount || 0))}
                        </p>
                        <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {paymentTypeLabels[payment.payment_type] || payment.payment_type}
                        </span>
                      </div>
                    </div>

                    {payment.notes && (
                      <p className="mt-3 text-sm text-gray-600">
                        {payment.notes}
                      </p>
                    )}

                    <div className="mt-3 flex justify-end">
                      <Link href={`/payments/${payment.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Düzenle
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="mb-4 text-gray-500">
                  Bu müşteriye ait henüz ödeme kaydı bulunmuyor
                </p>
                <Link href={`/payments/new`}>
                  <Button size="sm">İlk Ödemeyi Ekle</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Müşteriyi Sil</DialogTitle>
              <DialogDescription>
                Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri
                alınamaz ve müşteriye ait tüm işler ve ödemeler de silinecektir.
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
