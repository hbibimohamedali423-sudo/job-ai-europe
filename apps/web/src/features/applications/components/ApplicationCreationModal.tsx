import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useApplicationStore } from '@/stores/application'
import type { Job } from '@/types/job'

interface ApplicationCreationModalProps {
  isOpen: boolean
  onClose: () => void
  job: Job | null
  userId: string
}

export function ApplicationCreationModal({ isOpen, onClose, job, userId }: ApplicationCreationModalProps) {
  const { t } = useTranslation()
  const { createApplication, loading, error } = useApplicationStore()
  
  const [notes, setNotes] = useState('')
  const [createAsDraft, setCreateAsDraft] = useState(true)

  const handleCreate = async () => {
    if (!job) return
    
    try {
      const application = await createApplication(userId, job.id)
      
      // If user wants to add notes and not just draft
      if (notes.trim() && !createAsDraft) {
        // Notes would be saved here - for now we just close
      }
      
      onClose()
    } catch (err) {
      // Error is handled by the store
    }
  }

  if (!job) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('applications.create.title')}
      description={t('applications.create.description')}
      size="md"
    >
      {/* Job Preview */}
      <div className="rounded-lg bg-neutral-50 p-4 mb-6">
        <h4 className="font-semibold text-neutral-900">{job.title}</h4>
        <p className="text-sm text-neutral-600">{job.company}</p>
        {job.location && (
          <p className="mt-1 text-sm text-neutral-500">{job.location}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {job.work_mode && (
            <Badge variant="secondary">
              {t(`jobs.workMode.${job.work_mode === 'on_site' ? 'onsite' : job.work_mode}`)}
            </Badge>
          )}
          {job.employment_type && (
            <Badge variant="secondary">
              {t(`jobs.employmentType.${job.employment_type}`)}
            </Badge>
          )}
          {job.experience_level && (
            <Badge variant="secondary">
              {t(`jobs.experienceLevel.${job.experience_level}`)}
            </Badge>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="draft-mode"
            checked={createAsDraft}
            onChange={(e) => setCreateAsDraft(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="draft-mode" className="text-sm text-neutral-700">
            {t('applications.create.draftMode')}
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {t('applications.notes.label')} ({t('applications.optional')})
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('applications.notes.placeholder')}
            className="w-full rounded-lg border border-neutral-300 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            rows={3}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-error-50 p-3 text-sm text-error-600">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={onClose} variant="outline" disabled={loading}>
          {t('applications.cancel')}
        </Button>
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? t('applications.creating') : t('applications.create.submit')}
        </Button>
      </div>
    </Modal>
  )
}
