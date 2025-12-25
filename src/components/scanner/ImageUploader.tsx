import { useState, useRef, useCallback } from 'react'
import { cn } from '@/utils'
import { isValidImageType } from '@/utils/imageProcessing'

interface ImageUploaderProps {
  onImageSelected: (file: File) => void
  isProcessing?: boolean
}

export function ImageUploader({ onImageSelected, isProcessing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      setError(null)

      if (!isValidImageType(file)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      onImageSelected(file)
    },
    [onImageSelected]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:border-primary-500 dark:hover:bg-slate-800',
          isProcessing && 'pointer-events-none opacity-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center gap-4">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div>
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              {isDragging ? 'Drop your image here' : 'Upload a business card image'}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Drag and drop or click to browse
            </p>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Supports: JPEG, PNG, GIF, WebP (max 10MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
