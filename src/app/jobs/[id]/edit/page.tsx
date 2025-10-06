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
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const jobSchema = z.object({
  customer_id: z.string().min(1, 'Müşteri seçimi zorunludur'),
  job_name: z.string().min(2, 'İş adı en az 2 karakter olmalıdır'),
  job_details: z.string().optional(),
  price: z.string().min(1, 'Fiyat girilmelidir'),
  created_date: z.string().min(1, 'Tarih seçilmelidir'),
  status: z.enum(['bekliyor', 'tamamlandı']),
})

type JobFormData = z.infer<typeof jobSchema>

interface Customer {
  id: string
  name: string
}

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        // Fetch customers
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('id, name')
          .order('name')

        if (customersError) throw customersError

        setCustomers(customersData || [])

        // Fetch job
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        setValue('customer_id', jobData.customer_id)
        setValue('job_name', jobData.job_name)
        setValue('job_details', jobData.job_details || '')
        setValue('price', jobData.price.toString())
        setValue('created_date', jobData.created_date)
        setValue('status', jobData.status)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
        toast.error('İş bilgileri yüklenemedi', {
          description: message,
        })
        router.push('/jobs')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [id, setValue, router])

  const onSubmit = async (data: JobFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('jobs')
        .update({
          customer_id: data.customer_id,
          job_name: data.job_name,
          job_details: data.job_details || null,
          price: parseFloat(data.price),
          created_date: data.created_date,
          status: data.status,
          completed_date: data.status === 'tamamlandı' && !data.created_date
            ? new Date().toISOString().split('T')[0]
            : null,
        })
        .eq('id', id)

      if (error) throw error

      toast.success('İş başarıyla güncellendi!')
      router.push('/jobs')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      toast.error('İş güncellenirken hata oluştu', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <MainLayout title="İş Düzenle" description="Yükleniyor...">
        <div className="text-center py-12">Yükleniyor...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="İş Düzenle" description="İş bilgilerini güncelle">
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>İş Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customer_id">Müşteri *</Label>
                <Select
                  onValueChange={(value) => setValue('customer_id', value)}
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
                  <p className="text-sm text-red-500">{errors.customer_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_name">İş Adı *</Label>
                <Input id="job_name" {...register('job_name')} disabled={isLoading} />
                {errors.job_name && (
                  <p className="text-sm text-red-500">{errors.job_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_details">İş Detayları</Label>
                <Textarea id="job_details" {...register('job_details')} rows={4} disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (₺) *</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} disabled={isLoading} />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="created_date">İş Tarihi *</Label>
                <Input id="created_date" type="date" {...register('created_date')} disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Durum *</Label>
                <Select onValueChange={(value: 'bekliyor' | 'tamamlandı') => setValue('status', value)} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bekliyor">Bekliyor</SelectItem>
                    <SelectItem value="tamamlandı">Tamamlandı</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                  İptal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Kaydediliyor...' : 'Güncelle'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
