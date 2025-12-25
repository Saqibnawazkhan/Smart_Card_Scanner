import { Button } from '@/components/ui'

interface ImagePreviewProps {
  imageData: string
  onRetake?: () => void
  onConfirm?: () => void
  showActions?: boolean
  isProcessing?: boolean
}

export function ImagePreview({
  imageData,
  onRetake,
  onConfirm,
  showActions = true,
  isProcessing,
}: ImagePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border bg-slate-100 dark:bg-slate-800">
        <img
          src={imageData}
          alt="Business card preview"
          className="w-full object-contain"
          style={{ maxHeight: '400px' }}
        />
      </div>

      {showActions && (
        <div className="flex justify-center gap-3">
          {onRetake && (
            <Button onClick={onRetake} variant="outline" disabled={isProcessing}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retake
            </Button>
          )}
          {onConfirm && (
            <Button onClick={onConfirm} disabled={isProcessing} isLoading={isProcessing}>
              {isProcessing ? 'Processing...' : 'Process Image'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
