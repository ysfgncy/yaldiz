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
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const jobSchema = z.object({
  customer_id: z.string().min(1, 'Müşteri seçimi zorunludur'),
  job_name: z.string().min(2, 'İş adı en az 2 karakter olmalıdır'),
  job_details: z.string().optional(),
  price: z.string().min(1, 'Fiyat girilmelidir'),
  created_date: z.string().min(1, 'Tarih seçilmelidir'),
})

type JobFormData = z.infer<typeof jobSchema>

interface Customer {
  id: string
  name: string
}

export default function NewJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      created_date: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('customers')
          .select('id, name')
          .order('name')

        if (error) throw error
        const customerList = data || []
        setCustomers(customerList)
        if (customerList.length > 0) {
          setValue('customer_id', customerList[0].id)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
        toast.error('Müşteriler yüklenirken hata oluştu', {
          description: message,
        })
      } finally {
        setIsLoadingCustomers(false)
      }
    }

    fetchCustomers()
  }, [setValue])

  const onSubmit = async (data: JobFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from('jobs').insert([
        {
          customer_id: data.customer_id,
          job_name: data.job_name,
          job_details: data.job_details || null,
          price: parseFloat(data.price),
          created_date: data.created_date,
          status: 'bekliyor',
        },
      ])

      if (error) throw error

      toast.success('İş başarıyla eklendi!')
      router.push('/jobs')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      toast.error('İş eklenirken hata oluştu', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingCustomers) {
    return (
      <MainLayout title="Yeni İş" description="Yükleniyor...">
        <div className="text-center py-12">Yükleniyor...</div>
      </MainLayout>
    )
  }

  if (customers.length === 0) {
    return (
      <MainLayout title="Yeni İş" description="İş oluşturabilmek için önce müşteri eklemelisiniz">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                İş oluşturabilmek için önce müşteri eklemelisiniz
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
    <MainLayout title="Yeni İş" description="Yeni iş kaydı oluştur">
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>İş Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Müşteri Seçimi */}
              <div className="space-y-2">
                <Label htmlFor="customer_id">
                  Müşteri <span className="text-red-500">*</span>
                </Label>
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
                  <p className="text-sm text-red-500">
                    {errors.customer_id.message}
                  </p>
                )}
              </div>

              {/* İş Adı */}
              <div className="space-y-2">
                <Label htmlFor="job_name">
                  İş Adı <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="job_name"
                  {...register('job_name')}
                  placeholder="Örn: Aylık Muhasebe Hizmeti"
                  disabled={isLoading}
                />
                {errors.job_name && (
                  <p className="text-sm text-red-500">
                    {errors.job_name.message}
                  </p>
                )}
              </div>

              {/* İş Detayları */}
              <div className="space-y-2">
                <Label htmlFor="job_details">İş Detayları</Label>
                <Textarea
                  id="job_details"
                  {...register('job_details')}
                  placeholder="İş hakkında detaylı bilgi..."
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              {/* Fiyat */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Fiyat (₺) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price')}
                  placeholder="0.00"
                  disabled={isLoading}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* İş Tarihi */}
              <div className="space-y-2">
                <Label htmlFor="created_date">
                  İş Tarihi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="created_date"
                  type="date"
                  {...register('created_date')}
                  disabled={isLoading}
                />
                {errors.created_date && (
                  <p className="text-sm text-red-500">
                    {errors.created_date.message}
                  </p>
                )}
              </div>

              {/* Actions */}
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
                  {isLoading ? 'Kaydediliyor...' : 'İş Ekle'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
