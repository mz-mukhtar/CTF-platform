'use client'

import { Challenge } from '@/types/challenge'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface ChallengeCardProps {
  challenge: Challenge
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { isChallengeSolved } = useAuth()
  const isSolved = isChallengeSolved(challenge.id)
  const difficultyColors = {
    Easy: 'bg-green-500/20 text-green-400 border-green-500/50',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    Hard: 'bg-red-500/20 text-red-400 border-red-500/50',
  }

  const categoryEmojis = {
    Web: '🧩',
    Cryptography: '🔐',
    Forensics: '🗂️',
    Misc: '🧠',
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
        <span className="text-2xl">{categoryEmojis[challenge.category]}</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[challenge.difficulty]}`}
        >
          {challenge.difficulty}
        </span>
        <span className="text-primary-400 font-semibold">
          {challenge.points} points
        </span>
      </div>

      <p className="text-gray-300 mb-4 text-sm leading-relaxed">
        {challenge.description}
      </p>

      {isSolved && (
        <div className="mb-3 bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1 rounded-lg text-sm text-center">
          ✓ Completed
        </div>
      )}

      <Link
        href={`/challenges/${challenge.id}`}
        className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105"
      >
        {isSolved ? 'View Challenge' : 'Open Challenge'}
      </Link>
    </div>
  )
}

