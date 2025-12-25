import { Modal, ModalActions, Button } from '@/components/ui'
import type { Contact } from '@/types'

interface DuplicateWarningProps {
  isOpen: boolean
  onClose: () => void
  existingContact: Contact | null
  matchReasons: string[]
  onSaveAnyway: () => void
  onViewExisting: () => void
}

export function DuplicateWarning({
  isOpen,
  onClose,
  existingContact,
  matchReasons,
  onSaveAnyway,
  onViewExisting,
}: DuplicateWarningProps) {
  if (!existingContact) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Possible Duplicate Detected"
      size="md"
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <div className="flex gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                This contact may already exist
              </p>
              <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                {matchReasons.map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Existing contact:
          </h4>
          <div className="mt-2">
            <p className="font-semibold text-slate-900 dark:text-white">
              {existingContact.name}
            </p>
            {existingContact.company && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {existingContact.company}
              </p>
            )}
            {existingContact.email && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {existingContact.email}
              </p>
            )}
            {existingContact.phone && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {existingContact.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      <ModalActions>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={onViewExisting}>
          View Existing
        </Button>
        <Button onClick={onSaveAnyway}>Save Anyway</Button>
      </ModalActions>
    </Modal>
  )
}
