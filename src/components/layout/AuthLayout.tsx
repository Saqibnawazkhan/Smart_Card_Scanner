import { Link, Outlet } from 'react-router-dom'
import { ThemeToggle, ToastContainer } from '@/components/ui'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
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
        <ThemeToggle />
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} CardScan. All rights reserved.
      </footer>

      <ToastContainer />
    </div>
  )
}
