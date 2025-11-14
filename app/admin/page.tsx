'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAdminHeaders } from '@/utils/adminApi'

interface Stats {
  users: {
    total: number
    active: number
    banned: number
    admins: number
  }
  challenges: {
    total: number
    active: number
    disabled: number
  }
  events: {
    total: number
    active: number
    archived: number
  }
  flags: {
    total: number
    correct: number
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    if (!admin) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
      loadStats()
    }
  }, [router])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats.php', {
        headers: getAdminHeaders(),
      })
      const data = await response.json()
      setStats(data)
    } catch (e) {
      console.error('Error loading stats:', e)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Control Center</h1>
              <p className="text-gray-300">Platform overview and management</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('ctf_admin')
                localStorage.removeItem('ctf_admin_email')
                router.push('/')
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Statistics Cards */}
          {isLoading ? (
            <div className="text-white text-center py-12">Loading statistics...</div>
          ) : stats && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Users Stats */}
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
                <h3 className="text-gray-300 text-sm mb-2">Users</h3>
                <div className="text-3xl font-bold text-white mb-1">{stats.users.total}</div>
                <div className="text-sm text-gray-400">
                  <span className="text-green-400">{stats.users.active} active</span>
                  {' • '}
                  <span className="text-red-400">{stats.users.banned} banned</span>
                  {' • '}
                  <span className="text-yellow-400">{stats.users.admins} admins</span>
                </div>
              </div>

              {/* Challenges Stats */}
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-gray-300 text-sm mb-2">Challenges</h3>
                <div className="text-3xl font-bold text-white mb-1">{stats.challenges.total}</div>
                <div className="text-sm text-gray-400">
                  <span className="text-green-400">{stats.challenges.active} active</span>
                  {' • '}
                  <span className="text-gray-400">{stats.challenges.disabled} disabled</span>
                </div>
              </div>

              {/* Events Stats */}
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30">
                <h3 className="text-gray-300 text-sm mb-2">Events</h3>
                <div className="text-3xl font-bold text-white mb-1">{stats.events.total}</div>
                <div className="text-sm text-gray-400">
                  <span className="text-green-400">{stats.events.active} active</span>
                  {' • '}
                  <span className="text-gray-400">{stats.events.archived} archived</span>
                </div>
              </div>

              {/* Flags Stats */}
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg p-6 border border-orange-500/30">
                <h3 className="text-gray-300 text-sm mb-2">Flag Submissions</h3>
                <div className="text-3xl font-bold text-white mb-1">{stats.flags.total}</div>
                <div className="text-sm text-gray-400">
                  <span className="text-green-400">{stats.flags.correct} correct</span>
                  {' • '}
                  <span className="text-gray-400">{stats.flags.total - stats.flags.correct} incorrect</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admin/users"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/challenges"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Manage Challenges
              </Link>
              <Link
                href="/admin/events"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Manage Events
              </Link>
            </div>
          </div>

          {/* Management Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/challenges"
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-all hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Challenges</h2>
              <p className="text-gray-400">Add, edit, and manage challenges</p>
            </Link>

            <Link
              href="/admin/events"
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-all hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Events</h2>
              <p className="text-gray-400">Create and manage CTF events</p>
            </Link>

            <Link
              href="/admin/users"
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-all hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Users</h2>
              <p className="text-gray-400">View and manage users</p>
            </Link>

            <Link
              href="/admin/flags"
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-all hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Submitted Flags</h2>
              <p className="text-gray-400">View all flag submissions</p>
            </Link>

            <Link
              href="/admin/sponsors"
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-all hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Sponsors</h2>
              <p className="text-gray-400">Manage sponsors</p>
            </Link>

            <Link
              href="/admin/categories"
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition-all hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Categories</h2>
              <p className="text-gray-400">Manage challenge categories</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

