import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function AdminSources() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('admin.sources.title')}</h1>
          <p className="mt-2 text-neutral-600">{t('admin.sources.subtitle')}</p>
        </div>
        <Button>{t('admin.sources.add')}</Button>
      </div>

      {/* Sources List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.sources.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 text-center py-8">No job sources configured yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}
