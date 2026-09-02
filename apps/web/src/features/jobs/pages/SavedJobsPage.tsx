import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useJobStore } from '@/stores/job'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'

export function SavedJobsPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const { savedJobs, loadSavedJobs, unsaveJob, isLoading } = useJobStore()

  useEffect(() => {
    if (user) {
      loadSavedJobs(user.id)
    }
  }, [user])

  const handleRemove = async (jobId: string) => {
    if (!user) return
    if (confirm(t('jobs.saved.confirmRemove'))) {
      await unsaveJob(user.id, jobId)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
  }

  if (!user) {
    return (
      <div className="container-page py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-neutral-900">{t('jobs.authRequired.title')}</h2>
          <p className="mt-2 text-neutral-600">{t('jobs.authRequired.message')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">{t('jobs.saved.title')}</h1>
          <p className="mt-2 text-neutral-600">{t('jobs.saved.subtitle')}</p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <LoadingScreen />
        ) : (
          /* Saved Jobs List */
          <div className="space-y-4">
            {savedJobs.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="rounded-full bg-neutral-100 p-4 mx-auto w-fit">
                    <svg
                      className="h-12 w-12 text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                    {t('jobs.saved.empty')}
                  </h3>
                  <p className="mt-2 text-neutral-600">
                    {t('jobs.saved.emptyDescription')}
                  </p>
                  <Link to="/jobs">
                    <Button className="mt-4">{t('jobs.saved.browseJobs')}</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              savedJobs.map((savedJob) => {
                const job = savedJob.job
                if (!job) return null
                return (
                  <Card key={savedJob.id} className="card-hover">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <Link to={`/jobs/${job.id}`}>
                            <CardTitle className="hover:underline truncate">{job.title}</CardTitle>
                          </Link>
                          <CardDescription className="mt-1 text-base font-medium">
                            {job.company}
                          </CardDescription>
                        </div>
                        {job.work_mode && (
                          <Badge variant="success">
                            {t(`jobs.workMode.${job.work_mode}`, job.work_mode)}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2 text-sm text-neutral-500">
                          {job.location && <span>{job.location}</span>}
                          {job.city && <span>, {job.city}</span>}
                          {job.country && <span>, {job.country}</span>}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-neutral-500">
                            {t('jobs.saved.savedOn', { date: formatDate(savedJob.created_at) })}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemove(job.id)}
                            >
                              {t('common.remove')}
                            </Button>
                            <Button size="sm" asChild>
                              <Link to={`/jobs/${job.id}`}>{t('common.viewDetails')}</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
