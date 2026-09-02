import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Profile } from '@/services/profile'

const profileSchema = z.object({
  full_name: z.string().optional(),
  professional_title: z.string().optional(),
  summary: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Profile> | null) => void
  profile: Profile | null
  loading?: boolean
}

export function ProfileEditModal({ isOpen, onClose, onSubmit, profile, loading }: ProfileEditModalProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      professional_title: profile?.professional_title || '',
      summary: profile?.summary || '',
      country: profile?.country || '',
      city: profile?.city || '',
    },
  })

  const onFormSubmit = (data: ProfileFormData) => {
    onSubmit({
      full_name: data.full_name || null,
      professional_title: data.professional_title || null,
      summary: data.summary || null,
      country: data.country || null,
      city: data.city || null,
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
      title={t('profile.personal.title')}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} loading={loading}>
            {t('common.save')}
          </Button>
        </div>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">{t('profile.personal.fullName')}</Label>
          <Input
            id="full_name"
            {...register('full_name')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="professional_title">{t('profile.professional.professionalTitle')}</Label>
          <Input
            id="professional_title"
            {...register('professional_title')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">{t('profile.professional.summary')}</Label>
          <textarea
            id="summary"
            {...register('summary')}
            rows={4}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">{t('profile.personal.country')}</Label>
            <Input
              id="country"
              {...register('country')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">{t('profile.personal.city')}</Label>
            <Input
              id="city"
              {...register('city')}
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
