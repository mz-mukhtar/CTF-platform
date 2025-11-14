'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  name: string
  description: string | null
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    if (!admin) {
      router.push('/login')
      return
    }
    loadCategories()
  }, [router])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories.php?action=list')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (e) {
      console.error('Error loading categories:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This will fail if it is used by challenges.')) return

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const response = await fetch(`/api/categories.php?action=delete&id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Email': adminEmail || '',
        },
      })
      const data = await response.json()
      if (data.success) {
        loadCategories()
      } else {
        alert(data.error || 'Error deleting category')
      }
    } catch (e) {
      console.error('Error deleting category:', e)
      alert('Error deleting category')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const categoryData = {
      name: formData.get('name'),
      description: formData.get('description') || null,
    }

    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const url = editingCategory
        ? `/api/categories.php?action=update&id=${editingCategory.id}`
        : '/api/categories.php?action=add'
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': adminEmail || '',
        },
        body: JSON.stringify(categoryData),
      })
      
      const data = await response.json()
      if (data.success) {
        setShowAddModal(false)
        setEditingCategory(null)
        loadCategories()
      } else {
        alert(data.error || 'Error saving category')
      }
    } catch (e) {
      console.error('Error saving category:', e)
      alert('Error saving category')
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
              <h1 className="text-4xl font-bold text-white">Manage Categories</h1>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null)
                setShowAddModal(true)
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Category
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                        No categories yet. Click "Add Category" to create one.
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-white font-semibold">{category.name}</td>
                        <td className="px-6 py-4 text-gray-300">
                          {category.description || <span className="text-gray-500">No description</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingCategory(category)
                                setShowAddModal(true)
                              }}
                              className="text-primary-400 hover:text-primary-300 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
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
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Category Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name || ''}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description (optional)</label>
                <textarea
                  name="description"
                  defaultValue={editingCategory?.description || ''}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingCategory(null)
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

