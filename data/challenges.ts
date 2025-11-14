import { Challenge } from '@/types/challenge'

// Mock challenge data - in production, this would come from an API or database
export const challenges: Challenge[] = [
  // Web Challenges
  {
    id: 'web-1',
    title: 'Hidden Login',
    difficulty: 'Easy',
    points: 100,
    description: 'The admin left a vulnerable login page. Find a way to bypass it.',
    category: 'Web',
    flag: 'CTF{hidden_login_bypass_2025}',
    files: [
      { name: 'login.php', downloadUrl: '/files/login.php' },
    ],
    challengeLink: '/challenges/login/',
  },
  {
    id: 'web-1-old',
    title: 'SQL Injection Basics',
    difficulty: 'Easy',
    points: 100,
    description: 'Find the SQL injection vulnerability in the login form and extract the admin password.',
    category: 'Web',
    flag: 'CTF{sql_injection_basics_2025}',
  },
  {
    id: 'web-2',
    title: 'XSS Payload',
    difficulty: 'Medium',
    points: 250,
    description: 'Exploit the cross-site scripting vulnerability to steal cookies from the admin panel.',
    category: 'Web',
    flag: 'CTF{xss_payload_success_2025}',
  },
  {
    id: 'web-3',
    title: 'JWT Token Manipulation',
    difficulty: 'Hard',
    points: 500,
    description: 'Bypass authentication by manipulating JWT tokens and gain access to protected endpoints.',
    category: 'Web',
    flag: 'CTF{jwt_token_bypass_2025}',
  },
  // Cryptography Challenges
  {
    id: 'crypto-1',
    title: 'Caesar Cipher',
    difficulty: 'Easy',
    points: 100,
    description: 'Decode the message encrypted with a classic Caesar cipher. Find the shift value.',
    category: 'Cryptography',
    flag: 'CTF{caesar_cipher_solved_2025}',
  },
  {
    id: 'crypto-2',
    title: 'RSA Key Recovery',
    difficulty: 'Medium',
    points: 300,
    description: 'Recover the private key from the given public key and decrypt the flag.',
    category: 'Cryptography',
    flag: 'CTF{rsa_key_recovered_2025}',
  },
  {
    id: 'crypto-3',
    title: 'AES Encryption Break',
    difficulty: 'Hard',
    points: 600,
    description: 'Break the AES encryption using a side-channel attack or find the weak implementation.',
    category: 'Cryptography',
    flag: 'CTF{aes_encryption_broken_2025}',
  },
  // Forensics Challenges
  {
    id: 'forensics-1',
    title: 'Image Metadata',
    difficulty: 'Easy',
    points: 150,
    description: 'Extract the hidden flag from the image metadata. Check EXIF data carefully.',
    category: 'Forensics',
    flag: 'CTF{exif_metadata_flag_2025}',
  },
  {
    id: 'forensics-2',
    title: 'Network Packet Analysis',
    difficulty: 'Medium',
    points: 350,
    description: 'Analyze the captured network packets to find the exfiltrated data and recover the flag.',
    category: 'Forensics',
    flag: 'CTF{packet_analysis_success_2025}',
  },
  {
    id: 'forensics-3',
    title: 'Memory Dump Analysis',
    difficulty: 'Hard',
    points: 700,
    description: 'Analyze the memory dump to find the encryption key and decrypt the stolen files.',
    category: 'Forensics',
    flag: 'CTF{memory_dump_decrypted_2025}',
  },
  // Misc Challenges
  {
    id: 'misc-1',
    title: 'Steganography Basics',
    difficulty: 'Easy',
    points: 120,
    description: 'Find the hidden message in the image using steganography techniques.',
    category: 'Misc',
    flag: 'CTF{steganography_found_2025}',
  },
  {
    id: 'misc-2',
    title: 'Reverse Engineering',
    difficulty: 'Medium',
    points: 400,
    description: 'Reverse engineer the binary file to understand its logic and extract the flag.',
    category: 'Misc',
    flag: 'CTF{reverse_engineered_2025}',
  },
  {
    id: 'misc-3',
    title: 'OSINT Investigation',
    difficulty: 'Hard',
    points: 550,
    description: 'Use open-source intelligence to track down the target and find the hidden flag.',
    category: 'Misc',
    flag: 'CTF{osint_investigation_complete_2025}',
  },
]

// Initialize challenges in localStorage if not present
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('ctf_challenges')
  if (!stored) {
    localStorage.setItem('ctf_challenges', JSON.stringify(challenges))
  }
}

export function getChallengesByCategory(category: Challenge['category']): Challenge[] {
  return challenges.filter((challenge) => challenge.category === category)
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((challenge) => challenge.id === id)
}

