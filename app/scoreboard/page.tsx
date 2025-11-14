'use client'

import { useState, useEffect } from 'react'
import { User } from '@/contexts/AuthContext'

interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  solved: number
}

export default function ScoreboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = () => {
      try {
        const usersJson = localStorage.getItem('ctf_users')
        if (!usersJson) {
          setLeaderboard([])
          setIsLoading(false)
          return
        }

        const users: User[] = JSON.parse(usersJson)
        
        // Sort users by points (descending), then by challenges solved (descending)
        const sortedUsers = [...users].sort((a, b) => {
          if (b.totalPoints !== a.totalPoints) {
            return b.totalPoints - a.totalPoints
          }
          return b.challengesSolved - a.challengesSolved
        })

        // Filter out users with 0 points and create leaderboard entries with ranks
        const usersWithPoints = sortedUsers.filter((user) => user.totalPoints > 0)
        const entries: LeaderboardEntry[] = usersWithPoints.map((user, index) => ({
          rank: index + 1,
          username: user.name,
          points: user.totalPoints,
          solved: user.challengesSolved,
        }))

        setLeaderboard(entries)
      } catch (e) {
        console.error('Error loading leaderboard:', e)
        setLeaderboard([])
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()

    // Refresh leaderboard every 2 seconds to update in real-time
    const interval = setInterval(loadLeaderboard, 2000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading leaderboard...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Scoreboard</h1>
            <p className="text-gray-300">Global ranking of all players</p>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Username
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      Points
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      Solved
                    </th>
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
                      // Highlight top 3 positions
                      const isTopThree = entry.rank <= 3
                      const rankColors = {
                        1: 'text-yellow-400', // Gold
                        2: 'text-gray-300', // Silver
                        3: 'text-orange-400', // Bronze
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
                                    ? rankColors[entry.rank as keyof typeof rankColors] ||
                                      'text-white'
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
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Leaderboard updates automatically every 2 seconds</p>
          </div>
        </div>
      </div>
    </main>
  )
}

