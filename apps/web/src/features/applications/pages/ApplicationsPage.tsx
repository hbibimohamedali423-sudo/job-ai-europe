import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export function ApplicationsPage() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{t('applications.title')}</h1>
            <p className="mt-2 text-neutral-600">{t('applications.subtitle')}</p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="default">{t('applications.status.draft')}</Badge>
          <Badge variant="secondary">{t('applications.status.applied')}</Badge>
          <Badge variant="secondary">{t('applications.status.pending')}</Badge>
          <Badge variant="secondary">{t('applications.status.interview')}</Badge>
          <Badge variant="secondary">{t('applications.status.rejected')}</Badge>
          <Badge variant="secondary">{t('applications.status.accepted')}</Badge>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-neutral-100 p-4">
              <svg className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">{t('applications.empty.title')}</h3>
            <p className="mt-2 text-neutral-600 text-center max-w-sm">{t('applications.empty.description')}</p>
            <Button className="mt-4" asChild>
              <a href="/jobs">Browse Jobs</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
