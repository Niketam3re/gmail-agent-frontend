// Force dynamic rendering - don't prerender this page
export const dynamic = 'force-dynamic'

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    name?: string
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as User)
        setLoading(false)
      } else {
        router.push('/')
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as User)
      } else {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gmail Agent</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {displayName}! 👋
            </h2>
            <p className="text-gray-600">
              Your account is set up. The next step is to connect your Gmail account.
            </p>
          </div>

          {/* Gmail Connection Status */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Gmail Connection
                </h3>
                <p className="text-sm text-gray-600">
                  Connect your Gmail account to start using the AI assistant
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  ❌ Not Connected
                </span>
              </div>
            </div>
            <div className="mt-4">
              <button
                disabled
                className="bg-gray-300 text-gray-500 cursor-not-allowed py-2 px-4 rounded-lg text-sm font-medium"
              >
                Connect Gmail (Coming in Milestone 1)
              </button>
            </div>
          </div>

          {/* Features Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-medium text-gray-900">Authentication</p>
                    <p className="text-sm text-gray-600">Sign in with Google OAuth</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                  Milestone 0
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <p className="font-medium text-gray-500">Gmail Connection</p>
                    <p className="text-sm text-gray-500">OAuth flow to access your inbox</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded">
                  Milestone 1
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <p className="font-medium text-gray-500">AI Triage</p>
                    <p className="text-sm text-gray-500">Automatically label emails by priority</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded">
                  Milestone 2
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <p className="font-medium text-gray-500">Draft Suggestions</p>
                    <p className="text-sm text-gray-500">AI-powered reply drafts</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded">
                  Milestone 3
                </span>
              </div>
            </div>
          </div>

          {/* Milestone Progress */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🚀 Milestone 0 Complete! Next: Connect Gmail (Milestone 1)</p>
          </div>
        </div>
      </main>
    </div>
  )
}
