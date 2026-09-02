import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function AdminJobs() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{t('admin.jobs.title')}</h1>
        <p className="mt-2 text-neutral-600">{t('admin.jobs.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-neutral-900">0</p>
            <p className="mt-2 text-neutral-600">{t('admin.jobs.total')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-success-600">0</p>
            <p className="mt-2 text-neutral-600">{t('admin.jobs.active')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-warning-600">0</p>
            <p className="mt-2 text-neutral-600">{t('admin.jobs.duplicates')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-error-600">0</p>
            <p className="mt-2 text-neutral-600">{t('admin.jobs.invalid')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.jobs.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 text-center py-8">No job data available yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}
