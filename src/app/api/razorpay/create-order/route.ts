import Razorpay from 'razorpay'
import { NextRequest, NextResponse } from 'next/server'

// Get free sandbox keys from Razorpay Dashboard → Account & Settings → API Keys (Test Mode)
const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET

export async function POST(request: NextRequest) {
    if (!keyId || !keySecret) {
        return NextResponse.json(
            {
                error: 'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local',
            },
            { status: 500 }
        )
    }
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    try {
        const body = await request.json()
        const { amount, currency = 'INR', receipt = 'credits_purchase' } = body

        // Amount in smallest unit (paise for INR, cents for EUR)
        const amountInSmallestUnit = Math.round(Number(amount) * 100)

        const order = await razorpay.orders.create({
            amount: amountInSmallestUnit,
            currency,
            receipt,
        })

        return NextResponse.json({ orderId: order.id, amount: amountInSmallestUnit })
    } catch (error) {
        console.error('Razorpay order creation failed:', error)
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        )
    }
}
