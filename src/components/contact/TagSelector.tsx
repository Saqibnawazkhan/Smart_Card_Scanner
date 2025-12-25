import { cn } from '@/utils'
import { TAG_LABELS, TAG_COLORS, type ContactTag } from '@/types'

interface TagSelectorProps {
  selected: ContactTag[]
  onChange: (tags: ContactTag[]) => void
  disabled?: boolean
}

const allTags: ContactTag[] = ['client', 'vendor', 'hr', 'personal', 'other']

export function TagSelector({ selected, onChange, disabled }: TagSelectorProps) {
  const toggleTag = (tag: ContactTag) => {
    if (disabled) return

    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags</label>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selected.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              disabled={disabled}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isSelected
                  ? TAG_COLORS[tag]
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              )}
            >
              {TAG_LABELS[tag]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
