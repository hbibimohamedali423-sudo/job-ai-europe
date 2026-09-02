import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Language } from '@/services/profile'

interface LanguageCardProps {
  language: Language
  onEdit: (language: Language) => void
  onDelete: (id: string) => void
}

export function LanguageCard({ language, onEdit, onDelete }: LanguageCardProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900">{language.language}</h3>
            <p className="text-neutral-600">{language.level}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(language)}>
              {t('common.edit')}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(language.id)}>
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
