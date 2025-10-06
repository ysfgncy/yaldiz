import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type PaymentPayload = {
  customer_id?: string
  job_id?: string | null
  amount?: number | string
  payment_type?: string
  payment_date?: string
  notes?: string | null
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const customerId = searchParams.get('customerId') ?? undefined
  const includeSummary = searchParams.get('includeSummary') === 'true'

  let paymentsQuery = supabase
    .from('payments')
    .select(
      'id, customer_id, job_id, amount, payment_type, payment_date, notes, customer:customers(id, name), job:jobs(id, job_name)'
    )
    .order('payment_date', { ascending: false })

  if (customerId) {
    paymentsQuery = paymentsQuery.eq('customer_id', customerId)
  }

  const { data, error } = await paymentsQuery

  if (error) {
    return NextResponse.json(
      { error: 'Ödemeler alınamadı', details: error.message },
      { status: 500 }
    )
  }

  let summary: Record<string, number> | null = null

  if (includeSummary) {
    if (customerId) {
      const { data: summaryData, error: summaryError } = await supabase
        .from('account_summary')
        .select('total_jobs, total_payments, balance')
        .eq('customer_id', customerId)
        .maybeSingle()

      if (summaryError) {
        return NextResponse.json(
          { error: 'Cari özet alınamadı', details: summaryError.message },
          { status: 500 }
        )
      }

      summary = {
        totalJobs: Number(summaryData?.total_jobs ?? 0),
        totalPayments: Number(summaryData?.total_payments ?? 0),
        balance: Number(summaryData?.balance ?? 0),
      }
    } else {
      const totalPayments = (data ?? []).reduce(
        (sum, payment) => sum + Number(payment.amount ?? 0),
        0
      )

      summary = {
        totalPayments,
      }
    }
  }

  return NextResponse.json({ data: data ?? [], summary })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  let payload: PaymentPayload

  try {
    payload = await request.json()
  } catch (error) {
    return NextResponse.json(
      { error: 'Geçersiz istek gövdesi', details: (error as Error).message },
      { status: 400 }
    )
  }

  const { customer_id, amount, payment_type, payment_date } = payload

  if (!customer_id || amount === undefined || !payment_type || !payment_date) {
    return NextResponse.json(
      {
        error: 'Eksik alanlar',
        details:
          'customer_id, amount, payment_type ve payment_date alanları zorunludur',
      },
      { status: 400 }
    )
  }

  const parsedAmount = typeof amount === 'string' ? Number(amount) : amount

  if (Number.isNaN(parsedAmount)) {
    return NextResponse.json(
      { error: 'Geçersiz tutar', details: 'amount numerik bir değer olmalıdır' },
      { status: 400 }
    )
  }

  const normalizedJobId =
    payload.job_id === undefined ||
    payload.job_id === null ||
    payload.job_id === 'none'
      ? null
      : payload.job_id

  const sanitizedPayload = {
    customer_id,
    job_id: normalizedJobId,
    amount: parsedAmount,
    payment_type,
    payment_date,
    notes: payload.notes ?? null,
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    return NextResponse.json(
      { error: 'Kullanıcı bilgisi alınamadı', details: userError.message },
      { status: 401 }
    )
  }

  const insertPayload = {
    ...sanitizedPayload,
    created_by: user?.id ?? null,
  }

  const { data, error } = await supabase
    .from('payments')
    .insert(insertPayload)
    .select(
      'id, customer_id, job_id, amount, payment_type, payment_date, notes'
    )
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Ödeme oluşturulamadı', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ data }, { status: 201 })
}
