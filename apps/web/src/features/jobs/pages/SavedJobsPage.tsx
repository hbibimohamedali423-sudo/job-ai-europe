import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'

export function SavedJobsPage() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-neutral-900">{t('jobs.saved.title')}</h1>
        <p className="mt-2 text-neutral-600">Manage your saved job listings</p>

        <div className="mt-8">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-neutral-100 p-4">
              <svg className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">{t('jobs.saved.empty')}</h3>
            <p className="mt-2 text-neutral-600">Save jobs you&apos;re interested in to view them later</p>
            <Button className="mt-4" asChild>
              <a href="/jobs">Browse Jobs</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
