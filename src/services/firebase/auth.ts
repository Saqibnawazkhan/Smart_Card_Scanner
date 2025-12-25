import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'
import type { LoginCredentials, RegisterCredentials, UserProfile, UserPreferences } from '@/types'

export async function registerUser(credentials: RegisterCredentials): Promise<User> {
  const { email, password, displayName } = credentials

  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Update display name
  await updateProfile(user, { displayName })

  // Create user document in Firestore
  const userProfile: Omit<UserProfile, 'uid'> = {
    email: user.email,
    displayName,
    photoURL: null,
    createdAt: new Date(),
    preferences: {
      darkMode: false,
      defaultTags: [],
    },
  }

  await setDoc(doc(db, 'users', user.uid), {
    ...userProfile,
    createdAt: serverTimestamp(),
  })

  return user
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const { email, password } = credentials
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export async function logoutUser(): Promise<void> {
  await signOut(auth)
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data()
    return {
      uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      createdAt: data.createdAt?.toDate() || new Date(),
      preferences: data.preferences || { darkMode: false, defaultTags: [] },
    }
  }

  return null
}

export async function updateUserPreferences(
  uid: string,
  preferences: Partial<UserPreferences>
): Promise<void> {
  const docRef = doc(db, 'users', uid)
  await setDoc(docRef, { preferences }, { merge: true })
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}
