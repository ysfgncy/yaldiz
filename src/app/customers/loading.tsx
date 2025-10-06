import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <MainLayout title="Müşteriler" description="Yükleniyor...">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Skeleton className="h-11 w-full max-w-md" />
          <Skeleton className="h-11 w-36" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Müşteri Listesi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
