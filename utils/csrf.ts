/**
 * CSRF Protection Utility
 * Generates and validates CSRF tokens
 */

// Generate CSRF token
export function generateCSRFToken(): string {
  // In a real application, this should be stored server-side
  // For client-side, we'll use a combination of timestamp and random
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${random}`
}

// Store token in session storage
export function storeCSRFToken(token: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('csrf_token', token)
  }
}

// Get stored token
export function getCSRFToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('csrf_token')
  }
  return null
}

// Validate token
export function validateCSRFToken(token: string): boolean {
  const storedToken = getCSRFToken()
  return storedToken === token
}

// Generate and store new token
export function initCSRFToken(): string {
  const token = generateCSRFToken()
  storeCSRFToken(token)
  return token
}

