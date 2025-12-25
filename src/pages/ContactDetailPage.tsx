import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useContacts } from '@/hooks'
import { ContactForm } from '@/components/contact'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Modal, ModalActions } from '@/components/ui'
import { downloadVCard } from '@/services/vcard'
import { TAG_LABELS, TAG_COLORS, type Contact, type ContactFormData, type FieldConfidence } from '@/types'
import { cn } from '@/utils'

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { filteredContacts, editContact, removeContact } = useContacts()

  const [contact, setContact] = useState<Contact | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const found = filteredContacts.find((c) => c.id === id) || null
    setContact(found)
  }, [id, filteredContacts])

  const handleEdit = async (formData: ContactFormData, _confidence: FieldConfidence) => {
    if (!contact) return

    setIsSubmitting(true)
    try {
      const success = await editContact(contact.id, formData)
      if (success) {
        setIsEditing(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!contact) return

    const success = await removeContact(contact.id)
    if (success) {
      navigate('/contacts')
    }
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white">Contact not found</h2>
        <Link to="/contacts" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          Back to contacts
        </Link>
      </div>
    )
  }

  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Contact</h1>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <ContactForm
              initialData={{
                name: contact.name,
                company: contact.company,
                phone: contact.phone,
                email: contact.email,
                address: contact.address,
                website: contact.website,
                tags: contact.tags,
                notes: contact.notes,
              }}
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              isSubmitting={isSubmitting}
              submitLabel="Save Changes"
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/contacts"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to contacts
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => downloadVCard(contact)}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download vCard
          </Button>
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
              {initials || '?'}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{contact.name}</h1>
              {contact.company && (
                <p className="text-lg text-slate-600 dark:text-slate-400">{contact.company}</p>
              )}

              {/* Tags */}
              {contact.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn('rounded-full px-3 py-1 text-sm font-medium', TAG_COLORS[tag])}
                    >
                      {TAG_LABELS[tag]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contact.email && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <a href={`mailto:${contact.email}`} className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    {contact.email}
                  </a>
                </div>
              </div>
            )}

            {contact.phone && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                  <a href={`tel:${contact.phone}`} className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            {contact.website && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Website</p>
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    {contact.website}
                  </a>
                </div>
              </div>
            )}

            {contact.address && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Address</p>
                  <p className="font-medium text-slate-900 dark:text-white">{contact.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes & Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Notes & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contact.notes ? (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Notes</p>
                <p className="mt-1 whitespace-pre-wrap text-slate-900 dark:text-white">{contact.notes}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">No notes added</p>
            )}

            <hr className="dark:border-slate-700" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Source</span>
                <Badge variant="default">
                  {contact.scanSource === 'camera' ? 'Camera' : contact.scanSource === 'upload' ? 'Upload' : 'Manual'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Created</span>
                <span className="text-slate-900 dark:text-white">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Updated</span>
                <span className="text-slate-900 dark:text-white">
                  {new Date(contact.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact"
        description={`Are you sure you want to delete ${contact.name}? This action cannot be undone.`}
        size="sm"
      >
        <ModalActions>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </ModalActions>
      </Modal>
    </div>
  )
}
