'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MessageSquare, Zap, Crown, Plus } from 'lucide-react'
import Link from 'next/link'

interface UserStats {
  tokensUsed: number
  tokensLimit: number
  planType: string
  chatCount: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [recentChats, setRecentChats] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserStats()
      fetchRecentChats()
    }
  }, [session])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    }
  }

  const fetchRecentChats = async () => {
    try {
      const response = await fetch('/api/chats')
      if (response.ok) {
        const data = await response.json()
        setRecentChats(data.slice(0, 5))
      }
    } catch (error) {
      console.error('Failed to fetch recent chats:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const tokenUsagePercentage = stats ? (stats.tokensUsed / stats.tokensLimit) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {session.user?.name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's what's happening with your AI assistant today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.tokensUsed?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              of {stats?.tokensLimit?.toLocaleString() || 0} tokens
            </p>
            <Progress value={tokenUsagePercentage} className="mt-2" />
            {tokenUsagePercentage > 80 && (
              <p className="text-xs text-orange-600 mt-1">
                Running low on tokens
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.chatCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {stats?.planType || 'Free'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.planType === 'free' ? 'Limited features' : 'Full access'}
            </p>
            {stats?.planType === 'free' && (
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="mt-2">
                  Upgrade Plan
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Start New Chat</CardTitle>
            <CardDescription>
              Begin a new conversation with your AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>
              Continue where you left off
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentChats.length > 0 ? (
              <div className="space-y-2">
                {recentChats.map((chat: any) => (
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <div className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <p className="text-sm font-medium truncate">
                        {chat.title || 'Untitled Chat'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent chats</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Warning */}
      {tokenUsagePercentage > 90 && stats?.planType === 'free' && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200">
              Almost out of tokens!
            </CardTitle>
            <CardDescription className="text-orange-600 dark:text-orange-300">
              You've used {tokenUsagePercentage.toFixed(0)}% of your monthly token allowance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pricing">
              <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                Upgrade to Pro
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}