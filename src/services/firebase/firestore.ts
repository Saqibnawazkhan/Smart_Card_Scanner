import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import type { Contact, ContactFormData, FieldConfidence } from '@/types'

const getContactsCollection = (userId: string) => collection(db, 'users', userId, 'contacts')

export async function createContact(
  userId: string,
  formData: ContactFormData,
  ocrConfidence: FieldConfidence,
  scanSource: Contact['scanSource'],
  originalImageUrl?: string
): Promise<string> {
  const contactsRef = getContactsCollection(userId)

  const docRef = await addDoc(contactsRef, {
    ...formData,
    userId,
    ocrConfidence,
    scanSource,
    originalImageUrl: originalImageUrl || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function updateContact(
  userId: string,
  contactId: string,
  updates: Partial<ContactFormData>
): Promise<void> {
  const contactRef = doc(db, 'users', userId, 'contacts', contactId)

  await updateDoc(contactRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteContact(userId: string, contactId: string): Promise<void> {
  const contactRef = doc(db, 'users', userId, 'contacts', contactId)
  await deleteDoc(contactRef)
}

export async function getContact(userId: string, contactId: string): Promise<Contact | null> {
  const contactRef = doc(db, 'users', userId, 'contacts', contactId)
  const docSnap = await getDoc(contactRef)

  if (docSnap.exists()) {
    return transformContact(docSnap.id, docSnap.data())
  }

  return null
}

export async function getAllContacts(userId: string): Promise<Contact[]> {
  const contactsRef = getContactsCollection(userId)
  const q = query(contactsRef, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => transformContact(doc.id, doc.data()))
}

export async function getContactsByTag(userId: string, tag: string): Promise<Contact[]> {
  const contactsRef = getContactsCollection(userId)
  const q = query(contactsRef, where('tags', 'array-contains', tag), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => transformContact(doc.id, doc.data()))
}

export async function searchContacts(userId: string, searchTerm: string): Promise<Contact[]> {
  // Firestore doesn't support full-text search, so we fetch all and filter client-side
  // For production, consider using Algolia or ElasticSearch
  const allContacts = await getAllContacts(userId)
  const term = searchTerm.toLowerCase()

  return allContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(term) ||
      contact.company.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.phone.includes(term)
  )
}

function transformContact(id: string, data: Record<string, unknown>): Contact {
  return {
    id,
    userId: data.userId as string,
    name: data.name as string || '',
    company: data.company as string || '',
    phone: data.phone as string || '',
    email: data.email as string || '',
    address: data.address as string || '',
    website: data.website as string || '',
    tags: data.tags as Contact['tags'] || [],
    notes: data.notes as string || '',
    originalImageUrl: data.originalImageUrl as string | undefined,
    ocrConfidence: data.ocrConfidence as FieldConfidence || {
      name: 0,
      company: 0,
      phone: 0,
      email: 0,
      address: 0,
      website: 0,
    },
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    scanSource: data.scanSource as Contact['scanSource'] || 'manual',
  }
}
