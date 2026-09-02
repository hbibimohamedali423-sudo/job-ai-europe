import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function AdminSettings() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{t('admin.settings.title')}</h1>
        <p className="mt-2 text-neutral-600">{t('admin.settings.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.settings.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">System settings configuration will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
