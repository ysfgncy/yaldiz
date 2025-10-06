'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

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

interface CustomerWithBalance {
  id: string
  name: string
  contact_info: string | null
  notes: string | null
  balance: number
}

interface CustomersClientProps {
  customers: CustomerWithBalance[]
}

export default function CustomersClient({ customers }: CustomersClientProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }),
    []
  )

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return customers
    }

    return customers.filter((customer) => {
      const searchableFields = [customer.name, customer.contact_info ?? '', customer.notes ?? '']

      return searchableFields.some((field) => field.toLowerCase().includes(term))
    })
  }, [searchTerm, customers])

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-red-600'
    if (balance < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const hasCustomers = customers.length > 0
  const hasFilteredCustomers = filteredCustomers.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="relative flex-1 min-w-0 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Müşteri ara..."
            className="pl-10"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <Link href="/customers/new" className="w-full lg:w-auto">
          <Button className="w-full lg:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Müşteri
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Müşteri Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasCustomers ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Henüz müşteri kaydı bulunmuyor</p>
              <Link href="/customers/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Müşteriyi Ekle
                </Button>
              </Link>
            </div>
          ) : hasFilteredCustomers ? (
            <div className="-mx-4 sm:mx-0 overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Müşteri Adı</TableHead>
                    <TableHead>Bakiye Durumu</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <Link href={`/customers/${customer.id}`} className="hover:underline">
                          {customer.name}
                        </Link>
                      </TableCell>
                      <TableCell className={getBalanceColor(customer.balance)}>
                        {currencyFormatter.format(customer.balance)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/payments/new?customerId=${customer.id}`}>
                            <Button variant="outline" size="sm">
                              Ödeme Ekle
                            </Button>
                          </Link>
                          <Link href={`/jobs/new?customerId=${customer.id}`}>
                            <Button variant="outline" size="sm">
                              İş Ekle
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Arama kriteriyle eşleşen müşteri bulunamadı</p>
              <Link href="/customers/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Müşteri Ekle
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
