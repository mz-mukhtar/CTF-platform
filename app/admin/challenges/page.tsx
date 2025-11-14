'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Challenge {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  points: number
  flag: string
  files: any
  challenge_link: string
  event_id: number | null
  status: string
}

export default function AdminChallengesPage() {
  const router = useRouter()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    if (!admin) {
      router.push('/login')
      return
    }
    loadChallenges()
  }, [router])

  const loadChallenges = async () => {
    try {
      const response = await fetch('/api/challenges.php?action=list&status=all')
      const data = await response.json()
      setChallenges(data.challenges || [])
    } catch (e) {
      console.error('Error loading challenges:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const response = await fetch(`/api/challenges.php?action=delete&id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Email': adminEmail || '',
        },
      })
      const data = await response.json()
      if (data.success) {
        loadChallenges()
      }
    } catch (e) {
      console.error('Error deleting challenge:', e)
    }
  }

  const handleToggleStatus = async (challenge: Challenge) => {
    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const newStatus = challenge.status === 'active' ? 'disabled' : 'active'
      const response = await fetch(`/api/challenges.php?action=update&id=${challenge.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': adminEmail || '',
        },
        body: JSON.stringify({
          ...challenge,
          status: newStatus,
        }),
      })
      const data = await response.json()
      if (data.success) {
        loadChallenges()
      }
    } catch (e) {
      console.error('Error updating challenge:', e)
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
              <h1 className="text-4xl font-bold text-white">Manage Challenges</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Challenge
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Difficulty</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Points</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {challenges.map((challenge) => (
                    <tr key={challenge.id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 text-white">{challenge.title}</td>
                      <td className="px-6 py-4 text-gray-300">{challenge.category}</td>
                      <td className="px-6 py-4 text-gray-300">{challenge.difficulty}</td>
                      <td className="px-6 py-4 text-primary-400">{challenge.points}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            challenge.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {challenge.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingChallenge(challenge)}
                            className="text-primary-400 hover:text-primary-300 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(challenge)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            {challenge.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDelete(challenge.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

