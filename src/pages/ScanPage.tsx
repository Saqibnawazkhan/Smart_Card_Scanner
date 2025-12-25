import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOCR, useContacts } from '@/hooks'
import { ImageUploader, CameraCapture, ImagePreview } from '@/components/scanner'
import { ProcessingStatus } from '@/components/ocr'
import { ContactForm, DuplicateWarning } from '@/components/contact'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import type { ContactFormData, FieldConfidence, Contact } from '@/types'

type InputMode = 'choose' | 'upload' | 'camera'

export function ScanPage() {
  const navigate = useNavigate()
  const [inputMode, setInputMode] = useState<InputMode>('choose')
  const [duplicateInfo, setDuplicateInfo] = useState<{
    contact: Contact
    reasons: string[]
    pendingData: { formData: ContactFormData; confidence: FieldConfidence }
  } | null>(null)

  const {
    step,
    imageData,
    extractedData,
    isProcessing,
    error,
    scanSource,
    processBusinessCard,
    processFromDataUrl,
    reset,
  } = useOCR()

  const { saveContact } = useContacts()

  const handleFileSelected = async (file: File) => {
    setInputMode('upload')
    await processBusinessCard(file, 'upload')
  }

  const handleCameraCapture = async (dataUrl: string) => {
    await processFromDataUrl(dataUrl, 'camera')
  }

  const handleSubmit = async (formData: ContactFormData, confidence: FieldConfidence) => {
    try {
      await saveContact(formData, confidence, scanSource)
      reset()
      setInputMode('choose')
      navigate('/contacts')
    } catch (err: any) {
      if (err.type === 'duplicate') {
        setDuplicateInfo({
          contact: err.contact,
          reasons: err.reasons,
          pendingData: { formData, confidence },
        })
      } else {
        throw err
      }
    }
  }

  const handleSaveAnyway = async () => {
    if (!duplicateInfo) return

    const { formData, confidence } = duplicateInfo.pendingData
    // Bypass duplicate check by directly saving
    try {
      await saveContact(
        { ...formData, notes: formData.notes + '\n(Saved despite duplicate warning)' },
        confidence,
        scanSource
      )
      setDuplicateInfo(null)
      reset()
      setInputMode('choose')
      navigate('/contacts')
    } catch {
      // Error handled by saveContact
    }
  }

  const handleReset = () => {
    reset()
    setInputMode('choose')
  }

  // Step: Choose input method
  if (inputMode === 'choose' && step === 'idle') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Scan Business Card</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Upload an image or use your camera to scan a business card
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => setInputMode('upload')}
          >
            <CardContent className="flex flex-col items-center p-8">
              <div className="rounded-full bg-primary-100 p-4 dark:bg-primary-900/50">
                <svg
                  className="h-8 w-8 text-primary-600 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                Upload Image
              </h3>
              <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                Select an existing photo of a business card
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => setInputMode('camera')}
          >
            <CardContent className="flex flex-col items-center p-8">
              <div className="rounded-full bg-primary-100 p-4 dark:bg-primary-900/50">
                <svg
                  className="h-8 w-8 text-primary-600 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                Use Camera
              </h3>
              <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                Take a photo with your device camera
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step: File upload
  if (inputMode === 'upload' && step === 'idle') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Business Card</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Select an image file to scan
            </p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            Back
          </Button>
        </div>

        <ImageUploader onImageSelected={handleFileSelected} isProcessing={isProcessing} />
      </div>
    )
  }

  // Step: Camera capture
  if (inputMode === 'camera' && step === 'idle') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Scan Business Card</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Position the card in the frame and capture
          </p>
        </div>

        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={handleReset}
          isProcessing={isProcessing}
        />
      </div>
    )
  }

  // Step: Processing
  if (step === 'processing' || isProcessing) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Processing</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <ProcessingStatus message="Analyzing business card..." />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step: Review and edit
  if (step === 'review' && extractedData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review Contact</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Verify the extracted information and make any corrections
            </p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            Scan Another
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Scanned Image</CardTitle>
            </CardHeader>
            <CardContent>
              {imageData && <ImagePreview imageData={imageData} showActions={false} />}
            </CardContent>
          </Card>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm
                extractedData={extractedData}
                onSubmit={handleSubmit}
                onCancel={handleReset}
              />
            </CardContent>
          </Card>
        </div>

        {/* Duplicate warning modal */}
        <DuplicateWarning
          isOpen={!!duplicateInfo}
          onClose={() => setDuplicateInfo(null)}
          existingContact={duplicateInfo?.contact || null}
          matchReasons={duplicateInfo?.reasons || []}
          onSaveAnyway={handleSaveAnyway}
          onViewExisting={() => {
            if (duplicateInfo) {
              navigate(`/contacts/${duplicateInfo.contact.id}`)
            }
          }}
        />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Scan Error</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                Failed to process image
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
              <Button onClick={handleReset} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
