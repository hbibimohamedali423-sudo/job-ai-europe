import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Education } from '@/services/profile'

interface EducationCardProps {
  education: Education
  onEdit: (education: Education) => void
  onDelete: (id: string) => void
}

export function EducationCard({ education, onEdit, onDelete }: EducationCardProps) {
  const { t } = useTranslation()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900">{education.degree} in {education.field}</h3>
            <p className="text-neutral-600">{education.institution}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(education)}>
              {t('common.edit')}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(education.id)}>
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-500">
          {formatDate(education.start_date)} - {education.end_date ? formatDate(education.end_date) : 'Present'}
        </p>
        {education.description && (
          <p className="mt-2 text-neutral-700">{education.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
