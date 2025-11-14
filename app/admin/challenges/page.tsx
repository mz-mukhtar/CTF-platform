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

interface Event {
  id: number
  name: string
}

export default function AdminChallengesPage() {
  const router = useRouter()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [events, setEvents] = useState<Event[]>([])
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
    loadEvents()
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

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/events.php?action=list')
      const data = await response.json()
      setEvents(data.events || [])
    } catch (e) {
      console.error('Error loading events:', e)
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
      alert('Error deleting challenge')
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
      alert('Error updating challenge')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const challengeData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      difficulty: formData.get('difficulty'),
      points: parseInt(formData.get('points') as string),
      flag: formData.get('flag'),
      challenge_link: formData.get('challenge_link') || null,
      event_id: formData.get('event_id') ? parseInt(formData.get('event_id') as string) : null,
      files: [],
      status: formData.get('status') || 'active',
    }

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const url = editingChallenge
        ? `/api/challenges.php?action=update&id=${editingChallenge.id}`
        : '/api/challenges.php?action=add'
      
      const response = await fetch(url, {
        method: editingChallenge ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': adminEmail || '',
        },
        body: JSON.stringify(challengeData),
      })
      
      const data = await response.json()
      if (data.success) {
        setShowAddModal(false)
        setEditingChallenge(null)
        loadChallenges()
      } else {
        alert(data.error || 'Error saving challenge')
      }
    } catch (e) {
      console.error('Error saving challenge:', e)
      alert('Error saving challenge')
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
              onClick={() => {
                setEditingChallenge(null)
                setShowAddModal(true)
              }}
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
                  {challenges.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                        No challenges yet. Click "Add Challenge" to create one.
                      </td>
                    </tr>
                  ) : (
                    challenges.map((challenge) => (
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
                              onClick={() => {
                                setEditingChallenge(challenge)
                                setShowAddModal(true)
                              }}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingChallenge ? 'Edit Challenge' : 'Add Challenge'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingChallenge?.title || ''}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingChallenge?.description || ''}
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    defaultValue={editingChallenge?.category || 'Web'}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Web">Web</option>
                    <option value="Cryptography">Cryptography</option>
                    <option value="Forensics">Forensics</option>
                    <option value="Misc">Misc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    defaultValue={editingChallenge?.difficulty || 'Easy'}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Points</label>
                  <input
                    type="number"
                    name="points"
                    defaultValue={editingChallenge?.points || 100}
                    required
                    min="1"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={editingChallenge?.status || 'active'}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Flag (cvctf{`{...}`}) <span className="text-gray-500 text-sm">(will be hashed with SHA-256)</span>
                </label>
                <input
                  type="text"
                  name="flag"
                  defaultValue={editingChallenge?.flag || ''}
                  required
                  placeholder="cvctf{flag_here}"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-gray-500 text-xs mt-1">
                  The flag will be automatically hashed using SHA-256 before storage for security.
                </p>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Challenge Link (optional)</label>
                <input
                  type="url"
                  name="challenge_link"
                  defaultValue={editingChallenge?.challenge_link || ''}
                  placeholder="https://example.com/challenge"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Event (optional)</label>
                <select
                  name="event_id"
                  defaultValue={editingChallenge?.event_id?.toString() || ''}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">General (No Event)</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {editingChallenge ? 'Update' : 'Create'} Challenge
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingChallenge(null)
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
