import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth' // adjust path if needed
import { redirect } from 'next/navigation'
import SignInClient from './client'

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return <SignInClient />
}
