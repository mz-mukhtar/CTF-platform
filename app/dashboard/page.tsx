'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Challenge } from '@/types/challenge'

interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  solved: number
}

interface CategoryPerformance {
  category: string
  userSolved: number
  totalInCategory: number
  percentile: number
  userPoints: number
  totalPointsInCategory: number
}

interface DifficultyPerformance {
  difficulty: string
  userSolved: number
  totalInDifficulty: number
  percentile: number
  userPoints: number
  totalPointsInDifficulty: number
}

function DashboardContent() {
  const { user } = useAuth()
  const [userRank, setUserRank] = useState<number>(0)
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([])
  const [difficultyPerformance, setDifficultyPerformance] = useState<DifficultyPerformance[]>([])

  useEffect(() => {
    calculateRank()
    calculateCategoryPerformance()
    calculateDifficultyPerformance()
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

  const calculateCategoryPerformance = () => {
    if (!user) return

    try {
      const challengesJson = localStorage.getItem('ctf_challenges')
      if (!challengesJson) return

      const challenges: Challenge[] = JSON.parse(challengesJson)
      const usersJson = localStorage.getItem('ctf_users')
      if (!usersJson) return

      const users = JSON.parse(usersJson)
      const categories = ['Web', 'Cryptography', 'Forensics', 'Misc']

      const performance: CategoryPerformance[] = categories.map((category) => {
        // Get challenges in this category
        const categoryChallenges = challenges.filter((c) => c.category === category)
        const totalInCategory = categoryChallenges.length

        // Get user's solved challenges in this category
        const userSolvedIds = user.solvedChallenges || []
        const userSolvedInCategory = categoryChallenges.filter((c) =>
          userSolvedIds.includes(c.id)
        )
        const userSolved = userSolvedInCategory.length
        const userPoints = userSolvedInCategory.reduce((sum, c) => sum + c.points, 0)

        // Calculate percentile: how many users have solved more challenges in this category
        const usersBetterInCategory = users.filter((u: any) => {
          if (!u.solvedChallenges) return false
          const uSolved = categoryChallenges.filter((c) =>
            u.solvedChallenges.includes(c.id)
          ).length
          return uSolved > userSolved
        }).length

        // Calculate percentile (percentage of users you're better than)
        const actualPercentile =
          totalUsers > 0
            ? Math.round(((totalUsers - usersBetterInCategory) / totalUsers) * 100)
            : 0

        return {
          category,
          userSolved,
          totalInCategory,
          percentile: actualPercentile,
          userPoints,
          totalPointsInCategory: categoryChallenges.reduce((sum, c) => sum + c.points, 0),
        }
      })

      setCategoryPerformance(performance)
    } catch (e) {
      console.error('Error calculating category performance:', e)
    }
  }

  const calculateDifficultyPerformance = () => {
    if (!user) return

    try {
      const challengesJson = localStorage.getItem('ctf_challenges')
      if (!challengesJson) return

      const challenges: Challenge[] = JSON.parse(challengesJson)
      const usersJson = localStorage.getItem('ctf_users')
      if (!usersJson) return

      const users = JSON.parse(usersJson)
      const difficulties = ['Easy', 'Medium', 'Hard']

      const performance: DifficultyPerformance[] = difficulties.map((difficulty) => {
        // Get challenges with this difficulty
        const difficultyChallenges = challenges.filter((c) => c.difficulty === difficulty)
        const totalInDifficulty = difficultyChallenges.length

        // Get user's solved challenges with this difficulty
        const userSolvedIds = user.solvedChallenges || []
        const userSolvedInDifficulty = difficultyChallenges.filter((c) =>
          userSolvedIds.includes(c.id)
        )
        const userSolved = userSolvedInDifficulty.length
        const userPoints = userSolvedInDifficulty.reduce((sum, c) => sum + c.points, 0)

        // Calculate how many users solved challenges with this difficulty
        const usersBetterInDifficulty = users.filter((u: any) => {
          if (!u.solvedChallenges) return false
          const uSolved = difficultyChallenges.filter((c) =>
            u.solvedChallenges.includes(c.id)
          ).length
          return uSolved > userSolved
        }).length

        // Calculate percentile
        const percentile =
          totalUsers > 0
            ? Math.round(((totalUsers - usersBetterInDifficulty) / totalUsers) * 100)
            : 0

        return {
          difficulty,
          userSolved,
          totalInDifficulty,
          percentile,
          userPoints,
          totalPointsInDifficulty: difficultyChallenges.reduce((sum, c) => sum + c.points, 0),
        }
      })

      setDifficultyPerformance(performance)
    } catch (e) {
      console.error('Error calculating difficulty performance:', e)
    }
  }

  // Calculate overall performance percentage
  const calculatePerformance = () => {
    if (!user || totalUsers === 0) return 0
    if (userRank === 0) return 0

    const percentile = ((totalUsers - userRank + 1) / totalUsers) * 100
    return Math.round(percentile)
  }

  const performance = calculatePerformance()
  const performanceLabel =
    performance >= 90
      ? 'Excellent'
      : performance >= 75
      ? 'Very Good'
      : performance >= 50
      ? 'Good'
      : performance >= 25
      ? 'Average'
      : 'Needs Improvement'

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Welcome back, <span className="text-primary-400 font-semibold">{user?.name}</span>!
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 md:mb-8">
            <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Total Points</h3>
              <p className="text-2xl sm:text-3xl font-bold text-primary-400">
                {user?.totalPoints || 0}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Challenges Solved</h3>
              <p className="text-2xl sm:text-3xl font-bold text-primary-400">
                {user?.challengesSolved || 0}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700">
              <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Your Rank</h3>
              <p className="text-2xl sm:text-3xl font-bold text-primary-400">
                {userRank > 0 ? `#${userRank}` : 'N/A'}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">out of {totalUsers} players</p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700 col-span-2 lg:col-span-1">
              <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Overall Performance</h3>
              <p className="text-2xl sm:text-3xl font-bold text-primary-400">{performance}%</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{performanceLabel}</p>
            </div>
          </div>

          {/* Overall Performance Details */}
          <div className="bg-gray-800/50 rounded-lg p-6 md:p-8 border border-gray-700 mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 md:mb-6">Overall Performance</h2>

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
                      style={{
                        width: `${((totalUsers - userRank + 1) / totalUsers) * 100}%`,
                      }}
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

          {/* Performance by Category */}
          <div className="bg-gray-800/50 rounded-lg p-6 md:p-8 border border-gray-700 mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 md:mb-6">Performance by Category</h2>
            <div className="space-y-6">
              {categoryPerformance.map((perf) => {
                const categoryEmojis: { [key: string]: string } = {
                  Web: '🧩',
                  Cryptography: '🔐',
                  Forensics: '🗂️',
                  Misc: '🧠',
                }

                return (
                  <div key={perf.category} className="border-l-4 border-primary-500 pl-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{categoryEmojis[perf.category]}</span>
                      <h3 className="text-xl font-semibold text-white">{perf.category}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">
                          Solved: {perf.userSolved} / {perf.totalInCategory}
                        </span>
                        <span className="text-primary-400 font-semibold">
                          {perf.userPoints} / {perf.totalPointsInCategory} points
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Percentile</span>
                        <span className="text-white font-semibold">{perf.percentile}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-primary-500 h-3 rounded-full transition-all"
                          style={{ width: `${perf.percentile}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Performance by Difficulty */}
          <div className="bg-gray-800/50 rounded-lg p-6 md:p-8 border border-gray-700 mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 md:mb-6">Performance by Difficulty</h2>
            <div className="space-y-6">
              {difficultyPerformance.map((perf) => {
                const difficultyColors: { [key: string]: string } = {
                  Easy: 'bg-green-500',
                  Medium: 'bg-yellow-500',
                  Hard: 'bg-red-500',
                }

                return (
                  <div key={perf.difficulty} className="border-l-4 border-primary-500 pl-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          perf.difficulty === 'Easy'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : perf.difficulty === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}
                      >
                        {perf.difficulty}
                      </span>
                      <h3 className="text-xl font-semibold text-white">{perf.difficulty}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">
                          Solved: {perf.userSolved} / {perf.totalInDifficulty}
                        </span>
                        <span className="text-primary-400 font-semibold">
                          {perf.userPoints} / {perf.totalPointsInDifficulty} points
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Percentile</span>
                        <span className="text-white font-semibold">{perf.percentile}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            difficultyColors[perf.difficulty]
                          }`}
                          style={{ width: `${perf.percentile}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Solved Challenges Summary */}
          <div className="bg-gray-800/50 rounded-lg p-6 md:p-8 border border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 md:mb-6">Solved Challenges</h2>
            {user?.challengesSolved === 0 ? (
              <p className="text-gray-400 text-center py-8">
                You haven&apos;t solved any challenges yet. Start playing to see your progress here!
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-300">
                  You have successfully solved{' '}
                  <span className="text-primary-400 font-semibold">
                    {user?.challengesSolved || 0}
                  </span>{' '}
                  challenge(s).
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
