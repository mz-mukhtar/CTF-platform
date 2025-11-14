'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
  total_points: number
  challenges_solved: number
  created_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    if (!admin) {
      router.push('/login')
      return
    }
    loadUsers()
  }, [router])

  const loadUsers = async () => {
    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const response = await fetch('/api/users.php?action=list', {
        headers: {
          'X-Admin-Email': adminEmail || '',
        },
      })
      const data = await response.json()
      setUsers(data.users || [])
    } catch (e) {
      console.error('Error loading users:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const response = await fetch(`/api/users.php?action=delete&id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Email': adminEmail || '',
        },
      })
      const data = await response.json()
      if (data.success) {
        loadUsers()
      } else {
        alert(data.error || 'Error deleting user')
      }
    } catch (e) {
      console.error('Error deleting user:', e)
      alert('Error deleting user')
    }
  }

  const handleResetEvent = async () => {
    if (!confirm('Reset all user points and submissions? This will clear all progress.')) return

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const response = await fetch('/api/users.php?action=reset', {
        method: 'POST',
        headers: {
          'X-Admin-Email': adminEmail || '',
        },
      })
      const data = await response.json()
      if (data.success) {
        loadUsers()
        alert('Event reset successfully!')
      } else {
        alert(data.error || 'Error resetting event')
      }
    } catch (e) {
      console.error('Error resetting event:', e)
      alert('Error resetting event')
    }
  }

  if (isLoading) {
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
              <Link href="/admin" className="text-primary-400 hover:underline mb-4 inline-block">
                ← Back to Admin Panel
              </Link>
              <h1 className="text-4xl font-bold text-white">Manage Users</h1>
            </div>
            <button
              onClick={handleResetEvent}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reset Event
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden mb-4">
            <div className="p-4 bg-gray-700/50">
              <p className="text-gray-300 text-sm">
                Total Users: <span className="text-primary-400 font-semibold">{users.length}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Points</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Solved</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                        No users registered yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-white">{user.name}</td>
                        <td className="px-6 py-4 text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 text-right text-primary-400 font-semibold">
                          {user.total_points}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-300">{user.challenges_solved}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

