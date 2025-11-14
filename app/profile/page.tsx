'use client'

import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

function ProfileContent() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Profile</h1>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/scoreboard"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Scoreboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-8 space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Username
              </label>
              <div className="bg-gray-700 rounded-lg px-4 py-3 text-white text-lg">
                {user?.name}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Email
              </label>
              <div className="bg-gray-700 rounded-lg px-4 py-3 text-white text-lg">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Total Points
              </label>
              <div className="bg-gray-700 rounded-lg px-4 py-3 text-white text-lg font-semibold text-primary-400">
                {user?.totalPoints || 0}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Challenges Solved
              </label>
              <div className="bg-gray-700 rounded-lg px-4 py-3 text-white text-lg font-semibold text-primary-400">
                {user?.challengesSolved || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

