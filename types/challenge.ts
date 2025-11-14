export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard'
export type ChallengeCategory = 'Web' | 'Cryptography' | 'Forensics' | 'Misc'

export interface ChallengeFile {
  name: string
  downloadUrl?: string
  path?: string
}

export interface Challenge {
  id: string
  title: string
  difficulty: ChallengeDifficulty
  points: number
  description: string
  category: ChallengeCategory
  flag_hash?: string // SHA-256 hash of the flag (for database)
  flag?: string // Plaintext flag (only used in admin panel, never stored in DB)
  files?: ChallengeFile[] // Optional files to download
  challengeLink?: string // Optional link to challenge instance
}

