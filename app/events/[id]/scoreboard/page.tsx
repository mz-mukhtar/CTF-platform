'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Event {
  id: number
  name: string
  status: string
}

interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  solved: number
}

export default function EventScoreboardPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEvent()
    loadScoreboard()
    
    // Refresh every 2 seconds if event is active
    const interval = setInterval(() => {
      if (event?.status === 'active') {
        loadScoreboard()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [params.id, event?.status])

  const loadEvent = async () => {
    try {
      const response = await fetch(`/api/events.php?action=get&id=${params.id}`)
      const data = await response.json()
      setEvent(data.event)
    } catch (e) {
      console.error('Error loading event:', e)
    }
  }

  const loadScoreboard = async () => {
    try {
      const response = await fetch(`/api/events.php?action=scoreboard&id=${params.id}`)
      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
    } catch (e) {
      console.error('Error loading scoreboard:', e)
      // Fallback: load from localStorage if API fails
      loadScoreboardFromLocalStorage()
    } finally {
      setIsLoading(false)
    }
  }

  const loadScoreboardFromLocalStorage = () => {
    try {
      const usersJson = localStorage.getItem('ctf_users')
      if (!usersJson) {
        setLeaderboard([])
        return
      }

      const users = JSON.parse(usersJson)
      const sortedUsers = [...users].sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints
        }
        return b.challengesSolved - a.challengesSolved
      })

      const entries: LeaderboardEntry[] = sortedUsers.map((user, index) => ({
        rank: index + 1,
        username: user.name,
        points: user.totalPoints,
        solved: user.challengesSolved,
      }))

      setLeaderboard(entries)
    } catch (e) {
      console.error('Error loading from localStorage:', e)
      setLeaderboard([])
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading scoreboard...</div>
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

  const isArchived = event.status === 'archived'

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/events/${event.id}`} className="text-primary-400 hover:underline mb-4 inline-block">
              ← Back to Event
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {event.name} - Scoreboard
                </h1>
                {isArchived && (
                  <p className="text-gray-400 text-sm">📦 Archived Event</p>
                )}
              </div>
              {!isArchived && (
                <Link
                  href={`/events/${event.id}/play`}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Play Challenges
                </Link>
              )}
            </div>
          </div>

          {/* Scoreboard Table */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Username</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Points</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Solved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                        No players yet. Be the first to register and start solving challenges!
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((entry, index) => {
                      const isTopThree = entry.rank <= 3
                      const rankColors = {
                        1: 'text-yellow-400',
                        2: 'text-gray-300',
                        3: 'text-orange-400',
                      }

                      return (
                        <tr
                          key={index}
                          className={`hover:bg-gray-700/30 transition-colors ${
                            isTopThree ? 'bg-gray-700/20' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {entry.rank === 1 && <span className="text-2xl">🥇</span>}
                              {entry.rank === 2 && <span className="text-2xl">🥈</span>}
                              {entry.rank === 3 && <span className="text-2xl">🥉</span>}
                              <span
                                className={`font-bold ${
                                  isTopThree
                                    ? rankColors[entry.rank as keyof typeof rankColors] || 'text-white'
                                    : 'text-gray-300'
                                }`}
                              >
                                {entry.rank}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white font-medium">{entry.username}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-primary-400 font-semibold">
                              {entry.points}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-gray-300">{entry.solved}</span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info */}
          {!isArchived && (
            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>Scoreboard updates automatically every 2 seconds</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

