import { cn } from '@/utils'
import { getConfidenceColor, getConfidenceBgColor } from '@/services/vision'

interface ConfidenceIndicatorProps {
  confidence: number
  showPercentage?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function ConfidenceIndicator({
  confidence,
  showPercentage = true,
  size = 'md',
  className,
}: ConfidenceIndicatorProps) {
  const percentage = Math.round(confidence * 100)

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
  }

  const getBarColor = () => {
    if (confidence >= 0.8) return 'bg-green-500'
    if (confidence >= 0.5) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', getBarColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <span className={cn('text-xs font-medium tabular-nums', getConfidenceColor(confidence))}>
          {percentage}%
        </span>
      )}
    </div>
  )
}

interface ConfidenceBadgeProps {
  confidence: number
  className?: string
}

export function ConfidenceBadge({ confidence, className }: ConfidenceBadgeProps) {
  const percentage = Math.round(confidence * 100)

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        getConfidenceBgColor(confidence),
        getConfidenceColor(confidence),
        className
      )}
    >
      {percentage}%
    </span>
  )
}
