import { useState } from 'react'
import { ContactCard } from './ContactCard'
import { Modal, ModalActions, Button } from '@/components/ui'
import { downloadVCard } from '@/services/vcard'
import type { Contact, ContactTag } from '@/types'
import { TAG_LABELS, TAG_COLORS } from '@/types'
import { cn } from '@/utils'

interface ContactListProps {
  contacts: Contact[]
  onEdit?: (contact: Contact) => void
  onDelete?: (contactId: string) => void
  isLoading?: boolean
}

export function ContactList({ contacts, onEdit, onDelete, isLoading }: ContactListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<Contact | null>(null)

  const handleDelete = (contact: Contact) => {
    setDeleteConfirm(contact)
  }

  const confirmDelete = () => {
    if (deleteConfirm && onDelete) {
      onDelete(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border bg-white p-4 dark:bg-slate-800"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center dark:bg-slate-800">
        <svg
          className="mx-auto h-12 w-12 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No contacts yet</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Scan a business card to add your first contact
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={onEdit ? () => onEdit(contact) : undefined}
            onDelete={onDelete ? () => handleDelete(contact) : undefined}
            onDownloadVCard={() => downloadVCard(contact)}
          />
        ))}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Contact"
        description={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        size="sm"
      >
        <ModalActions>
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </ModalActions>
      </Modal>
    </>
  )
}

interface ContactFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTags: ContactTag[]
  onTagChange: (tags: ContactTag[]) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export function ContactFilters({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagChange,
  sortBy,
  onSortChange,
}: ContactFiltersProps) {
  const allTags: ContactTag[] = ['client', 'vendor', 'hr', 'personal', 'other']

  const toggleTag = (tag: ContactTag) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagChange([...selectedTags, tag])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:placeholder:text-slate-500"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800"
        >
          <option value="createdAt-desc">Newest first</option>
          <option value="createdAt-asc">Oldest first</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="company-asc">Company A-Z</option>
          <option value="company-desc">Company Z-A</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-all',
                isSelected
                  ? TAG_COLORS[tag]
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              )}
            >
              {TAG_LABELS[tag]}
            </button>
          )
        })}
        {selectedTags.length > 0 && (
          <button
            onClick={() => onTagChange([])}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
