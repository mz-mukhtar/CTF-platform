'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { checkPasswordStrength, generateStrongPassword } from '@/utils/passwordStrength'
import { useCSRF } from '@/hooks/useCSRF'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof checkPasswordStrength> | null>(null)
  const [showSuggestedPassword, setShowSuggestedPassword] = useState(false)
  const [suggestedPassword, setSuggestedPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { register } = useAuth()
  const { csrfToken } = useCSRF()
  const router = useRouter()

  const handleGeneratePassword = () => {
    const generated = generateStrongPassword()
    setSuggestedPassword(generated)
    setShowSuggestedPassword(true)
  }

  const useSuggestedPassword = () => {
    setPassword(suggestedPassword)
    setConfirmPassword(suggestedPassword)
    setPasswordStrength(checkPasswordStrength(suggestedPassword))
    setShowSuggestedPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Usage Policy to register')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Check password strength
    const strength = checkPasswordStrength(password)
    setPasswordStrength(strength)

    if (!strength.isStrong) {
      setError('Password does not meet strength requirements. Please see suggestions below.')
      return
    }

    setIsLoading(true)
    const success = await register(name, email, password)
    setIsLoading(false)

    if (success) {
      router.push('/dashboard')
    } else {
      setError('Email already registered')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="bg-gray-800/50 rounded-lg p-8 max-w-md w-full shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Register
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-gray-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-primary-400 hover:text-primary-300 text-xs"
              >
                Generate Strong Password
              </button>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
                if (e.target.value) {
                  setPasswordStrength(checkPasswordStrength(e.target.value))
                } else {
                  setPasswordStrength(null)
                }
              }}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your password"
              required
            />
            {showSuggestedPassword && (
              <div className="mt-2 p-3 bg-gray-700 rounded-lg border border-primary-500/50">
                <p className="text-gray-300 text-sm mb-2">Suggested password:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-800 px-3 py-2 rounded text-primary-400 text-sm">
                    {suggestedPassword}
                  </code>
                  <button
                    type="button"
                    onClick={useSuggestedPassword}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSuggestedPassword(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            {passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength.score <= 1
                          ? 'bg-red-500'
                          : passwordStrength.score === 2
                          ? 'bg-yellow-500'
                          : passwordStrength.score === 3
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      passwordStrength.isStrong
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {passwordStrength.isStrong ? 'Strong' : 'Weak'}
                  </span>
                </div>
                {!passwordStrength.isStrong && (
                  <ul className="text-xs text-gray-400 mt-1 space-y-1">
                    {passwordStrength.feedback.map((msg, idx) => (
                      <li key={idx}>• {msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Confirm your password"
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked)
                setError('')
              }}
              required
              className="mt-1 w-5 h-5 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
            />
            <label htmlFor="agreeTerms" className="text-gray-300 text-sm">
              I agree to the{' '}
              <Link
                href="/terms"
                target="_blank"
                className="text-primary-400 hover:underline"
              >
                Terms of Service and Usage Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !passwordStrength?.isStrong || password !== confirmPassword || !agreedToTerms}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-400 hover:underline">
              Login
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-primary-400 hover:underline text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
