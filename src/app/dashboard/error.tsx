'use client'

import { useEffect } from 'react'

import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <MainLayout title="Dashboard" description="Bir hata oluştu">
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Dashboard yüklenirken bir sorun oluştu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Lütfen tekrar deneyin. Sorun devam ederse destek ekibiyle iletişime geçin.
          </p>
        </div>
        <Button onClick={reset}>Tekrar dene</Button>
      </div>
    </MainLayout>
  )
}
