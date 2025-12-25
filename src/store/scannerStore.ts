import { create } from 'zustand'
import type { ExtractedContact, ScannerStep } from '@/types'
import type { Contact } from '@/types'

interface ScannerState {
  step: ScannerStep
  imageData: string | null
  extractedData: ExtractedContact | null
  rawOCRText: string
  isProcessing: boolean
  error: string | null
  duplicateWarning: Contact | null
  scanSource: 'camera' | 'upload'

  // Actions
  setImage: (imageData: string, source: 'camera' | 'upload') => void
  setExtractedData: (data: ExtractedContact) => void
  setRawText: (text: string) => void
  setStep: (step: ScannerStep) => void
  setProcessing: (isProcessing: boolean) => void
  setError: (error: string | null) => void
  setDuplicateWarning: (contact: Contact | null) => void
  updateExtractedField: (field: keyof ExtractedContact, value: string) => void
  reset: () => void
}

const initialState = {
  step: 'idle' as ScannerStep,
  imageData: null,
  extractedData: null,
  rawOCRText: '',
  isProcessing: false,
  error: null,
  duplicateWarning: null,
  scanSource: 'upload' as const,
}

export const useScannerStore = create<ScannerState>((set) => ({
  ...initialState,

  setImage: (imageData, source) =>
    set({
      imageData,
      scanSource: source,
      step: 'processing',
      error: null,
    }),

  setExtractedData: (extractedData) =>
    set({
      extractedData,
      step: 'review',
      isProcessing: false,
    }),

  setRawText: (rawOCRText) => set({ rawOCRText }),

  setStep: (step) => set({ step }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setError: (error) =>
    set({
      error,
      step: error ? 'idle' : 'review',
      isProcessing: false,
    }),

  setDuplicateWarning: (duplicateWarning) => set({ duplicateWarning }),

  updateExtractedField: (field, value) =>
    set((state) => {
      if (!state.extractedData) return state
      return {
        extractedData: {
          ...state.extractedData,
          [field]: {
            ...state.extractedData[field],
            value,
          },
        },
      }
    }),

  reset: () => set(initialState),
}))
