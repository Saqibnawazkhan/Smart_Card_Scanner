import { Link, useNavigate } from 'react-router-dom'
import { useContacts } from '@/hooks'
import { ContactList, ContactFilters } from '@/components/contact'
import { Button } from '@/components/ui'
import type { SortOption } from '@/types'

export function ContactsPage() {
  const navigate = useNavigate()
  const {
    filteredContacts,
    isLoading,
    searchQuery,
    filter,
    sortBy,
    setSearchQuery,
    setFilter,
    setSortBy,
    removeContact,
  } = useContacts()

  const handleEdit = (contact: { id: string }) => {
    navigate(`/contacts/${contact.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contacts</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/scan">
          <Button>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Scan New
          </Button>
        </Link>
      </div>

      <ContactFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTags={filter.tags}
        onTagChange={(tags) => setFilter({ tags })}
        sortBy={sortBy}
        onSortChange={(sort) => setSortBy(sort as SortOption)}
      />

      <ContactList
        contacts={filteredContacts}
        onEdit={handleEdit}
        onDelete={removeContact}
        isLoading={isLoading}
      />
    </div>
  )
}
