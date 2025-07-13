import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Zap, Shield, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Build Amazing AI Applications
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          A complete SaaS starter with AI chat, authentication, billing, and everything you need to launch your next AI product.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started Free
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              View Demo
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <Card className="text-center">
          <CardHeader>
            <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>AI Chat Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Built-in chat interface with OpenAI integration and conversation history.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle>Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Secure authentication with NextAuth, supporting multiple providers.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <CardTitle>Stripe Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Complete subscription billing system with usage tracking.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <CardTitle>Modern Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to start building?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Get your AI SaaS up and running in minutes, not months.
        </p>
        <Link href="/signup">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Start Your Free Trial
          </Button>
        </Link>
      </div>
    </div>
  )
}