'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FlagSubmission {
  id: number
  user_id: number
  challenge_id: number
  flag: string
  is_correct: boolean
  submitted_at: string
  user_name: string
  challenge_title: string
}

export default function AdminFlagsPage() {
  const router = useRouter()
  const [flags, setFlags] = useState<FlagSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChallenge, setSelectedChallenge] = useState<string>('all')

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    if (!admin) {
      router.push('/login')
      return
    }
    loadFlags()
  }, [router, selectedChallenge])

  const loadFlags = async () => {
    try {
      const adminEmail = localStorage.getItem('ctf_admin_email')
      const url = selectedChallenge !== 'all'
        ? `/api/users.php?action=flags&challenge_id=${selectedChallenge}`
        : '/api/users.php?action=flags'
      
      const response = await fetch(url, {
        headers: {
          'X-Admin-Email': adminEmail || '',
        },
      })
      const data = await response.json()
      setFlags(data.flags || [])
    } catch (e) {
      console.error('Error loading flags:', e)
    } finally {
      setIsLoading(false)
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
          <div className="mb-8">
            <Link href="/admin" className="text-primary-400 hover:underline mb-4 inline-block">
              ← Back to Admin Panel
            </Link>
            <h1 className="text-4xl font-bold text-white">Submitted Flags</h1>
          </div>

          {/* Filter */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
            <label className="block text-gray-300 mb-2">Filter by Challenge</label>
            <select
              value={selectedChallenge}
              onChange={(e) => setSelectedChallenge(e.target.value)}
              className="w-full md:w-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Challenges</option>
              {/* Challenge options would be loaded from API */}
            </select>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Total Submissions</p>
              <p className="text-2xl font-bold text-white">{flags.length}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Correct Flags</p>
              <p className="text-2xl font-bold text-green-400">
                {flags.filter(f => f.is_correct).length}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Incorrect Flags</p>
              <p className="text-2xl font-bold text-red-400">
                {flags.filter(f => !f.is_correct).length}
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Challenge</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Flag</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {flags.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        No flag submissions yet.
                      </td>
                    </tr>
                  ) : (
                    flags.map((flag) => (
                      <tr key={flag.id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 text-white">{flag.user_name}</td>
                        <td className="px-6 py-4 text-gray-300">{flag.challenge_title}</td>
                        <td className="px-6 py-4">
                          <code className="bg-gray-700 px-2 py-1 rounded text-sm text-gray-300">
                            {flag.flag}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              flag.is_correct
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {flag.is_correct ? 'Correct' : 'Incorrect'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          {new Date(flag.submitted_at).toLocaleString()}
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

