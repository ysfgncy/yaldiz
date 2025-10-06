'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const paymentSchema = z.object({
  customer_id: z.string().min(1, 'Müşteri seçimi zorunludur'),
  job_id: z.string().optional(),
  amount: z.string().min(1, 'Tutar girilmelidir'),
  payment_type: z.enum(['nakit', 'havale', 'çek'], {
    message: 'Ödeme tipi seçilmelidir',
  }),
  payment_date: z.string().min(1, 'Tarih seçilmelidir'),
  notes: z.string().optional(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface Customer {
  id: string
  name: string
}

interface JobOption {
  id: string
  job_name: string
  customer_id: string
}

export default function NewPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCustomerId = searchParams.get('customerId')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [jobs, setJobs] = useState<JobOption[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customer_id: preselectedCustomerId ?? '',
      payment_type: 'nakit',
      payment_date: new Date().toISOString().split('T')[0],
      job_id: 'none',
    },
  })

  const selectedCustomerId = watch('customer_id')
  const selectedJobId = watch('job_id') ?? 'none'
  const selectedPaymentType = watch('payment_type') ?? 'nakit'

  const filteredJobs = useMemo(() => {
    if (!selectedCustomerId) return []
    return jobs.filter((job) => job.customer_id === selectedCustomerId)
  }, [jobs, selectedCustomerId])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        const [{ data: customerData, error: customerError }, { data: jobData, error: jobError }] = await Promise.all([
          supabase.from('customers').select('id, name').order('name'),
          supabase.from('jobs').select('id, job_name, customer_id').order('job_name'),
        ])

        if (customerError) throw customerError
        if (jobError) throw jobError

        const customerList = customerData || []
        setCustomers(customerList)
        setJobs(jobData || [])

        if (customerList.length > 0) {
          const hasPreselected = preselectedCustomerId
            ? customerList.some((customer) => customer.id === preselectedCustomerId)
            : false

          const initialCustomerId = hasPreselected
            ? preselectedCustomerId!
            : customerList[0].id

          setValue('customer_id', initialCustomerId)
        } else {
          setValue('customer_id', '')
        }

        setValue('job_id', 'none')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
        toast.error('Ödeme formu verileri yüklenemedi', {
          description: message,
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [preselectedCustomerId, setValue])

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true)

    try {
      const amountValue = parseFloat(data.amount)

      if (Number.isNaN(amountValue)) {
        throw new Error('Tutar numerik bir değer olmalıdır')
      }

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: data.customer_id,
          job_id: data.job_id && data.job_id !== 'none' ? data.job_id : null,
          amount: amountValue,
          payment_type: data.payment_type,
          payment_date: data.payment_date,
          notes: data.notes || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.details || result?.error || 'Bilinmeyen bir hata oluştu')
      }

      toast.success('Ödeme başarıyla eklendi!')
      router.push('/payments')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      toast.error('Ödeme eklenirken hata oluştu', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <MainLayout title="Yeni Ödeme" description="Yükleniyor...">
        <div className="text-center py-12">Yükleniyor...</div>
      </MainLayout>
    )
  }

  if (customers.length === 0) {
    return (
      <MainLayout title="Yeni Ödeme" description="Ödeme eklemek için önce müşteri oluşturmalısınız">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Ödeme ekleyebilmek için önce müşteri eklemelisiniz
              </p>
              <Button onClick={() => router.push('/customers/new')}>
                Müşteri Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Yeni Ödeme" description="Tahsilat kaydı oluştur">
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Ödeme Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <input type="hidden" {...register('customer_id')} />
              <input type="hidden" {...register('job_id')} />
              <input type="hidden" {...register('payment_type')} />
              <div className="space-y-2">
                <Label htmlFor="customer_id">
                  Müşteri <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => {
                    setValue('customer_id', value)
                    setValue('job_id', 'none')
                  }}
                  value={selectedCustomerId || undefined}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Müşteri seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customer_id && (
                  <p className="text-sm text-red-500">
                    {errors.customer_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_id">İlişkili İş</Label>
                <Select
                  onValueChange={(value) => setValue('job_id', value)}
                  value={selectedJobId}
                  disabled={isLoading || !selectedCustomerId || filteredJobs.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      !selectedCustomerId
                        ? 'Önce müşteri seçin'
                        : filteredJobs.length === 0
                          ? 'Bu müşteriye ait iş bulunmuyor'
                          : 'İş seç (opsiyonel)'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">İş seçme</SelectItem>
                    {filteredJobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.job_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Tutar (₺) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount')}
                  disabled={isLoading}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_type">
                  Ödeme Tipi <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value: 'nakit' | 'havale' | 'çek') => setValue('payment_type', value)}
                  value={selectedPaymentType}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ödeme tipi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nakit">Nakit</SelectItem>
                    <SelectItem value="havale">Havale / EFT</SelectItem>
                    <SelectItem value="çek">Çek</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment_type && (
                  <p className="text-sm text-red-500">
                    {errors.payment_type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_date">
                  Ödeme Tarihi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="payment_date"
                  type="date"
                  {...register('payment_date')}
                  disabled={isLoading}
                />
                {errors.payment_date && (
                  <p className="text-sm text-red-500">
                    {errors.payment_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="Ödeme hakkında notlar..."
                  {...register('notes')}
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Kaydediliyor...' : 'Ödeme Ekle'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
