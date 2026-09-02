import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Language } from '@/services/profile'

const languageSchema = z.object({
  language: z.string().min(1),
  level: z.string().min(1),
})

type LanguageFormData = z.infer<typeof languageSchema>

const PROFICIENCY_LEVELS = [
  'Native',
  'Fluent',
  'Advanced',
  'Intermediate',
  'Basic',
]

interface LanguageFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Language, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => void
  language?: Language | null
  loading?: boolean
}

export function LanguageFormModal({ isOpen, onClose, onSubmit, language, loading }: LanguageFormModalProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: language?.language || '',
      level: language?.level || '',
    },
  })

  const onFormSubmit = (data: LanguageFormData) => {
    onSubmit({
      language: data.language,
      level: data.level,
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
      title={language ? t('profile.languages.title') : t('profile.languages.add')}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} loading={loading}>
            {language ? t('common.save') : t('profile.languages.add')}
          </Button>
        </div>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language">{t('profile.languages.language')}</Label>
          <Input
            id="language"
            {...register('language')}
            error={!!errors.language}
            placeholder="e.g., English, French, Arabic"
          />
          {errors.language && (
            <p className="text-sm text-error-600">{errors.language.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">{t('profile.languages.level')}</Label>
          <select
            id="level"
            {...register('level')}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">Select proficiency</option>
            {PROFICIENCY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="text-sm text-error-600">{errors.level.message}</p>
          )}
        </div>
      </form>
    </Modal>
  )
}
