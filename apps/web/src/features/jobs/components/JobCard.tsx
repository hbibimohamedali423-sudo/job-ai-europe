import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Job } from '@/types/job'

interface JobCardProps {
  job: Job
  isSaved?: boolean
  onSaveToggle?: (jobId: string, isSaved: boolean) => void
}

export function JobCard({ job, isSaved, onSaveToggle }: JobCardProps) {
  const { t } = useTranslation()

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const getWorkModeBadge = (mode: string | null) => {
    if (!mode) return null
    const variants: Record<string, 'success' | 'secondary' | 'default'> = {
      remote: 'success',
      hybrid: 'default',
      on_site: 'secondary',
    }
    const labels: Record<string, string> = {
      remote: t('jobs.workMode.remote'),
      hybrid: t('jobs.workMode.hybrid'),
      on_site: t('jobs.workMode.onSite'),
    }
    return (
      <Badge variant={variants[mode] || 'secondary'}>
        {labels[mode] || mode}
      </Badge>
    )
  }

  const getEmploymentTypeBadge = (type: string | null) => {
    if (!type) return null
    const labels: Record<string, string> = {
      full_time: t('jobs.employmentType.fullTime'),
      part_time: t('jobs.employmentType.partTime'),
      contract: t('jobs.employmentType.contract'),
      internship: t('jobs.employmentType.internship'),
      temporary: t('jobs.employmentType.temporary'),
    }
    return <Badge variant="secondary">{labels[type] || type}</Badge>
  }

  const formatSalary = () => {
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

  return (
    <Card className="card-hover h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link to={`/jobs/${job.id}`} className="hover:underline">
              <CardTitle className="text-lg leading-tight truncate">
                {job.title}
              </CardTitle>
            </Link>
            <CardDescription className="mt-1 text-base font-medium text-neutral-700">
              {job.company}
            </CardDescription>
          </div>
          {job.work_mode && getWorkModeBadge(job.work_mode)}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Location */}
          {(job.location || job.city || job.country) && (
            <div className="flex items-center gap-1 text-sm text-neutral-600">
              <svg
                className="h-4 w-4 flex-shrink-0"
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
              <span className="truncate">
                {[job.location, job.city, job.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Description */}
          {job.description && (
            <p className="text-sm text-neutral-600 line-clamp-3">
              {job.description.replace(/<[^>]*>/g, '')}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {job.employment_type && getEmploymentTypeBadge(job.employment_type)}
            {job.experience_level && (
              <Badge variant="outline">
                {t(`jobs.experienceLevel.${job.experience_level}`, job.experience_level)}
              </Badge>
            )}
          </div>

          {/* Salary */}
          {formatSalary() && (
            <p className="text-sm font-medium text-primary-600">
              {formatSalary()}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-neutral-100">
          <span className="text-sm text-neutral-500">
            {formatDate(job.posted_at || job.created_at)}
          </span>
          <div className="flex gap-2">
            {onSaveToggle && (
              <Button
                size="sm"
                variant={isSaved ? 'outline' : 'ghost'}
                onClick={() => onSaveToggle(job.id, !!isSaved)}
              >
                <svg
                  className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                  fill={isSaved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </Button>
            )}
            <Button size="sm" asChild>
              <Link to={`/jobs/${job.id}`}>{t('common.viewDetails')}</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
