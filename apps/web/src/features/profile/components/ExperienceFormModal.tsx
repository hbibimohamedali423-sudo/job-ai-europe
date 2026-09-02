import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Experience } from '@/services/profile'

const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
  location: z.string().optional(),
})

type ExperienceFormData = z.infer<typeof experienceSchema>

interface ExperienceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Experience, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => void
  experience?: Experience | null
  loading?: boolean
}

export function ExperienceFormModal({ isOpen, onClose, onSubmit, experience, loading }: ExperienceFormModalProps) {
  const { t } = useTranslation()
  const [isCurrent, setIsCurrent] = useState(experience?.current || false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: experience?.company || '',
      position: experience?.position || '',
      start_date: experience?.start_date?.split('T')[0] || '',
      end_date: experience?.end_date?.split('T')[0] || '',
      current: experience?.current || false,
      description: experience?.description || '',
      location: experience?.location || '',
    },
  })

  const onFormSubmit = (data: ExperienceFormData) => {
    onSubmit({
      company: data.company,
      position: data.position,
      start_date: data.start_date,
      end_date: isCurrent ? null : data.end_date || null,
      current: isCurrent,
      description: data.description || null,
      location: data.location || null,
    })
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={experience ? t('profile.experience.title') : t('profile.experience.add')}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} loading={loading}>
            {experience ? t('common.save') : t('profile.experience.add')}
          </Button>
        </div>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company">{t('profile.experience.company')}</Label>
          <Input
            id="company"
            {...register('company')}
            error={!!errors.company}
          />
          {errors.company && (
            <p className="text-sm text-error-600">{errors.company.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">{t('profile.experience.position')}</Label>
          <Input
            id="position"
            {...register('position')}
            error={!!errors.position}
          />
          {errors.position && (
            <p className="text-sm text-error-600">{errors.position.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{t('profile.experience.location')}</Label>
          <Input
            id="location"
            {...register('location')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">{t('profile.experience.startDate')}</Label>
            <Input
              id="start_date"
              type="date"
              {...register('start_date')}
              error={!!errors.start_date}
            />
            {errors.start_date && (
              <p className="text-sm text-error-600">{errors.start_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">{t('profile.experience.endDate')}</Label>
            <Input
              id="end_date"
              type="date"
              {...register('end_date')}
              disabled={isCurrent}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="current"
            type="checkbox"
            {...register('current')}
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
            className="rounded border-neutral-300"
          />
          <Label htmlFor="current" className="cursor-pointer">
            {t('profile.experience.current')}
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t('profile.experience.description')}</Label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </form>
    </Modal>
  )
}
