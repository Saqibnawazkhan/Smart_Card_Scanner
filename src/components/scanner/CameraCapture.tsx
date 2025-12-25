import { useEffect, useCallback } from 'react'
import { useCamera } from '@/hooks'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
  isProcessing?: boolean
}

export function CameraCapture({ onCapture, onCancel, isProcessing }: CameraCaptureProps) {
  const { videoRef, isActive, isSupported, error, startCamera, stopCamera, captureImage, switchCamera } =
    useCamera()

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  const handleCapture = useCallback(() => {
    const imageData = captureImage()
    if (imageData) {
      stopCamera()
      onCapture(imageData)
    }
  }, [captureImage, stopCamera, onCapture])

  const handleCancel = () => {
    stopCamera()
    onCancel()
  }

  if (!isSupported) {
    return (
      <div className="rounded-xl border bg-slate-50 p-8 text-center dark:bg-slate-800">
        <svg
          className="mx-auto h-12 w-12 text-slate-400"
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
        <p className="mt-4 text-lg font-medium text-slate-900 dark:text-white">Camera not supported</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your browser doesn't support camera access. Please use file upload instead.
        </p>
        <Button onClick={onCancel} className="mt-4">
          Use File Upload
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-red-50 p-8 text-center dark:bg-red-900/20">
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
        <p className="mt-4 text-lg font-medium text-red-900 dark:text-red-200">{error}</p>
        <div className="mt-4 flex justify-center gap-3">
          <Button onClick={() => startCamera()} variant="outline">
            Try Again
          </Button>
          <Button onClick={onCancel}>Use File Upload</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            'w-full aspect-[4/3] object-cover',
            !isActive && 'opacity-50'
          )}
        />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="h-8 w-8 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm text-white">Starting camera...</span>
            </div>
          </div>
        )}

        {/* Camera guide overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-48 w-80 rounded-lg border-2 border-dashed border-white/50" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button onClick={handleCancel} variant="outline" disabled={isProcessing}>
          Cancel
        </Button>
        <Button onClick={switchCamera} variant="secondary" disabled={!isActive || isProcessing}>
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Switch
        </Button>
        <Button onClick={handleCapture} disabled={!isActive || isProcessing} isLoading={isProcessing}>
          {isProcessing ? 'Processing...' : 'Capture'}
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Position the business card within the frame and tap Capture
      </p>
    </div>
  )
}
