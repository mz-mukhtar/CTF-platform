'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Sponsor {
  id: number
  name: string
  logo_url: string
  website_url: string | null
  display_order: number
}

export default function AdminSponsorsPage() {
  const router = useRouter()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    if (!admin) {
      router.push('/login')
      return
    }
    loadSponsors()
  }, [router])

  const loadSponsors = async () => {
    try {
      const response = await fetch('/api/sponsors.php?action=list')
      const data = await response.json()
      setSponsors(data.sponsors || [])
    } catch (e) {
      console.error('Error loading sponsors:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const response = await fetch(`/api/sponsors.php?action=delete&id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Email': adminEmail || '',
        },
      })
      const data = await response.json()
      if (data.success) {
        loadSponsors()
      }
    } catch (e) {
      console.error('Error deleting sponsor:', e)
      alert('Error deleting sponsor')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const sponsorData = {
      name: formData.get('name'),
      logo_url: formData.get('logo_url'),
      website_url: formData.get('website_url') || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
    }

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const url = editingSponsor
        ? `/api/sponsors.php?action=update&id=${editingSponsor.id}`
        : '/api/sponsors.php?action=add'
      
      const response = await fetch(url, {
        method: editingSponsor ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': adminEmail || '',
        },
        body: JSON.stringify(sponsorData),
      })
      
      const data = await response.json()
      if (data.success) {
        setShowAddModal(false)
        setEditingSponsor(null)
        loadSponsors()
      } else {
        alert(data.error || 'Error saving sponsor')
      }
    } catch (e) {
      console.error('Error saving sponsor:', e)
      alert('Error saving sponsor')
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
              <h1 className="text-4xl font-bold text-white">Manage Sponsors</h1>
            </div>
            <button
              onClick={() => {
                setEditingSponsor(null)
                setShowAddModal(true)
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Sponsor
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Logo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Website</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sponsors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        No sponsors yet. Click &quot;Add Sponsor&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    sponsors.map((sponsor) => (
                      <tr key={sponsor.id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-white">{sponsor.name}</td>
                        <td className="px-6 py-4">
                          {sponsor.logo_url && (
                            <img
                              src={sponsor.logo_url}
                              alt={sponsor.name}
                              className="h-12 w-auto object-contain"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {sponsor.website_url ? (
                            <a
                              href={sponsor.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:underline"
                            >
                              {sponsor.website_url}
                            </a>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-300">{sponsor.display_order}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingSponsor(sponsor)
                                setShowAddModal(true)
                              }}
                              className="text-primary-400 hover:text-primary-300 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(sponsor.id)}
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
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Sponsor Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingSponsor?.name || ''}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Logo URL</label>
                <input
                  type="url"
                  name="logo_url"
                  defaultValue={editingSponsor?.logo_url || ''}
                  required
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Website URL (optional)</label>
                <input
                  type="url"
                  name="website_url"
                  defaultValue={editingSponsor?.website_url || ''}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  defaultValue={editingSponsor?.display_order || 0}
                  min="0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {editingSponsor ? 'Update' : 'Create'} Sponsor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingSponsor(null)
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

