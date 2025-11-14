'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { checkPasswordStrength, generateStrongPassword } from '@/utils/passwordStrength'

function ProfileContent() {
  const { user, logout, changeUsername, changePassword } = useAuth()
  const router = useRouter()

  // Username change state
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof checkPasswordStrength> | null>(null)
  const [showSuggestedPassword, setShowSuggestedPassword] = useState(false)
  const [suggestedPassword, setSuggestedPassword] = useState('')

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleUsernameChange = async () => {
    setUsernameError('')
    
    if (!newUsername.trim()) {
      setUsernameError('Username cannot be empty')
      return
    }

    if (newUsername.trim() === user?.name) {
      setUsernameError('This is already your username')
      return
    }

    const success = await changeUsername(newUsername.trim())
    if (success) {
      setIsEditingUsername(false)
      setNewUsername('')
    } else {
      setUsernameError('Failed to update username')
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    
    if (!oldPassword) {
      setPasswordError('Please enter your current password')
      return
    }

    if (!newPassword) {
      setPasswordError('Please enter a new password')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    // Check password strength
    const strength = checkPasswordStrength(newPassword)
    setPasswordStrength(strength)

    if (!strength.isStrong) {
      setPasswordError('Password does not meet strength requirements. See suggestions below.')
      return
    }

    const result = await changePassword(oldPassword, newPassword)
    if (result.success) {
      setIsChangingPassword(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordStrength(null)
      alert('Password changed successfully!')
    } else {
      setPasswordError(result.error || 'Failed to change password')
    }
  }

  const handleGeneratePassword = () => {
    const generated = generateStrongPassword()
    setSuggestedPassword(generated)
    setShowSuggestedPassword(true)
  }

  const useSuggestedPassword = () => {
    setNewPassword(suggestedPassword)
    setConfirmPassword(suggestedPassword)
    setPasswordStrength(checkPasswordStrength(suggestedPassword))
    setShowSuggestedPassword(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Profile</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-8 space-y-6">
            {/* Username Section */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Username
              </label>
              {!isEditingUsername ? (
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-700 rounded-lg px-4 py-3 text-white text-lg">
                    {user?.name}
                  </div>
                  <button
                    onClick={() => {
                      setIsEditingUsername(true)
                      setNewUsername(user?.name || '')
                      setUsernameError('')
                    }}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => {
                      setNewUsername(e.target.value)
                      setUsernameError('')
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter new username"
                  />
                  {usernameError && (
                    <p className="text-red-400 text-sm">{usernameError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleUsernameChange}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false)
                        setNewUsername('')
                        setUsernameError('')
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Email Section (Read-only) */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Email
              </label>
              <div className="bg-gray-700 rounded-lg px-4 py-3 text-white text-lg">
                {user?.email}
              </div>
              <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
            </div>

            {/* Password Section */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Password
              </label>
              {!isChangingPassword ? (
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-700 rounded-lg px-4 py-3 text-gray-500">
                    ••••••••••••
                  </div>
                  <button
                    onClick={() => {
                      setIsChangingPassword(true)
                      setOldPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                      setPasswordError('')
                      setPasswordStrength(null)
                      setShowSuggestedPassword(false)
                    }}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value)
                        setPasswordError('')
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-300 text-sm">
                        New Password
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
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        setPasswordError('')
                        if (e.target.value) {
                          setPasswordStrength(checkPasswordStrength(e.target.value))
                        } else {
                          setPasswordStrength(null)
                        }
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter new password"
                    />
                    {showSuggestedPassword && (
                      <div className="mt-2 p-3 bg-gray-700 rounded-lg border border-primary-500/50">
                        <p className="text-gray-300 text-sm mb-2">Suggested password:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-gray-800 px-3 py-2 rounded text-primary-400 text-sm">
                            {suggestedPassword}
                          </code>
                          <button
                            onClick={useSuggestedPassword}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded text-sm transition-colors"
                          >
                            Use
                          </button>
                          <button
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
                    <label className="block text-gray-300 text-sm mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setPasswordError('')
                      }}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Confirm new password"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {passwordError && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                      {passwordError}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={!passwordStrength?.isStrong || newPassword !== confirmPassword}
                      className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Save Password
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false)
                        setOldPassword('')
                        setNewPassword('')
                        setConfirmPassword('')
                        setPasswordError('')
                        setPasswordStrength(null)
                        setShowSuggestedPassword(false)
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
