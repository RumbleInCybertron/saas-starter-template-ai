'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Zap, Crown, Star } from 'lucide-react'
import { toast } from 'sonner'

const plans = [
  {
    name: 'Free',
    price: 0,
    priceId: null,
    description: 'Perfect for getting started',
    features: [
      '1,000 tokens per month',
      'Basic AI responses',
      'Chat history',
      'Email support',
    ],
    icon: Zap,
    popular: false,
  },
  {
    name: 'Pro',
    price: 19,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
    description: 'Best for professionals',
    features: [
      '50,000 tokens per month',
      'Advanced AI responses',
      'Priority support',
      'Export conversations',
      'Custom instructions',
    ],
    icon: Crown,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE,
    description: 'For teams and businesses',
    features: [
      'Unlimited tokens',
      'Team collaboration',
      'Advanced analytics',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
    icon: Star,
    popular: false,
  },
]

export default function Pricing() {
  const { data: session } = useSession()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!session) {
      toast.error('Please sign in to subscribe')
      return
    }

    setLoadingPlan(planName)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Select the perfect plan for your AI assistant needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-2 border-blue-500 shadow-lg scale-105'
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4">
                  <Icon className={`h-12 w-12 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">/month</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  {plan.price === 0 ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : ''
                      }`}
                      onClick={() => handleSubscribe(plan.priceId!, plan.name)}
                      disabled={loadingPlan === plan.name}
                    >
                      {loadingPlan === plan.name
                        ? 'Loading...'
                        : `Subscribe to ${plan.name}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center mt-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Questions about pricing?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Contact our team for custom enterprise solutions or if you need help choosing the right plan.
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  )
}