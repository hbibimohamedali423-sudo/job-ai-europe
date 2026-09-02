import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useJobStore } from '@/stores/job'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'

export function JobDetailsPage() {
  const { t } = useTranslation()
  const { jobId } = useParams()
  const user = useAuthStore((state) => state.user)
  
  const {
    selectedJob: job,
    selectedJobSkills: jobSkills,
    isLoading,
    error,
    savedJobIds,
    selectJob,
    loadSavedJobs,
    saveJob,
    unsaveJob,
  } = useJobStore()

  useEffect(() => {
    if (jobId) {
      selectJob(jobId)
    }
    if (user) {
      loadSavedJobs(user.id)
    }
  }, [jobId, user])

  const isSaved = job ? savedJobIds.has(job.id) : false

  const handleSaveToggle = async () => {
    if (!user || !job) return
    try {
      if (isSaved) {
        await unsaveJob(user.id, job.id)
      } else {
        await saveJob(user.id, job.id)
      }
    } catch (err) {
      console.error('Failed to toggle save:', err)
    }
  }

  const formatSalary = () => {
    if (!job) return null
    if (!job.salary_min && !job.salary_max) return null
    const currency = job.salary_currency || 'EUR'
    const formatNum = (num: number) => {
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(num)
    }

    if (job.salary_min && job.salary_max) {
      return `${formatNum(job.salary_min)} - ${formatNum(job.salary_max)} ${currency}`
    }
    if (job.salary_min) {
      return `From ${formatNum(job.salary_min)} ${currency}`
    }
    if (job.salary_max) {
      return `Up to ${formatNum(job.salary_max)} ${currency}`
    }
    return null
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString()
  }

  if (!user) {
    return (
      <div className="container-page py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-neutral-900">{t('jobs.authRequired.title')}</h2>
          <p className="mt-2 text-neutral-600">{t('jobs.authRequired.message')}</p>
          <Link to="/jobs">
            <Button className="mt-4">{t('jobs.backToJobs')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error || !job) {
    return (
      <div className="container-page py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-neutral-900">{t('jobs.notFound.title')}</h2>
          <p className="mt-2 text-neutral-600">{t('jobs.notFound.message')}</p>
          <Link to="/jobs">
            <Button className="mt-4">{t('jobs.backToJobs')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="mb-6 inline-flex items-center text-neutral-600 hover:text-neutral-900"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t('jobs.backToJobs')}
        </Link>

        {/* Job Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{job.title}</CardTitle>
                <p className="mt-1 text-lg text-neutral-600">{job.company}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {job.work_mode && (
                  <Badge variant="success">
                    {t(`jobs.workMode.${job.work_mode}`, job.work_mode)}
                  </Badge>
                )}
                {job.employment_type && (
                  <Badge variant="secondary">
                    {t(`jobs.employmentType.${job.employment_type}`, job.employment_type)}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-600">
              {(job.location || job.city || job.country) && (
                <span className="flex items-center">
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {[job.location, job.city, job.country].filter(Boolean).join(', ')}
                </span>
              )}
              {formatSalary() && (
                <span className="flex items-center">
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatSalary()}
                </span>
              )}
              <span className="flex items-center">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {t('jobs.postedOn', { date: formatDate(job.posted_at || job.created_at) })}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex gap-4">
            {job.application_url ? (
              <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="flex-1">
                  {t('jobs.applyNow')}
                </Button>
              </a>
            ) : (
              <Button size="lg" className="flex-1" disabled>
                {t('jobs.applyNow')}
              </Button>
            )}
            <Button
              size="lg"
              variant={isSaved ? 'secondary' : 'outline'}
              className="flex-1"
              onClick={handleSaveToggle}
            >
              {isSaved ? t('jobs.saved') : t('jobs.saveJob')}
            </Button>
          </CardContent>
        </Card>

        {/* Job Description */}
        {job.description && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('jobs.description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-neutral max-w-none whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </CardContent>
          </Card>
        )}

        {/* Job Skills */}
        {jobSkills && jobSkills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('jobs.requiredSkills')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {jobSkills.map((js) => (
                  <Badge
                    key={js.skill_id}
                    variant={js.requirement_type === 'required' ? 'default' : 'outline'}
                  >
                    {js.skill?.name || 'Unknown'}
                    {js.requirement_type === 'preferred' && ` (${t('jobs.preferred')})`}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>{t('jobs.jobDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {job.experience_level && (
                <>
                  <dt className="text-neutral-500">{t('jobs.experienceLevel.label')}</dt>
                  <dd className="font-medium">
                    {t(`jobs.experienceLevel.${job.experience_level}`, job.experience_level)}
                  </dd>
                </>
              )}
              {job.source_url && (
                <>
                  <dt className="text-neutral-500">{t('jobs.source')}</dt>
                  <dd>
                    <a
                      href={job.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {t('jobs.viewOriginal')}
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
