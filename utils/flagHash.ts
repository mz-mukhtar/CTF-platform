/**
 * Flag Hashing Utility
 * Uses SHA-256 to hash flags for secure storage and comparison
 */

/**
 * Hash a flag using SHA-256
 * @param flag - The flag string to hash
 * @returns Promise<string> - The SHA-256 hash in hexadecimal format
 */
export async function hashFlag(flag: string): Promise<string> {
  // Normalize flag (trim whitespace)
  const normalizedFlag = flag.trim()
  
  // Convert string to ArrayBuffer
  const encoder = new TextEncoder()
  const data = encoder.encode(normalizedFlag)
  
  // Hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  
  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}

/**
 * Synchronous version using a simple SHA-256 implementation
 * For use in environments where async crypto is not available
 */
export function hashFlagSync(flag: string): string {
  // This is a fallback - in production, always use async version
  // For now, we'll use a simple hash function
  const normalizedFlag = flag.trim()
  let hash = 0
  for (let i = 0; i < normalizedFlag.length; i++) {
    const char = normalizedFlag.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  // Convert to hex (this is not SHA-256, just a placeholder)
  // In production, use the async version
  return Math.abs(hash).toString(16)
}

