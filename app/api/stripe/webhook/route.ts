import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { message: 'Missing stripe signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { message: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.metadata?.userId) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await prisma.user.update({
            where: { id: session.metadata.userId },
            data: {
              subscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              planType: 'pro', // You can make this dynamic based on price
              tokensLimit: 50000, // Update based on plan
            }
          })
        }
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )

          const user = await prisma.user.findFirst({
            where: { subscriptionId: subscription.id }
          })

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionStatus: subscription.status,
                tokensUsed: 0, // Reset tokens on successful payment
              }
            })
          }
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        
        const userToUpdate = await prisma.user.findFirst({
          where: { subscriptionId: deletedSubscription.id }
        })

        if (userToUpdate) {
          await prisma.user.update({
            where: { id: userToUpdate.id },
            data: {
              subscriptionId: null,
              subscriptionStatus: null,
              planType: 'free',
              tokensLimit: 1000,
            }
          })
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { message: 'Webhook processing error' },
      { status: 500 }
    )
  }
}