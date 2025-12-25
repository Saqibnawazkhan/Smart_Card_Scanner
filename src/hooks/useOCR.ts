import { useCallback } from 'react'
import { useScannerStore, useUIStore } from '@/store'
import { processImage, extractTextFromResponse, extractContactFields } from '@/services/vision'
import { processImageForOCR } from '@/utils'
import type { ExtractedContact } from '@/types'

export function useOCR() {
  const {
    step,
    imageData,
    extractedData,
    rawOCRText,
    isProcessing,
    error,
    scanSource,
    setImage,
    setExtractedData,
    setRawText,
    setStep,
    setProcessing,
    setError,
    updateExtractedField,
    reset,
  } = useScannerStore()

  const { addToast } = useUIStore()

  const processBusinessCard = useCallback(
    async (file: File, source: 'camera' | 'upload' = 'upload'): Promise<ExtractedContact | null> => {
      setProcessing(true)
      setError(null)

      try {
        // Process and compress image
        const processedImage = await processImageForOCR(file)
        setImage(processedImage, source)

        // Call Vision API
        const response = await processImage(processedImage)

        // Extract raw text
        const rawText = extractTextFromResponse(response)
        setRawText(rawText)

        if (!rawText.trim()) {
          throw new Error('No text detected in the image. Please try a clearer image.')
        }

        // Extract structured fields
        const extracted = extractContactFields(rawText)
        setExtractedData(extracted)

        addToast({
          type: 'success',
          title: 'Card scanned successfully',
          message: 'Review the extracted information below',
        })

        return extracted
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to process image'
        setError(message)
        addToast({ type: 'error', title: 'Scan failed', message })
        return null
      }
    },
    [setImage, setExtractedData, setRawText, setProcessing, setError, addToast]
  )

  const processFromDataUrl = useCallback(
    async (dataUrl: string, source: 'camera' | 'upload' = 'upload'): Promise<ExtractedContact | null> => {
      setProcessing(true)
      setError(null)

      try {
        setImage(dataUrl, source)

        // Call Vision API
        const response = await processImage(dataUrl)

        // Extract raw text
        const rawText = extractTextFromResponse(response)
        setRawText(rawText)

        if (!rawText.trim()) {
          throw new Error('No text detected in the image. Please try a clearer image.')
        }

        // Extract structured fields
        const extracted = extractContactFields(rawText)
        setExtractedData(extracted)

        addToast({
          type: 'success',
          title: 'Card scanned successfully',
          message: 'Review the extracted information below',
        })

        return extracted
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to process image'
        setError(message)
        addToast({ type: 'error', title: 'Scan failed', message })
        return null
      }
    },
    [setImage, setExtractedData, setRawText, setProcessing, setError, addToast]
  )

  const retryProcessing = useCallback(async () => {
    if (!imageData) return null

    setStep('processing')
    setProcessing(true)
    setError(null)

    try {
      const response = await processImage(imageData)
      const rawText = extractTextFromResponse(response)
      setRawText(rawText)

      if (!rawText.trim()) {
        throw new Error('No text detected in the image')
      }

      const extracted = extractContactFields(rawText)
      setExtractedData(extracted)

      return extracted
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process image'
      setError(message)
      return null
    }
  }, [imageData, setStep, setProcessing, setError, setRawText, setExtractedData])

  return {
    step,
    imageData,
    extractedData,
    rawOCRText,
    isProcessing,
    error,
    scanSource,
    processBusinessCard,
    processFromDataUrl,
    retryProcessing,
    updateField: updateExtractedField,
    reset,
    setStep,
  }
}
