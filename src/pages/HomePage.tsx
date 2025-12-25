import { Link } from 'react-router-dom'
import { useAuth, useContacts } from '@/hooks'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { ContactCard } from '@/components/contact'
import { downloadVCard } from '@/services/vcard'

export function HomePage() {
  const { user } = useAuth()
  const { contacts, isLoading } = useContacts()

  const recentContacts = contacts.slice(0, 5)
  const stats = {
    total: contacts.length,
    thisMonth: contacts.filter((c) => {
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)
      return new Date(c.createdAt) >= thisMonth
    }).length,
    byTag: {
      client: contacts.filter((c) => c.tags.includes('client')).length,
      vendor: contacts.filter((c) => c.tags.includes('vendor')).length,
    },
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.displayName || 'there'}!
        </h1>
        <p className="mt-2 text-primary-100">
          Scan business cards and manage your professional contacts
        </p>
        <Link to="/scan">
          <Button variant="secondary" className="mt-4 bg-white text-primary-700 hover:bg-primary-50">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Scan Business Card
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary-100 p-3 dark:bg-primary-900/50">
                <svg
                  className="h-6 w-6 text-primary-600 dark:text-primary-400"
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
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Contacts</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/50">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">This Month</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Clients</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.byTag.client}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/50">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Vendors</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.byTag.vendor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent contacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Contacts</CardTitle>
          <Link to="/contacts">
            <Button variant="ghost" size="sm">
              View all
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border bg-slate-50 p-4 dark:bg-slate-800">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentContacts.length > 0 ? (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onDownloadVCard={() => downloadVCard(contact)}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <p className="mt-4 text-slate-500 dark:text-slate-400">No contacts yet</p>
              <Link to="/scan">
                <Button className="mt-4">Scan Your First Card</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
