import { useCallback, useEffect } from 'react'
import { useContactStore, useAuthStore, useUIStore } from '@/store'
import {
  getAllContacts,
  createContact,
  updateContact as updateContactService,
  deleteContact as deleteContactService,
} from '@/services/firebase'
import { checkForDuplicates } from '@/utils'
import type { Contact, ContactFormData, FieldConfidence } from '@/types'

export function useContacts() {
  const { user } = useAuthStore()
  const {
    contacts,
    selectedContact,
    filter,
    sortBy,
    searchQuery,
    isLoading,
    error,
    setContacts,
    addContact,
    updateContact,
    deleteContact,
    selectContact,
    setFilter,
    setSortBy,
    setSearchQuery,
    setLoading,
    setError,
    clearContacts,
    getFilteredContacts,
  } = useContactStore()
  const { addToast } = useUIStore()

  // Load contacts when user is authenticated
  useEffect(() => {
    if (user) {
      loadContacts()
    } else {
      clearContacts()
    }
  }, [user])

  const loadContacts = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const fetchedContacts = await getAllContacts(user.uid)
      setContacts(fetchedContacts)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load contacts'
      setError(message)
      addToast({ type: 'error', title: 'Error', message })
    }
  }, [user, setContacts, setLoading, setError, addToast])

  const saveContact = useCallback(
    async (
      formData: ContactFormData,
      ocrConfidence: FieldConfidence,
      scanSource: Contact['scanSource']
    ): Promise<string | null> => {
      if (!user) {
        addToast({ type: 'error', title: 'Error', message: 'You must be logged in' })
        return null
      }

      // Check for duplicates
      const duplicateCheck = checkForDuplicates(formData, contacts)
      if (duplicateCheck.isDuplicate) {
        // Return the duplicate info - component should handle the warning
        throw {
          type: 'duplicate',
          contact: duplicateCheck.matchedContact,
          reasons: duplicateCheck.matchReasons,
        }
      }

      try {
        const contactId = await createContact(user.uid, formData, ocrConfidence, scanSource)

        const newContact: Contact = {
          id: contactId,
          userId: user.uid,
          ...formData,
          ocrConfidence,
          scanSource,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        addContact(newContact)
        addToast({ type: 'success', title: 'Contact saved successfully' })

        return contactId
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save contact'
        setError(message)
        addToast({ type: 'error', title: 'Error', message })
        return null
      }
    },
    [user, contacts, addContact, setError, addToast]
  )

  const editContact = useCallback(
    async (contactId: string, updates: Partial<ContactFormData>): Promise<boolean> => {
      if (!user) return false

      try {
        await updateContactService(user.uid, contactId, updates)
        updateContact(contactId, { ...updates, updatedAt: new Date() })
        addToast({ type: 'success', title: 'Contact updated' })
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update contact'
        setError(message)
        addToast({ type: 'error', title: 'Error', message })
        return false
      }
    },
    [user, updateContact, setError, addToast]
  )

  const removeContact = useCallback(
    async (contactId: string): Promise<boolean> => {
      if (!user) return false

      try {
        await deleteContactService(user.uid, contactId)
        deleteContact(contactId)
        addToast({ type: 'success', title: 'Contact deleted' })
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete contact'
        setError(message)
        addToast({ type: 'error', title: 'Error', message })
        return false
      }
    },
    [user, deleteContact, setError, addToast]
  )

  return {
    contacts,
    filteredContacts: getFilteredContacts(),
    selectedContact,
    filter,
    sortBy,
    searchQuery,
    isLoading,
    error,
    loadContacts,
    saveContact,
    editContact,
    removeContact,
    selectContact,
    setFilter,
    setSortBy,
    setSearchQuery,
  }
}
