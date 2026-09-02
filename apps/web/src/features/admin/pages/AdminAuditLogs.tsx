import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function AdminAuditLogs() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{t('admin.audit.title')}</h1>
        <p className="mt-2 text-neutral-600">{t('admin.audit.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.audit.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 text-center py-8">No audit logs available yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}
