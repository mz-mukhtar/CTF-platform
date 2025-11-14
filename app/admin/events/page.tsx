'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Event {
  id: number
  name: string
  description: string
  banner_url: string | null
  start_date: string
  end_date: string
  status: string
}

export default function AdminEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    if (!admin) {
      router.push('/login')
      return
    }
    loadEvents()
  }, [router])

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/events.php?action=list')
      const data = await response.json()
      setEvents(data.events || [])
    } catch (e) {
      console.error('Error loading events:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event? This will not delete associated challenges.')) return

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const response = await fetch(`/api/events.php?action=delete&id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Email': adminEmail || '',
        },
      })
      const data = await response.json()
      if (data.success) {
        loadEvents()
      }
    } catch (e) {
      console.error('Error deleting event:', e)
      alert('Error deleting event')
    }
  }

  const handleArchive = async (id: number) => {
    if (!confirm('Archive this event? Challenges will be moved to general area.')) return

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const response = await fetch(`/api/events.php?action=archive&id=${id}`, {
        method: 'POST',
        headers: {
          'X-Admin-Email': adminEmail || '',
        },
      })
      const data = await response.json()
      if (data.success) {
        loadEvents()
        alert('Event archived successfully! Challenges moved to general area.')
      }
    } catch (e) {
      console.error('Error archiving event:', e)
      alert('Error archiving event')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const eventData = {
      name: formData.get('name'),
      description: formData.get('description'),
      banner_url: formData.get('banner_url') || null,
      start_date: formData.get('start_date') || null,
      end_date: formData.get('end_date') || null,
      status: formData.get('status') || 'draft',
    }

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const url = editingEvent
        ? `/api/events.php?action=update&id=${editingEvent.id}`
        : '/api/events.php?action=create'
      
      const response = await fetch(url, {
        method: editingEvent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': adminEmail || '',
        },
        body: JSON.stringify(eventData),
      })
      
      const data = await response.json()
      if (data.success) {
        setShowAddModal(false)
        setEditingEvent(null)
        loadEvents()
      } else {
        alert(data.error || 'Error saving event')
      }
    } catch (e) {
      console.error('Error saving event:', e)
      alert('Error saving event')
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
              <h1 className="text-4xl font-bold text-white">Manage Events</h1>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null)
                setShowAddModal(true)
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Event
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">End Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        No events yet. Click "Create Event" to create one.
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-white">{event.name}</td>
                        <td className="px-6 py-4 text-gray-300">
                          {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {event.end_date ? new Date(event.end_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              event.status === 'active'
                                ? 'bg-green-500/20 text-green-400'
                                : event.status === 'archived'
                                ? 'bg-gray-500/20 text-gray-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingEvent(event)
                                setShowAddModal(true)
                              }}
                              className="text-primary-400 hover:text-primary-300 text-sm"
                            >
                              Edit
                            </button>
                            {event.status !== 'archived' && (
                              <button
                                onClick={() => handleArchive(event.id)}
                                className="text-yellow-400 hover:text-yellow-300 text-sm"
                              >
                                Archive
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(event.id)}
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
              {editingEvent ? 'Edit Event' : 'Create Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Event Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingEvent?.name || ''}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingEvent?.description || ''}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Banner URL</label>
                <input
                  type="url"
                  name="banner_url"
                  defaultValue={editingEvent?.banner_url || ''}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    defaultValue={editingEvent?.start_date ? new Date(editingEvent.start_date).toISOString().slice(0, 16) : ''}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    defaultValue={editingEvent?.end_date ? new Date(editingEvent.end_date).toISOString().slice(0, 16) : ''}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={editingEvent?.status || 'draft'}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {editingEvent ? 'Update' : 'Create'} Event
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingEvent(null)
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

