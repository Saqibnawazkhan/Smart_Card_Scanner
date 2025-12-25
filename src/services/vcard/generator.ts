import type { Contact } from '@/types'

export function generateVCard(contact: Contact): string {
  const lines: string[] = []

  lines.push('BEGIN:VCARD')
  lines.push('VERSION:3.0')

  // Parse name into parts
  const nameParts = contact.name.split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  // Full name
  lines.push(`FN:${contact.name}`)

  // Structured name (Last;First;Middle;Prefix;Suffix)
  lines.push(`N:${lastName};${firstName};;;`)

  // Organization
  if (contact.company) {
    lines.push(`ORG:${escapeVCardValue(contact.company)}`)
  }

  // Phone
  if (contact.phone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${contact.phone}`)
  }

  // Email
  if (contact.email) {
    lines.push(`EMAIL;TYPE=WORK,INTERNET:${contact.email}`)
  }

  // Website
  if (contact.website) {
    lines.push(`URL:${contact.website}`)
  }

  // Address
  if (contact.address) {
    // ADR format: PO Box;Extended Address;Street;City;State;Postal Code;Country
    lines.push(`ADR;TYPE=WORK:;;${escapeVCardValue(contact.address)};;;;`)
  }

  // Notes
  if (contact.notes) {
    lines.push(`NOTE:${escapeVCardValue(contact.notes)}`)
  }

  // Categories (tags)
  if (contact.tags.length > 0) {
    lines.push(`CATEGORIES:${contact.tags.join(',')}`)
  }

  // Revision timestamp
  lines.push(`REV:${new Date().toISOString()}`)

  lines.push('END:VCARD')

  return lines.join('\r\n')
}

function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

export function downloadVCard(contact: Contact): void {
  const vCardString = generateVCard(contact)
  const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFilename(contact.name)}.vcf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 50) || 'contact'
}

export function downloadMultipleVCards(contacts: Contact[]): void {
  const vCards = contacts.map(generateVCard).join('\r\n')
  const blob = new Blob([vCards], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `contacts_${new Date().toISOString().split('T')[0]}.vcf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
