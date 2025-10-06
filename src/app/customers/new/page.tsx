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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const customerSchema = z.object({
  name: z.string().min(2, 'Müşteri adı en az 2 karakter olmalıdır'),
  contact_info: z.string().optional(),
  notes: z.string().optional(),
})

type CustomerFormData = z.infer<typeof customerSchema>

export default function NewCustomerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  })

  const onSubmit = async (data: CustomerFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from('customers').insert([
        {
          name: data.name,
          contact_info: data.contact_info || null,
          notes: data.notes || null,
        },
      ])

      if (error) throw error

      toast.success('Müşteri başarıyla eklendi!')
      router.push('/customers')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
      toast.error('Müşteri eklenirken hata oluştu', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout
      title="Yeni Müşteri"
      description="Yeni müşteri kaydı oluştur"
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
                  placeholder="Örn: Ahmet Yılmaz"
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
                  placeholder="Telefon, email, adres vb."
                  disabled={isLoading}
                />
                {errors.contact_info && (
                  <p className="text-sm text-red-500">
                    {errors.contact_info.message}
                  </p>
                )}
              </div>

              {/* Notlar */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Müşteri hakkında notlar..."
                  rows={4}
                  disabled={isLoading}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
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
                  {isLoading ? 'Kaydediliyor...' : 'Müşteri Ekle'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
