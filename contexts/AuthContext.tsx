'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  password: string // In production, this should be hashed
  totalPoints: number
  challengesSolved: number
  solvedChallenges: string[] // Array of challenge IDs that have been solved
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  submitFlag: (challengeId: string, flag: string, points: number) => Promise<boolean>
  isChallengeSolved: (challengeId: string) => boolean
  changeUsername: (newUsername: string) => Promise<boolean>
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('ctf_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        // Ensure backward compatibility
        if (!user.solvedChallenges) {
          user.solvedChallenges = []
        }
        setUser(user)
      } catch (e) {
        console.error('Error parsing stored user:', e)
        localStorage.removeItem('ctf_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get all users from localStorage
    const usersJson = localStorage.getItem('ctf_users')
    if (!usersJson) {
      return false
    }

    try {
      const users: User[] = JSON.parse(usersJson)
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      )

      if (foundUser) {
        // Ensure backward compatibility
        if (!foundUser.solvedChallenges) {
          foundUser.solvedChallenges = []
        }
        setUser(foundUser)
        localStorage.setItem('ctf_user', JSON.stringify(foundUser))
        return true
      }
      return false
    } catch (e) {
      console.error('Error during login:', e)
      return false
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Get existing users
    const usersJson = localStorage.getItem('ctf_users')
    const users: User[] = usersJson ? JSON.parse(usersJson) : []

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return false
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, hash this
      totalPoints: 0,
      challengesSolved: 0,
      solvedChallenges: [],
    }

    users.push(newUser)
    localStorage.setItem('ctf_users', JSON.stringify(users))
    setUser(newUser)
    localStorage.setItem('ctf_user', JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ctf_user')
  }

  const submitFlag = async (
    challengeId: string,
    flag: string,
    points: number
  ): Promise<boolean> => {
    if (!user) return false

    // Get the challenge flag from challenges data
    // In production, this would be an API call
    const challengesJson = localStorage.getItem('ctf_challenges')
    if (!challengesJson) return false

    try {
      const challenges = JSON.parse(challengesJson)
      const challenge = challenges.find((c: any) => c.id === challengeId)
      
      if (!challenge) return false
      
      // Normalize flag comparison (trim whitespace, case-insensitive)
      const submittedFlag = flag.trim()
      const correctFlag = challenge.flag.trim()
      
      if (submittedFlag !== correctFlag) {
        return false
      }

      // Check if already solved
      if (user.solvedChallenges.includes(challengeId)) {
        return true // Already solved, but return true
      }

      // Update user
      const updatedUser: User = {
        ...user,
        totalPoints: user.totalPoints + points,
        challengesSolved: user.challengesSolved + 1,
        solvedChallenges: [...user.solvedChallenges, challengeId],
      }

      // Update in localStorage
      const usersJson = localStorage.getItem('ctf_users')
      if (usersJson) {
        const users: User[] = JSON.parse(usersJson)
        const userIndex = users.findIndex((u) => u.id === user.id)
        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem('ctf_users', JSON.stringify(users))
        }
      }

      setUser(updatedUser)
      localStorage.setItem('ctf_user', JSON.stringify(updatedUser))
      return true
    } catch (e) {
      console.error('Error submitting flag:', e)
      return false
    }
  }

  const isChallengeSolved = (challengeId: string): boolean => {
    if (!user) return false
    return user.solvedChallenges.includes(challengeId)
  }

  const changeUsername = async (newUsername: string): Promise<boolean> => {
    if (!user || !newUsername.trim()) return false

    try {
      const usersJson = localStorage.getItem('ctf_users')
      if (!usersJson) return false

      const users: User[] = JSON.parse(usersJson)
      const userIndex = users.findIndex((u) => u.id === user.id)
      
      if (userIndex === -1) return false

      // Update username
      const updatedUser: User = {
        ...user,
        name: newUsername.trim(),
      }

      users[userIndex] = updatedUser
      localStorage.setItem('ctf_users', JSON.stringify(users))
      setUser(updatedUser)
      localStorage.setItem('ctf_user', JSON.stringify(updatedUser))
      
      return true
    } catch (e) {
      console.error('Error changing username:', e)
      return false
    }
  }

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Not logged in' }
    }

    // Verify old password
    if (user.password !== oldPassword) {
      return { success: false, error: 'Current password is incorrect' }
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters' }
    }

    try {
      const usersJson = localStorage.getItem('ctf_users')
      if (!usersJson) {
        return { success: false, error: 'User data not found' }
      }

      const users: User[] = JSON.parse(usersJson)
      const userIndex = users.findIndex((u) => u.id === user.id)
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' }
      }

      // Update password
      const updatedUser: User = {
        ...user,
        password: newPassword, // In production, hash this
      }

      users[userIndex] = updatedUser
      localStorage.setItem('ctf_users', JSON.stringify(users))
      setUser(updatedUser)
      localStorage.setItem('ctf_user', JSON.stringify(updatedUser))
      
      return { success: true }
    } catch (e) {
      console.error('Error changing password:', e)
      return { success: false, error: 'Failed to update password' }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        submitFlag,
        isChallengeSolved,
        changeUsername,
        changePassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

