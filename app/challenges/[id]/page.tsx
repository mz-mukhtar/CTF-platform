'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getChallengeById } from '@/data/challenges'
import { useAuth } from '@/contexts/AuthContext'

function ChallengeDetailContent({ params }: { params: { id: string } }) {
  const { id } = params
  const challenge = getChallengeById(id)
  const { submitFlag, isChallengeSolved, user } = useAuth()
  const [flag, setFlag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [isSolved, setIsSolved] = useState(false)

  // Check if challenge is solved on mount
  useEffect(() => {
    if (challenge) {
      setIsSolved(isChallengeSolved(challenge.id))
    }
  }, [challenge, isChallengeSolved])

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Challenge Not Found</h1>
          <Link
            href="/dashboard"
            className="text-primary-400 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmissionResult({ type: null, message: '' })

    if (!flag.trim()) {
      setSubmissionResult({ type: 'error', message: 'Please enter a flag' })
      return
    }

    setIsSubmitting(true)
    const success = await submitFlag(challenge.id, flag, challenge.points)
    setIsSubmitting(false)

    if (success) {
      if (isSolved) {
        setSubmissionResult({
          type: 'success',
          message: 'Flag is correct! (You already solved this challenge)',
        })
      } else {
        setIsSolved(true)
        setSubmissionResult({
          type: 'success',
          message: `Correct! You earned ${challenge.points} points! Challenge marked as completed.`,
        })
        setFlag('')
      }
    } else {
      setSubmissionResult({ type: 'error', message: 'Incorrect flag' })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="text-primary-400 hover:underline mb-6 inline-block"
          >
            ← Back to Dashboard
          </Link>

          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{categoryEmojis[challenge.category]}</span>
                <h1 className="text-4xl font-bold text-white">{challenge.title}</h1>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-300">
                  <span className="text-gray-400">Category:</span> {challenge.category}
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold border ${difficultyColors[challenge.difficulty]}`}
                >
                  {challenge.difficulty}
                </span>
                <span className="text-primary-400 font-semibold text-lg">
                  {challenge.points} points
                </span>
              </div>
              {isSolved && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg inline-block">
                  ✓ Challenge Completed
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
            </div>

            {/* Files Section */}
            {challenge.files && challenge.files.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Files</h2>
                <div className="space-y-2">
                  {challenge.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {file.downloadUrl ? (
                        <a
                          href={file.downloadUrl}
                          download
                          className="text-primary-400 hover:text-primary-300 hover:underline flex items-center gap-2"
                        >
                          <span>📥</span>
                          <span>Download {file.name}</span>
                        </a>
                      ) : (
                        <span className="text-gray-400">{file.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenge Link */}
            {challenge.challengeLink && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Challenge Link</h2>
                <a
                  href={challenge.challengeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 hover:underline flex items-center gap-2"
                >
                  <span>🔗</span>
                  <span>Visit challenge link: {challenge.challengeLink}</span>
                </a>
              </div>
            )}

            {/* Flag Submission Form */}
            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Flag Submission</h2>
              
              {submissionResult.type && (
                <div
                  className={`mb-4 px-4 py-3 rounded-lg ${
                    submissionResult.type === 'success'
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : 'bg-red-500/20 border border-red-500/50 text-red-400'
                  }`}
                >
                  {submissionResult.message}
                </div>
              )}

              {isSolved ? (
                <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                  <p className="text-gray-300 text-lg">
                    🎉 Congratulations! You&apos;ve already completed this challenge.
                  </p>
                  <p className="text-gray-400 mt-2">
                    You earned {challenge.points} points for solving this challenge.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="flag" className="block text-gray-300 mb-2">
                      Enter Flag:
                    </label>
                    <input
                      type="text"
                      id="flag"
                      value={flag}
                      onChange={(e) => setFlag(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="CTF{...}"
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Flag'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <ChallengeDetailContent params={params} />
    </ProtectedRoute>
  )
}
