import { useEffect } from 'react'
import { useAuthStore } from '@/store'
import {
  subscribeToAuthChanges,
  loginUser,
  registerUser,
  logoutUser,
  resetPassword,
  getUserProfile,
} from '@/services/firebase'
import type { LoginCredentials, RegisterCredentials } from '@/types'

export function useAuth() {
  const { user, profile, isLoading, isAuthenticated, error, setUser, setProfile, setError, logout } =
    useAuthStore()

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid)
          setProfile(userProfile)
        } catch (err) {
          console.error('Failed to fetch user profile:', err)
        }
      } else {
        setProfile(null)
      }
    })

    return () => unsubscribe()
  }, [setUser, setProfile])

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null)
      await loginUser(credentials)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null)
      await registerUser(credentials)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw err
    }
  }

  const signOut = async () => {
    try {
      await logoutUser()
      logout()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed'
      setError(message)
      throw err
    }
  }

  const sendPasswordReset = async (email: string) => {
    try {
      setError(null)
      await resetPassword(email)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed'
      setError(message)
      throw err
    }
  }

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    signOut,
    sendPasswordReset,
  }
}
