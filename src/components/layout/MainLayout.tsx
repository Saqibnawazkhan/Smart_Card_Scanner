import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { ToastContainer } from '@/components/ui'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}
