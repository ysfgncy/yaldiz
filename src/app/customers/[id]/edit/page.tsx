'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const customerSchema = z.object({
  name: z.string().min(2, 'Müşteri adı en az 2 karakter olmalıdır'),
  contact_info: z.string().optional(),
  notes: z.string().optional(),
})

type CustomerFormData = z.infer<typeof customerSchema>

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  })

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        setValue('name', data.name)
        setValue('contact_info', data.contact_info || '')
        setValue('notes', data.notes || '')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
        toast.error('Müşteri bilgileri yüklenemedi', {
          description: message,
        })
        router.push('/customers')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchCustomer()
  }, [id, setValue, router])

  const onSubmit = async (data: CustomerFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('customers')
        .update({
          name: data.name,
          contact_info: data.contact_info || null,
          notes: data.notes || null,
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Müşteri başarıyla güncellendi!')
      router.push('/customers')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      toast.error('Müşteri güncellenirken hata oluştu', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <MainLayout title="Müşteri Düzenle" description="Yükleniyor...">
        <div className="text-center py-12">Yükleniyor...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      title="Müşteri Düzenle"
      description="Müşteri bilgilerini güncelle"
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Müşteri Adı */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Müşteri Adı <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* İletişim Bilgileri */}
              <div className="space-y-2">
                <Label htmlFor="contact_info">İletişim Bilgileri</Label>
                <Input
                  id="contact_info"
                  {...register('contact_info')}
                  disabled={isLoading}
                />
              </div>

              {/* Notlar */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  rows={4}
                  disabled={isLoading}
                />
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
