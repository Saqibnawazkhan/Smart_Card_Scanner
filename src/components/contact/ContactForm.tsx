import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { ExtractedFields } from '@/components/ocr'
import { TagSelector } from './TagSelector'
import type { ExtractedContact, ContactFormData, ContactTag, FieldConfidence } from '@/types'

interface ContactFormProps {
  extractedData?: ExtractedContact
  initialData?: Partial<ContactFormData>
  onSubmit: (data: ContactFormData, confidence: FieldConfidence) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function ContactForm({
  extractedData,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Save Contact',
}: ContactFormProps) {
  const [formData, setFormData] = useState<ExtractedContact>(() => {
    if (extractedData) {
      return extractedData
    }
    return {
      name: { value: initialData?.name || '', confidence: 1 },
      company: { value: initialData?.company || '', confidence: 1 },
      phone: { value: initialData?.phone || '', confidence: 1 },
      email: { value: initialData?.email || '', confidence: 1 },
      address: { value: initialData?.address || '', confidence: 1 },
      website: { value: initialData?.website || '', confidence: 1 },
    }
  })

  const [tags, setTags] = useState<ContactTag[]>(initialData?.tags || [])
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (extractedData) {
      setFormData(extractedData)
    }
  }, [extractedData])

  const handleFieldChange = (field: keyof ExtractedContact, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    if (!formData.name.value.trim()) {
      setError('Name is required')
      return
    }

    const contactData: ContactFormData = {
      name: formData.name.value.trim(),
      company: formData.company.value.trim(),
      phone: formData.phone.value.trim(),
      email: formData.email.value.trim(),
      address: formData.address.value.trim(),
      website: formData.website.value.trim(),
      tags,
      notes: notes.trim(),
    }

    const confidence: FieldConfidence = {
      name: formData.name.confidence,
      company: formData.company.confidence,
      phone: formData.phone.confidence,
      email: formData.email.confidence,
      address: formData.address.confidence,
      website: formData.website.confidence,
    }

    try {
      await onSubmit(contactData, confidence)
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'type' in err && err.type === 'duplicate') {
        // Duplicate error is handled by parent
        throw err
      }
      setError(err instanceof Error ? err.message : 'Failed to save contact')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      <ExtractedFields
        data={formData}
        onChange={handleFieldChange}
        disabled={isSubmitting}
      />

      <TagSelector selected={tags} onChange={setTags} disabled={isSubmitting} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
          disabled={isSubmitting}
          rows={3}
          className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:ring-offset-slate-900 dark:placeholder:text-slate-500"
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
