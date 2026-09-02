import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Experience } from '@/services/profile'

interface ExperienceCardProps {
  experience: Experience
  onEdit: (experience: Experience) => void
  onDelete: (id: string) => void
}

export function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
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
            <h3 className="font-semibold text-neutral-900">{experience.position}</h3>
            <p className="text-neutral-600">{experience.company}</p>
            {experience.location && (
              <p className="text-sm text-neutral-500">{experience.location}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(experience)}>
              {t('common.edit')}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(experience.id)}>
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-500">
          {formatDate(experience.start_date)} - {experience.current ? 'Present' : experience.end_date ? formatDate(experience.end_date) : ''}
        </p>
        {experience.description && (
          <p className="mt-2 text-neutral-700">{experience.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
