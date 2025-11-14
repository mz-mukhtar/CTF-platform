'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChallengeCard from '@/components/ChallengeCard'
import { Challenge } from '@/types/challenge'

export default function PlayPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedEvent, setSelectedEvent] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['Web', 'Cryptography', 'Forensics', 'Misc']
  const difficulties = ['Easy', 'Medium', 'Hard']

  useEffect(() => {
    loadChallenges()
  }, [])

  useEffect(() => {
    filterChallenges()
  }, [challenges, selectedCategory, selectedDifficulty, selectedEvent, searchQuery])

  const loadChallenges = async () => {
    try {
      const response = await fetch('/api/challenges.php?action=list&status=active')
      const data = await response.json()
      setChallenges(data.challenges || [])
    } catch (e) {
      console.error('Error loading challenges:', e)
      // Fallback to local data
      const { challenges: localChallenges } = await import('@/data/challenges')
      setChallenges(localChallenges)
    } finally {
      setIsLoading(false)
    }
  }

  const filterChallenges = () => {
    let filtered = [...challenges]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(c => c.difficulty === selectedDifficulty)
    }

    // Filter by event (general vs event-specific)
    if (selectedEvent === 'general') {
      filtered = filtered.filter(c => !c.event_id)
    } else if (selectedEvent !== 'all') {
      filtered = filtered.filter(c => c.event_id === parseInt(selectedEvent))
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredChallenges(filtered)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading challenges...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-primary-400 hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">CTF Challenges</h1>
            <p className="text-gray-300">Browse and filter challenges by category, difficulty, and event</p>
          </div>

          {/* Filters */}
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-4">
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Difficulties</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              {/* Event Filter */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Event</label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Events</option>
                  <option value="general">General (Past Events)</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedDifficulty('all')
                    setSelectedEvent('all')
                    setSearchQuery('')
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-300">
              Showing <span className="text-primary-400 font-semibold">{filteredChallenges.length}</span> challenge(s)
            </p>
          </div>

          {/* Challenges Grid */}
          {filteredChallenges.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-12 text-center border border-gray-700">
              <p className="text-gray-400 text-lg">No challenges found matching your filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

