import { create } from 'zustand'
import type { Contact, ContactFilter, SortOption } from '@/types'

interface ContactState {
  contacts: Contact[]
  selectedContact: Contact | null
  filter: ContactFilter
  sortBy: SortOption
  searchQuery: string
  isLoading: boolean
  error: string | null

  // Actions
  setContacts: (contacts: Contact[]) => void
  addContact: (contact: Contact) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void
  selectContact: (contact: Contact | null) => void
  setFilter: (filter: Partial<ContactFilter>) => void
  setSortBy: (sortBy: SortOption) => void
  setSearchQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearContacts: () => void

  // Computed
  getFilteredContacts: () => Contact[]
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  selectedContact: null,
  filter: { tags: [] },
  sortBy: 'createdAt-desc',
  searchQuery: '',
  isLoading: false,
  error: null,

  setContacts: (contacts) => set({ contacts, isLoading: false }),

  addContact: (contact) =>
    set((state) => ({
      contacts: [contact, ...state.contacts],
    })),

  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      selectedContact:
        state.selectedContact?.id === id
          ? { ...state.selectedContact, ...updates }
          : state.selectedContact,
    })),

  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
      selectedContact: state.selectedContact?.id === id ? null : state.selectedContact,
    })),

  selectContact: (contact) => set({ selectedContact: contact }),

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),

  setSortBy: (sortBy) => set({ sortBy }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  clearContacts: () =>
    set({
      contacts: [],
      selectedContact: null,
      searchQuery: '',
      filter: { tags: [] },
    }),

  getFilteredContacts: () => {
    const { contacts, filter, sortBy, searchQuery } = get()
    let filtered = [...contacts]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.company.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query)
      )
    }

    // Apply tag filter
    if (filter.tags.length > 0) {
      filtered = filtered.filter((c) => c.tags.some((t) => filter.tags.includes(t)))
    }

    // Apply sorting
    const [field, direction] = sortBy.split('-') as [keyof Contact, 'asc' | 'desc']
    filtered.sort((a, b) => {
      let aVal: string | Date = a[field] as string | Date
      let bVal: string | Date = b[field] as string | Date

      if (field === 'createdAt' || field === 'updatedAt') {
        aVal = new Date(aVal).getTime().toString()
        bVal = new Date(bVal).getTime().toString()
      }

      const comparison = String(aVal).localeCompare(String(bVal))
      return direction === 'asc' ? comparison : -comparison
    })

    return filtered
  },
}))
