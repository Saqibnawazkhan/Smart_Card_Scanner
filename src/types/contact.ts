export type ContactTag = 'client' | 'vendor' | 'hr' | 'personal' | 'other'

export interface FieldConfidence {
  name: number
  company: number
  phone: number
  email: number
  address: number
  website: number
}

export interface Contact {
  id: string
  userId: string
  name: string
  company: string
  phone: string
  email: string
  address: string
  website: string
  tags: ContactTag[]
  notes: string
  originalImageUrl?: string
  ocrConfidence: FieldConfidence
  createdAt: Date
  updatedAt: Date
  scanSource: 'camera' | 'upload' | 'manual'
}

export interface ContactFilter {
  tags: ContactTag[]
  searchQuery?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'company-asc'
  | 'company-desc'
  | 'createdAt-asc'
  | 'createdAt-desc'

export interface ContactFormData {
  name: string
  company: string
  phone: string
  email: string
  address: string
  website: string
  tags: ContactTag[]
  notes: string
}

export const TAG_LABELS: Record<ContactTag, string> = {
  client: 'Client',
  vendor: 'Vendor',
  hr: 'HR',
  personal: 'Personal',
  other: 'Other',
}

export const TAG_COLORS: Record<ContactTag, string> = {
  client: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  vendor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  hr: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  personal: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}
