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
  flag: string // The correct flag for validation
  files?: ChallengeFile[] // Optional files to download
  challengeLink?: string // Optional link to challenge instance
}

