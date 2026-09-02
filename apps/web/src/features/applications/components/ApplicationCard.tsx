import { useTranslation } from 'react-i18next'
import type { ApplicationWithJob, ApplicationStatus } from '@/types/application'
import { Badge } from '@/components/ui/Badge'

interface ApplicationCardProps {
  application: ApplicationWithJob
  onClick: () => void
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const { t } = useTranslation()

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-neutral-100 text-neutral-700'
      case 'applied':
        return 'bg-primary-100 text-primary-700'
      case 'pending':
        return 'bg-warning-100 text-warning-700'
      case 'interview':
        return 'bg-success-100 text-success-700'
      case 'rejected':
        return 'bg-error-100 text-error-700'
      case 'accepted':
        return 'bg-success-100 text-success-700'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg bg-white p-5 shadow-sm border border-neutral-200 transition-all hover:shadow-md hover:border-primary-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
            {application.job.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-600 truncate">{application.job.company}</p>
        </div>
        
        {/* Status Badge */}
        <Badge className={getStatusColor(application.status)}>
          {t(`applications.status.${application.status}`)}
        </Badge>
      </div>

      {/* Location & Work Mode */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
        {application.job.location && (
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {application.job.location}
          </span>
        )}
        {application.job.work_mode && (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium">
            {t(`jobs.workMode.${application.job.work_mode === 'on_site' ? 'onsite' : application.job.work_mode}`)}
          </span>
        )}
        {application.job.employment_type && (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium">
            {t(`jobs.employmentType.${application.job.employment_type}`)}
          </span>
        )}
      </div>

      {/* Notes preview */}
      {application.notes && (
        <p className="mt-4 text-sm text-neutral-600 line-clamp-2">{application.notes}</p>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
        <span>
          {application.applied_at
            ? `${t('applications.appliedOn')} ${formatDate(application.applied_at)}`
            : `${t('applications.createdOn')} ${formatDate(application.created_at)}`
          }
        </span>
        <span className="text-primary-600 font-medium group-hover:underline">
          {t('applications.viewDetails')}
        </span>
      </div>
    </div>
  )
}
