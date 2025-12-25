import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import { MainLayout, AuthLayout } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth'
import { LoadingOverlay } from '@/components/ui'
import {
  HomePage,
  ScanPage,
  ContactsPage,
  ContactDetailPage,
  LoginPage,
  RegisterPage,
} from '@/pages'

function AppRoutes() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <LoadingOverlay message="Loading..." />
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
        />
      </Route>

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/contacts/:id" element={<ContactDetailPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
