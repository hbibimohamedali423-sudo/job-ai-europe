import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function AdminAI() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{t('admin.ai.title')}</h1>
        <p className="mt-2 text-neutral-600">{t('admin.ai.subtitle')}</p>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary-600">0</p>
            <p className="mt-2 text-neutral-600">Requests Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-success-600">0</p>
            <p className="mt-2 text-neutral-600">Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-neutral-900">€0</p>
            <p className="mt-2 text-neutral-600">Est. Cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.ai.model')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">AI configuration options will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
