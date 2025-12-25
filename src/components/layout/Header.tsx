import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { ThemeToggle, Button } from '@/components/ui'
import { cn } from '@/utils'

export function Header() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Scan', href: '/scan' },
    { name: 'Contacts', href: '/contacts' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-lg dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <svg
                className="h-5 w-5 text-white"
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
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">CardScan</span>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex md:gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-slate-600 dark:text-slate-400 sm:block">
                  {user.displayName || user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {user && (
        <nav className="flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex-shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                location.pathname === item.href
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
