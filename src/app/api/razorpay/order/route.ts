import { NextResponse } from 'next/server'
import crypto from 'crypto'

// POST /api/razorpay/order
export async function POST() {
  const keyId  = process.env.RAZORPAY_KEY_ID!
  const secret = process.env.RAZORPAY_KEY_SECRET!

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${keyId}:${secret}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: 1499900, currency: 'INR', receipt: `reg_${Date.now()}` }),
  })

  const order = await res.json()
  if (!res.ok) return NextResponse.json({ error: order.error?.description || 'Order failed' }, { status: 500 })

  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency })
}
