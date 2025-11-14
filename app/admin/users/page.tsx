'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAdminHeaders, adminApiCall } from '@/utils/adminApi'
import { useCSRF } from '@/hooks/useCSRF'

interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
  is_banned: boolean
  banned_at: string | null
  total_points: number
  challenges_solved: number
  created_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { csrfToken } = useCSRF()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all')
  const [filterBanned, setFilterBanned] = useState<'all' | 'banned' | 'active'>('all')

  // Add user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  })

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    if (!admin) {
      router.push('/login')
      return
    }
    loadUsers()
  }, [router])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, filterRole, filterBanned])

  const loadUsers = async () => {
    try {
      const response = await adminApiCall('/api/users.php?action=list')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (e) {
      console.error('Error loading users:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter((u) => u.role === filterRole)
    }

    // Banned filter
    if (filterBanned === 'banned') {
      filtered = filtered.filter((u) => u.is_banned)
    } else if (filterBanned === 'active') {
      filtered = filtered.filter((u) => !u.is_banned)
    }

    setFilteredUsers(filtered)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await adminApiCall('/api/users.php?action=add', {
        method: 'POST',
        body: JSON.stringify({
          ...newUser,
          csrf_token: csrfToken,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setShowAddModal(false)
        setNewUser({ name: '', email: '', password: '', role: 'user' })
        loadUsers()
        alert('User created successfully!')
      } else {
        alert(data.error || 'Error creating user')
      }
    } catch (e) {
      console.error('Error adding user:', e)
      alert('Error creating user')
    }
  }

  const handleBan = async (user: User) => {
    const action = user.is_banned ? 'unban' : 'ban'
    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return

    try {
      const response = await adminApiCall('/api/users.php?action=ban', {
        method: 'POST',
        body: JSON.stringify({
          id: user.id,
          is_banned: !user.is_banned,
          csrf_token: csrfToken,
        }),
      })
      const data = await response.json()
      if (data.success) {
        loadUsers()
      } else {
        alert(data.error || 'Error updating user')
      }
    } catch (e) {
      console.error('Error banning user:', e)
      alert('Error updating user')
    }
  }

  const handleMakeAdmin = async (user: User) => {
    const action = user.role === 'admin' ? 'remove admin' : 'make admin'
    if (!confirm(`Are you sure you want to ${action} for ${user.name}?`)) return

    try {
      const response = await adminApiCall('/api/users.php?action=makeAdmin', {
        method: 'POST',
        body: JSON.stringify({
          id: user.id,
          make_admin: user.role !== 'admin',
          csrf_token: csrfToken,
        }),
      })
      const data = await response.json()
      if (data.success) {
        loadUsers()
      } else {
        alert(data.error || 'Error updating user')
      }
    } catch (e) {
      console.error('Error making admin:', e)
      alert('Error updating user')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await adminApiCall(`/api/users.php?action=delete&id=${id}`, {
        method: 'DELETE',
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
      const response = await adminApiCall('/api/users.php?action=reset', {
        method: 'POST',
        headers: getAdminHeaders(),
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
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add User
              </button>
              <button
                onClick={handleResetEvent}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reset Event
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={filterBanned}
                onChange={(e) => setFilterBanned(e.target.value as any)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden mb-4">
            <div className="p-4 bg-gray-700/50">
              <p className="text-gray-300 text-sm">
                Showing <span className="text-primary-400 font-semibold">{filteredUsers.length}</span> of{' '}
                <span className="text-primary-400 font-semibold">{users.length}</span> users
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Points</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Solved</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-700/30 ${user.is_banned ? 'opacity-60' : ''}`}
                      >
                        <td className="px-6 py-4 text-white">{user.name}</td>
                        <td className="px-6 py-4 text-gray-300">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.is_banned ? (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                              Banned
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-primary-400 font-semibold">
                          {user.total_points}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-300">{user.challenges_solved}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleBan(user)}
                              className={`text-xs px-2 py-1 rounded transition-colors ${
                                user.is_banned
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              }`}
                            >
                              {user.is_banned ? 'Unban' : 'Ban'}
                            </button>
                            <button
                              onClick={() => handleMakeAdmin(user)}
                              className={`text-xs px-2 py-1 rounded transition-colors ${
                                user.role === 'admin'
                                  ? 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              }`}
                            >
                              {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'admin' })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setNewUser({ name: '', email: '', password: '', role: 'user' })
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
