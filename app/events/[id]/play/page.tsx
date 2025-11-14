'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import ChallengeCard from '@/components/ChallengeCard'
import { Challenge } from '@/types/challenge'
import { useAuth } from '@/contexts/AuthContext'

interface Event {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
}

function EventPlayContent({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  useEffect(() => {
    loadEvent()
    loadChallenges()
  }, [params.id])

  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/events.php?action=get&id=${params.id}`)
      const data = await response.json()
      setEvent(data.event)
    } catch (e) {
      console.error('Error loading event:', e)
    }
  }

  const loadChallenges = async () => {
    try {
      const response = await fetch(`/api/challenges.php?action=list&event_id=${params.id}&status=active`)
      const data = await response.json()
      setChallenges(data.challenges || [])
    } catch (e) {
      console.error('Error loading challenges:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ['Web', 'Cryptography', 'Forensics', 'Misc']
  const difficulties = ['Easy', 'Medium', 'Hard']

  const filteredChallenges = challenges.filter(challenge => {
    const categoryMatch = selectedCategory === 'all' || challenge.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading challenges...</div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Event Not Found</h1>
          <Link href="/" className="text-primary-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  const isActive = event.status === 'active' && 
    new Date(event.start_date) <= new Date() && 
    new Date(event.end_date) >= new Date()

  if (!isActive) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Event Not Active</h1>
          <p className="text-gray-300 mb-4">This event is not currently active.</p>
          <Link href={`/events/${event.id}`} className="text-primary-400 hover:underline">
            ← Back to Event
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/events/${event.id}`} className="text-primary-400 hover:underline mb-4 inline-block">
              ← Back to Event
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{event.name} - Challenges</h1>
                <p className="text-gray-300">Welcome, {user?.name}! Start solving challenges to earn points.</p>
              </div>
              <Link
                href={`/events/${event.id}/scoreboard`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Scoreboard
              </Link>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Your Points</h3>
              <p className="text-3xl font-bold text-primary-400">{user?.totalPoints || 0}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Challenges Solved</h3>
              <p className="text-3xl font-bold text-primary-400">{user?.challengesSolved || 0}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
            <div className="grid md:grid-cols-3 gap-4">
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

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedDifficulty('all')
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">Challenges</h2>
            <p className="text-gray-300 mb-4">
              Showing <span className="text-primary-400 font-semibold">{filteredChallenges.length}</span> challenge(s)
            </p>
          </div>

          {filteredChallenges.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-12 text-center border border-gray-700">
              <p className="text-gray-400 text-lg">
                {challenges.length === 0 
                  ? 'No challenges available for this event yet.'
                  : 'No challenges match your filters.'}
              </p>
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

export default function EventPlayPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <EventPlayContent params={params} />
    </ProtectedRoute>
  )
}

