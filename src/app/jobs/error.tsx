'use client'

import { useEffect } from 'react'

import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function JobsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Jobs page error:', error)
  }, [error])

  return (
    <MainLayout title="İşler" description="Bir hata oluştu">
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            İş listesi yüklenemedi
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Lütfen sayfayı yenileyin veya bağlantınızı kontrol edin.
          </p>
        </div>
        <Button onClick={reset}>Tekrar dene</Button>
      </div>
    </MainLayout>
  )
}
