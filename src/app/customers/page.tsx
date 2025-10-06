import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default async function CustomersPage() {
  const supabase = await createClient()

  // Fetch customers from Supabase
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customers:', error)
  }

  return (
    <MainLayout
      title="Müşteriler"
      description="Müşteri listesi ve yönetimi"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative flex-1 min-w-0 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Müşteri ara..."
              className="pl-10"
            />
          </div>
          <Link href="/customers/new" className="w-full lg:w-auto">
            <Button className="w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Müşteri
            </Button>
          </Link>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            {customers && customers.length > 0 ? (
              <div className="-mx-4 sm:mx-0 overflow-x-auto">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                    <TableHead>Müşteri Adı</TableHead>
                    <TableHead>İletişim</TableHead>
                    <TableHead>Notlar</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="hover:underline"
                        >
                          {customer.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {customer.contact_info || '-'}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {customer.notes ? (
                          <span className="line-clamp-1">{customer.notes}</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/customers/${customer.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Düzenle
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  Henüz müşteri kaydı bulunmuyor
                </p>
                <Link href="/customers/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Müşteriyi Ekle
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
