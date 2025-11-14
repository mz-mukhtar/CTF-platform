'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    if (!admin) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

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
              <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-gray-300">Manage your CTF platform</p>
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

