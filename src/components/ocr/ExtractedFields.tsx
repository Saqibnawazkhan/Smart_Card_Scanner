import { ConfidenceIndicator } from '@/components/ui'
import type { ExtractedContact } from '@/types'

interface ExtractedFieldsProps {
  data: ExtractedContact
  onChange: (field: keyof ExtractedContact, value: string) => void
  disabled?: boolean
}

const fieldLabels: Record<keyof ExtractedContact, string> = {
  name: 'Full Name',
  company: 'Company',
  phone: 'Phone Number',
  email: 'Email Address',
  address: 'Address',
  website: 'Website',
}

const fieldIcons: Record<keyof ExtractedContact, React.ReactNode> = {
  name: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  company: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  phone: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  email: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  address: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  website: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
}

export function ExtractedFields({ data, onChange, disabled }: ExtractedFieldsProps) {
  const fields: (keyof ExtractedContact)[] = ['name', 'company', 'phone', 'email', 'address', 'website']

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field} className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 dark:text-slate-500">{fieldIcons[field]}</span>
              {fieldLabels[field]}
            </label>
            {data[field].confidence > 0 && (
              <ConfidenceIndicator
                confidence={data[field].confidence}
                size="sm"
                className="w-24"
              />
            )}
          </div>
          <input
            type={field === 'email' ? 'email' : field === 'website' ? 'url' : 'text'}
            value={data[field].value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
            disabled={disabled}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:ring-offset-slate-900 dark:placeholder:text-slate-500"
          />
        </div>
      ))}
    </div>
  )
}
