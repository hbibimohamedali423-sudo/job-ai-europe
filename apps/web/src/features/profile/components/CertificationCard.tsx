import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Certification } from '@/services/profile'

interface CertificationCardProps {
  certification: Certification
  onEdit: (certification: Certification) => void
  onDelete: (id: string) => void
}

export function CertificationCard({ certification, onEdit, onDelete }: CertificationCardProps) {
  const { t } = useTranslation()

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900">{certification.name}</h3>
            <p className="text-neutral-600">{certification.issuer}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(certification)}>
              {t('common.edit')}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(certification.id)}>
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-neutral-500 space-y-1">
          {certification.issue_date && (
            <p>Issued: {formatDate(certification.issue_date)}</p>
          )}
          {certification.expiry_date && (
            <p>Expires: {formatDate(certification.expiry_date)}</p>
          )}
          {certification.credential_id && (
            <p>Credential ID: {certification.credential_id}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
