'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  solved: number
}

function DashboardContent() {
  const { user } = useAuth()
  const [userRank, setUserRank] = useState<number>(0)
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    calculateRank()
  }, [user])

  const calculateRank = () => {
    try {
      const usersJson = localStorage.getItem('ctf_users')
      if (!usersJson) {
        setIsLoading(false)
        return
      }

      const users = JSON.parse(usersJson)
      setTotalUsers(users.length)

      // Sort users by points (descending), then by challenges solved (descending)
      const sortedUsers = [...users].sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints
        }
        return b.challengesSolved - a.challengesSolved
      })

      // Find user's rank
      const rank = sortedUsers.findIndex((u) => u.id === user?.id) + 1
      setUserRank(rank > 0 ? rank : 0)
    } catch (e) {
      console.error('Error calculating rank:', e)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate performance percentage
  const calculatePerformance = () => {
    if (!user || totalUsers === 0) return 0
    if (userRank === 0) return 0
    
    // Top 10% = excellent, Top 25% = good, Top 50% = average, etc.
    const percentile = ((totalUsers - userRank + 1) / totalUsers) * 100
    return Math.round(percentile)
  }

  const performance = calculatePerformance()
  const performanceLabel = 
    performance >= 90 ? 'Excellent' :
    performance >= 75 ? 'Very Good' :
    performance >= 50 ? 'Good' :
    performance >= 25 ? 'Average' :
    'Needs Improvement'

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">
              Welcome back, <span className="text-primary-400 font-semibold">{user?.name}</span>!
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Total Points</h3>
              <p className="text-3xl font-bold text-primary-400">
                {user?.totalPoints || 0}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Challenges Solved</h3>
              <p className="text-3xl font-bold text-primary-400">
                {user?.challengesSolved || 0}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Your Rank</h3>
              <p className="text-3xl font-bold text-primary-400">
                {userRank > 0 ? `#${userRank}` : 'N/A'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                out of {totalUsers} players
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Performance</h3>
              <p className="text-2xl font-bold text-primary-400">
                {performance}%
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {performanceLabel}
              </p>
            </div>
          </div>

          {/* Performance Details */}
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Performance</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Rank</span>
                  <span className="text-white font-semibold">
                    {userRank > 0 ? `#${userRank} of ${totalUsers}` : 'Not ranked yet'}
                  </span>
                </div>
                {userRank > 0 && (
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${((totalUsers - userRank + 1) / totalUsers) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Percentile</span>
                  <span className="text-white font-semibold">{performance}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${performance}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-gray-300">
                  <strong className="text-white">Performance Level:</strong>{' '}
                  <span className="text-primary-400">{performanceLabel}</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  You are performing better than {performance}% of all players on the platform.
                </p>
              </div>
            </div>
          </div>

          {/* Solved Challenges Summary */}
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Solved Challenges</h2>
            {user?.challengesSolved === 0 ? (
              <p className="text-gray-400 text-center py-8">
                You haven't solved any challenges yet. Start playing to see your progress here!
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-300">
                  You have successfully solved <span className="text-primary-400 font-semibold">{user?.challengesSolved || 0}</span> challenge(s).
                </p>
                <p className="text-gray-400 text-sm">
                  Keep solving challenges to improve your rank and performance!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
