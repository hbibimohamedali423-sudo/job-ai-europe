import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Certification } from '@/services/profile'

const certificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  credential_id: z.string().optional(),
})

type CertificationFormData = z.infer<typeof certificationSchema>

interface CertificationFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Certification, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => void
  certification?: Certification | null
  loading?: boolean
}

export function CertificationFormModal({ isOpen, onClose, onSubmit, certification, loading }: CertificationFormModalProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: certification?.name || '',
      issuer: certification?.issuer || '',
      issue_date: certification?.issue_date?.split('T')[0] || '',
      expiry_date: certification?.expiry_date?.split('T')[0] || '',
      credential_id: certification?.credential_id || '',
    },
  })

  const onFormSubmit = (data: CertificationFormData) => {
    onSubmit({
      name: data.name,
      issuer: data.issuer,
      issue_date: data.issue_date || null,
      expiry_date: data.expiry_date || null,
      credential_id: data.credential_id || null,
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
      title={certification ? t('profile.certifications.title') : t('profile.certifications.add')}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} loading={loading}>
            {certification ? t('common.save') : t('profile.certifications.add')}
          </Button>
        </div>
      }
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('profile.certifications.name')}</Label>
          <Input
            id="name"
            {...register('name')}
            error={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-error-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="issuer">{t('profile.certifications.issuer')}</Label>
          <Input
            id="issuer"
            {...register('issuer')}
            error={!!errors.issuer}
          />
          {errors.issuer && (
            <p className="text-sm text-error-600">{errors.issuer.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="issue_date">{t('profile.certifications.issueDate')}</Label>
            <Input
              id="issue_date"
              type="date"
              {...register('issue_date')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date">{t('profile.certifications.expiryDate')}</Label>
            <Input
              id="expiry_date"
              type="date"
              {...register('expiry_date')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="credential_id">{t('profile.certifications.credentialId')}</Label>
          <Input
            id="credential_id"
            {...register('credential_id')}
          />
        </div>
      </form>
    </Modal>
  )
}
