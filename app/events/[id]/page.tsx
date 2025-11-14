'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CountdownTimer from '@/components/CountdownTimer'
import ChallengeCard from '@/components/ChallengeCard'
import { Challenge } from '@/types/challenge'

interface Event {
  id: number
  name: string
  description: string
  banner_url: string | null
  start_date: string
  end_date: string
  status: string
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
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
        <div className="text-white text-xl">Loading event...</div>
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
  const isArchived = event.status === 'archived'

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Event Banner */}
      {event.banner_url && (
        <div className="w-full h-64 md:h-96 bg-gray-800 relative overflow-hidden">
          <img
            src={event.banner_url}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-primary-400 hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.name}</h1>
                {event.description && (
                  <p className="text-gray-300 text-lg mb-4">{event.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-gray-300">
                  <div>
                    <span className="text-gray-400">Start:</span>{' '}
                    {new Date(event.start_date).toLocaleString()}
                  </div>
                  <div>
                    <span className="text-gray-400">End:</span>{' '}
                    {new Date(event.end_date).toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    isActive
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : isArchived
                      ? 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  }`}
                >
                  {isActive ? 'Active' : isArchived ? 'Archived' : 'Upcoming'}
                </span>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          {isActive && (
            <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                Event ends in:
              </h2>
              <CountdownTimer targetDate={event.end_date} />
            </div>
          )}

          {/* Event Actions */}
          <div className="flex gap-4 mb-8">
            {isActive && (
              <Link
                href={`/events/${event.id}/play`}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Start Playing
              </Link>
            )}
            <Link
              href={`/events/${event.id}/scoreboard`}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              View Scoreboard
            </Link>
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

          {/* Challenges Section */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">Event Challenges</h2>
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

