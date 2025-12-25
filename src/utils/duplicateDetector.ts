import type { Contact, ContactFormData } from '@/types'

export interface DuplicateResult {
  isDuplicate: boolean
  matchedContact: Contact | null
  matchScore: number
  matchReasons: string[]
}

export function checkForDuplicates(
  newContact: Partial<ContactFormData>,
  existingContacts: Contact[]
): DuplicateResult {
  let highestScore = 0
  let matchedContact: Contact | null = null
  let matchReasons: string[] = []

  for (const existing of existingContacts) {
    let score = 0
    const reasons: string[] = []

    // Email match (highest confidence)
    if (newContact.email && existing.email) {
      if (normalizeEmail(newContact.email) === normalizeEmail(existing.email)) {
        score += 50
        reasons.push('Same email address')
      }
    }

    // Phone match (high confidence)
    if (newContact.phone && existing.phone) {
      if (normalizePhone(newContact.phone) === normalizePhone(existing.phone)) {
        score += 40
        reasons.push('Same phone number')
      }
    }

    // Name similarity
    if (newContact.name && existing.name) {
      const nameSimilarity = calculateSimilarity(
        normalizeName(newContact.name),
        normalizeName(existing.name)
      )
      if (nameSimilarity > 0.85) {
        score += Math.round(35 * nameSimilarity)
        reasons.push('Similar name')
      }
    }

    // Company match
    if (newContact.company && existing.company) {
      const companySimilarity = calculateSimilarity(
        normalizeCompany(newContact.company),
        normalizeCompany(existing.company)
      )
      if (companySimilarity > 0.8) {
        score += Math.round(15 * companySimilarity)
        reasons.push('Same company')
      }
    }

    if (score > highestScore) {
      highestScore = score
      matchedContact = existing
      matchReasons = [...reasons]
    }
  }

  return {
    isDuplicate: highestScore >= 50,
    matchedContact,
    matchScore: highestScore,
    matchReasons,
  }
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

function normalizePhone(phone: string): string {
  // Keep only last 10 digits
  return phone.replace(/\D/g, '').slice(-10)
}

function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ')
}

function normalizeCompany(company: string): string {
  return company
    .toLowerCase()
    .replace(/\b(inc\.?|corp\.?|llc|ltd\.?|limited|company|co\.?)\b/gi, '')
    .replace(/[.,]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1

  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1

  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}
