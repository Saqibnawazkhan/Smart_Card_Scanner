import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { TAG_LABELS, TAG_COLORS, type Contact } from '@/types'
import { cn } from '@/utils'

interface ContactCardProps {
  contact: Contact
  onEdit?: () => void
  onDelete?: () => void
  onDownloadVCard?: () => void
}

export function ContactCard({ contact, onEdit, onDelete, onDownloadVCard }: ContactCardProps) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="group rounded-xl border bg-white p-4 transition-shadow hover:shadow-md dark:bg-slate-800">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
          {initials || '?'}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/contacts/${contact.id}`}
                className="font-semibold text-slate-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
              >
                {contact.name}
              </Link>
              {contact.company && (
                <p className="text-sm text-slate-500 dark:text-slate-400">{contact.company}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {onDownloadVCard && (
                <Button variant="ghost" size="sm" onClick={onDownloadVCard} title="Download vCard">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </Button>
              )}
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit} title="Edit">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={onDelete} title="Delete">
                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              )}
            </div>
          </div>

          {/* Contact info */}
          <div className="mt-2 space-y-1">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {contact.email}
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {contact.phone}
              </a>
            )}
          </div>

          {/* Tags */}
          {contact.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn('rounded-full px-2 py-0.5 text-xs font-medium', TAG_COLORS[tag])}
                >
                  {TAG_LABELS[tag]}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
