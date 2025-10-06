import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <MainLayout title="Ödemeler" description="Yükleniyor...">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-40 mt-3" />
          </div>
          <Skeleton className="h-11 w-36" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ödeme Listesi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
