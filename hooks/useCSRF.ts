import { useState, useEffect } from 'react'

export function useCSRF() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCSRFToken()
  }, [])

  const fetchCSRFToken = async () => {
    try {
      const response = await fetch('/api/csrf.php')
      const data = await response.json()
      setCsrfToken(data.token)
    } catch (error) {
      console.error('Error fetching CSRF token:', error)
      // Fallback: generate client-side token for development
      const fallbackToken = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      setCsrfToken(fallbackToken)
    } finally {
      setIsLoading(false)
    }
  }

  return { csrfToken, isLoading, refreshToken: fetchCSRFToken }
}

