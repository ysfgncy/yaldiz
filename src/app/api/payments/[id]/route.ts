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

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  const supabase = await createClient()
  const { id } = await context.params

  const { data, error } = await supabase
    .from('payments')
    .select(
      'id, customer_id, job_id, amount, payment_type, payment_date, notes'
    )
    .eq('id', id)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      { error: 'Ödeme bulunamadı', details: error.message },
      { status: 404 }
    )
  }

  if (!data) {
    return NextResponse.json({ error: 'Ödeme bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const supabase = await createClient()
  const { id } = await context.params
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

  const updatePayload = {
    customer_id,
    job_id: normalizedJobId,
    amount: parsedAmount,
    payment_type,
    payment_date,
    notes: payload.notes ?? null,
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updatePayload)
    .eq('id', id)
    .select(
      'id, customer_id, job_id, amount, payment_type, payment_date, notes'
    )
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Ödeme güncellenemedi', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ data })
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const supabase = await createClient()
  const { id } = await context.params

  const { error } = await supabase.from('payments').delete().eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: 'Ödeme silinemedi', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
