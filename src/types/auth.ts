export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  darkMode: boolean
  defaultTags: string[]
}

export interface AuthError {
  code: string
  message: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  displayName: string
}
