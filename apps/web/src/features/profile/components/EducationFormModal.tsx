import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Education } from '@/services/profile'

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().optional(),
  description: z.string().optional(),
})

type EducationFormData = z.infer<typeof educationSchema>

interface EducationFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Education, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => void
  education?: Education | null
  loading?: boolean
}

export function EducationFormModal({ isOpen, onClose, onSubmit, education, loading }: EducationFormModalProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: education?.institution || '',
      degree: education?.degree || '',
      field: education?.field || '',
      start_date: education?.start_date?.split('T')[0] || '',
      end_date: education?.end_date?.split('T')[0] || '',
      description: education?.description || '',
    },
  })

  const onFormSubmit = (data: EducationFormData) => {
    onSubmit({
      institution: data.institution,
      degree: data.degree,
      field: data.field,
      start_date: data.start_date,
      end_date: data.end_date || null,
      description: data.description || null,
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
      title={education ? t('profile.education.title') : t('profile.education.add')}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} loading={loading}>
            {education ? t('common.save') : t('profile.education.add')}
          </Button>
        </div>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="institution">{t('profile.education.institution')}</Label>
          <Input
            id="institution"
            {...register('institution')}
            error={!!errors.institution}
          />
          {errors.institution && (
            <p className="text-sm text-error-600">{errors.institution.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="degree">{t('profile.education.degree')}</Label>
          <Input
            id="degree"
            {...register('degree')}
            error={!!errors.degree}
          />
          {errors.degree && (
            <p className="text-sm text-error-600">{errors.degree.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="field">{t('profile.education.field')}</Label>
          <Input
            id="field"
            {...register('field')}
            error={!!errors.field}
          />
          {errors.field && (
            <p className="text-sm text-error-600">{errors.field.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">{t('profile.education.startDate')}</Label>
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
            <Label htmlFor="end_date">{t('profile.education.endDate')}</Label>
            <Input
              id="end_date"
              type="date"
              {...register('end_date')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t('profile.education.description')}</Label>
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
