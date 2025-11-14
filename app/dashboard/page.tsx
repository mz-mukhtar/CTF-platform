'use client'

import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import ChallengeCard from '@/components/ChallengeCard'
import { getChallengesByCategory, Challenge } from '@/data/challenges'
import { ChallengeCategory } from '@/types/challenge'

function ChallengeSection({
  category,
  emoji,
  challenges,
}: {
  category: ChallengeCategory
  emoji: string
  challenges: Challenge[]
}) {
  if (challenges.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-4xl">{emoji}</span>
        {category} Challenges
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </section>
  )
}

function DashboardContent() {
  const { user } = useAuth()

  const webChallenges = getChallengesByCategory('Web')
  const cryptoChallenges = getChallengesByCategory('Cryptography')
  const forensicsChallenges = getChallengesByCategory('Forensics')
  const miscChallenges = getChallengesByCategory('Misc')

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-300">
                Welcome back, <span className="text-primary-400 font-semibold">{user?.name}</span>!
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/scoreboard"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Scoreboard
              </Link>
              <Link
                href="/profile"
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/"
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Home
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">
                Total Points
              </h3>
              <p className="text-3xl font-bold text-primary-400">
                {user?.totalPoints || 0}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">
                Challenges Solved
              </h3>
              <p className="text-3xl font-bold text-primary-400">
                {user?.challengesSolved || 0}
              </p>
            </div>
          </div>

          {/* Challenge Sections */}
          <ChallengeSection
            category="Web"
            emoji="🧩"
            challenges={webChallenges}
          />
          <ChallengeSection
            category="Cryptography"
            emoji="🔐"
            challenges={cryptoChallenges}
          />
          <ChallengeSection
            category="Forensics"
            emoji="🗂️"
            challenges={forensicsChallenges}
          />
          <ChallengeSection
            category="Misc"
            emoji="🧠"
            challenges={miscChallenges}
          />
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

