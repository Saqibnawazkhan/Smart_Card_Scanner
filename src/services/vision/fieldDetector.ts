import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js'
import type { ExtractedContact, ExtractedField } from '@/types'

// Regular expression patterns for field detection
const PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}/g,
  website: /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}(?:\/\S*)?/gi,
  companyKeywords: /(?:inc\.?|corp\.?|llc|ltd\.?|limited|company|co\.|group|solutions|technologies|services|consulting|enterprises?|international|global)/i,
  titleKeywords: /(?:ceo|cto|cfo|coo|president|director|manager|vp|vice\s*president|founder|partner|associate|analyst|engineer|developer|consultant|executive|officer|head\s+of|chief)/i,
  addressKeywords: /(?:street|st\.|avenue|ave\.|road|rd\.|boulevard|blvd\.|drive|dr\.|lane|ln\.|way|court|ct\.|suite|ste\.|floor|building|bldg)/i,
}

// Country codes for phone number detection
const COUNTRY_CODES: CountryCode[] = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IN', 'JP', 'CN', 'BR']

export function extractContactFields(rawText: string): ExtractedContact {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean)

  // Extract email (highest confidence)
  const email = extractEmail(rawText)

  // Extract phone numbers
  const phone = extractPhone(rawText)

  // Extract website
  const website = extractWebsite(rawText, email.value)

  // Extract address
  const address = extractAddress(lines)

  // Extract name (usually first line without patterns)
  const name = extractName(lines, email.value, phone.value)

  // Extract company
  const company = extractCompany(lines, name.value)

  return {
    name,
    company,
    phone,
    email,
    address,
    website,
  }
}

function extractEmail(text: string): ExtractedField {
  const matches = text.match(PATTERNS.email) || []
  const validEmails = matches.filter((email) => {
    // Basic validation
    const parts = email.split('@')
    return parts.length === 2 && parts[0].length > 0 && parts[1].includes('.')
  })

  if (validEmails.length > 0) {
    return {
      value: validEmails[0].toLowerCase(),
      confidence: 0.98,
      rawText: validEmails[0],
    }
  }

  return { value: '', confidence: 0 }
}

function extractPhone(text: string): ExtractedField {
  const matches = text.match(PATTERNS.phone) || []

  for (const match of matches) {
    // Try to parse with different country codes
    for (const countryCode of COUNTRY_CODES) {
      try {
        if (isValidPhoneNumber(match, countryCode)) {
          const parsed = parsePhoneNumber(match, countryCode)
          return {
            value: parsed.formatInternational(),
            confidence: 0.95,
            rawText: match,
          }
        }
      } catch {
        // Continue trying other formats
      }
    }

    // Fallback: if digits count seems valid
    const digits = match.replace(/\D/g, '')
    if (digits.length >= 10 && digits.length <= 15) {
      return {
        value: match.trim(),
        confidence: 0.75,
        rawText: match,
      }
    }
  }

  return { value: '', confidence: 0 }
}

function extractWebsite(text: string, excludeEmail: string): ExtractedField {
  const matches = text.match(PATTERNS.website) || []

  const validWebsites = matches.filter((url) => {
    // Exclude email domains
    if (excludeEmail && url.includes(excludeEmail.split('@')[1])) {
      return false
    }
    // Must not contain @ (email)
    if (url.includes('@')) {
      return false
    }
    // Must have valid TLD
    const parts = url.split('.')
    const tld = parts[parts.length - 1].toLowerCase().replace(/\/.*$/, '')
    return tld.length >= 2 && tld.length <= 6
  })

  if (validWebsites.length > 0) {
    let website = validWebsites[0]
    // Add https if no protocol
    if (!website.startsWith('http')) {
      website = 'https://' + website
    }
    return {
      value: website.toLowerCase(),
      confidence: 0.9,
      rawText: validWebsites[0],
    }
  }

  return { value: '', confidence: 0 }
}

function extractAddress(lines: string[]): ExtractedField {
  // Look for lines that contain address keywords
  const addressLines: string[] = []

  for (const line of lines) {
    if (PATTERNS.addressKeywords.test(line)) {
      addressLines.push(line)
    }
    // Also check for postal/zip codes
    else if (/\b\d{5}(-\d{4})?\b/.test(line) || /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}\b/i.test(line)) {
      addressLines.push(line)
    }
    // Check for city, state patterns
    else if (/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(line)) {
      addressLines.push(line)
    }
  }

  if (addressLines.length > 0) {
    return {
      value: addressLines.join(', '),
      confidence: 0.7,
      rawText: addressLines.join('\n'),
    }
  }

  return { value: '', confidence: 0 }
}

function extractName(lines: string[], email: string, phone: string): ExtractedField {
  // Name is usually the first line that doesn't match other patterns
  for (const line of lines.slice(0, 5)) {
    // Skip if matches other patterns
    if (PATTERNS.email.test(line)) continue
    if (PATTERNS.website.test(line)) continue
    if (phone && line.includes(phone.replace(/\D/g, '').slice(0, 6))) continue
    if (PATTERNS.companyKeywords.test(line)) continue
    if (PATTERNS.addressKeywords.test(line)) continue

    // Skip if it's a job title only
    if (PATTERNS.titleKeywords.test(line) && line.split(/\s+/).length <= 3) continue

    // Name should be 2-4 words, mostly letters
    const words = line.split(/\s+/)
    if (words.length >= 1 && words.length <= 5) {
      const letterRatio = line.replace(/[^a-zA-Z\s]/g, '').length / line.length
      if (letterRatio > 0.8) {
        return {
          value: line,
          confidence: 0.8,
          rawText: line,
        }
      }
    }
  }

  // Try extracting from email prefix
  if (email) {
    const prefix = email.split('@')[0]
    const nameParts = prefix.split(/[._-]/).filter((p) => p.length > 1)
    if (nameParts.length >= 2) {
      const name = nameParts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ')
      return {
        value: name,
        confidence: 0.5,
        rawText: email,
      }
    }
  }

  return { value: '', confidence: 0 }
}

function extractCompany(lines: string[], excludeName: string): ExtractedField {
  // Look for lines with company keywords
  for (const line of lines) {
    if (line === excludeName) continue

    if (PATTERNS.companyKeywords.test(line)) {
      return {
        value: line,
        confidence: 0.85,
        rawText: line,
      }
    }
  }

  // Try the second or third line (often company is right after name)
  for (const line of lines.slice(1, 4)) {
    if (line === excludeName) continue
    if (PATTERNS.email.test(line)) continue
    if (PATTERNS.website.test(line)) continue
    if (PATTERNS.titleKeywords.test(line)) continue

    // Company names often have mixed case and are relatively short
    const words = line.split(/\s+/)
    if (words.length >= 1 && words.length <= 6) {
      const hasUppercase = /[A-Z]/.test(line)
      if (hasUppercase) {
        return {
          value: line,
          confidence: 0.6,
          rawText: line,
        }
      }
    }
  }

  return { value: '', confidence: 0 }
}

export function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.5) return 'medium'
  return 'low'
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-green-600 dark:text-green-400'
  if (confidence >= 0.5) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

export function getConfidenceBgColor(confidence: number): string {
  if (confidence >= 0.8) return 'bg-green-100 dark:bg-green-900/30'
  if (confidence >= 0.5) return 'bg-yellow-100 dark:bg-yellow-900/30'
  return 'bg-red-100 dark:bg-red-900/30'
}
