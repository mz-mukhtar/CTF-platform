export interface PasswordStrength {
  score: number // 0-4 (0=weak, 4=very strong)
  feedback: string[]
  isStrong: boolean
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long')
  } else {
    score++
    if (password.length >= 12) {
      score++
    }
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters')
  } else {
    score++
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters')
  } else {
    score++
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    feedback.push('Add numbers')
  } else {
    score++
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Add special characters (!@#$%^&*)')
  } else {
    score++
  }

  // Cap score at 4
  score = Math.min(score, 4)

  return {
    score,
    feedback: feedback.length > 0 ? feedback : ['Password is strong!'],
    isStrong: score >= 3 && password.length >= 8,
  }
}

export function generateStrongPassword(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const all = lowercase + uppercase + numbers + special

  let password = ''
  
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]

  // Fill the rest randomly
  for (let i = password.length; i < 16; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

