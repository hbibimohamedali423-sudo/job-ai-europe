import { useTranslation } from 'react-i18next'
import type { MatchWithJob } from '@/types/matching'

interface MatchCardProps {
  match: MatchWithJob
  onClick: () => void
}

export function MatchCard({ match, onClick }: MatchCardProps) {
  const { t } = useTranslation()

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 bg-success-50'
    if (score >= 60) return 'text-primary-600 bg-primary-50'
    if (score >= 40) return 'text-warning-600 bg-warning-50'
    return 'text-error-600 bg-error-50'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return t('matches.score.excellent')
    if (score >= 60) return t('matches.score.good')
    if (score >= 40) return t('matches.score.moderate')
    return t('matches.score.low')
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
            {match.job.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-600 truncate">{match.job.company}</p>
        </div>
        
        {/* Score Badge */}
        <div className={`flex flex-col items-center rounded-lg px-3 py-2 ${getScoreColor(match.score)}`}>
          <span className="text-lg font-bold">{match.score}%</span>
          <span className="text-xs font-medium">{getScoreLabel(match.score)}</span>
        </div>
      </div>

      {/* Location & Work Mode */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
        {match.job.location && (
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {match.job.location}
          </span>
        )}
        {match.job.work_mode && (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium">
            {t(`jobs.workMode.${match.job.work_mode === 'on_site' ? 'onsite' : match.job.work_mode}`)}
          </span>
        )}
        {match.job.employment_type && (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium">
            {t(`jobs.employmentType.${match.job.employment_type}`)}
          </span>
        )}
      </div>

      {/* Skills Match */}
      {match.matched_skills.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            {t('matches.skills.matched')}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {match.matched_skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700"
              >
                {skill}
              </span>
            ))}
            {match.matched_skills.length > 3 && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                +{match.matched_skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {match.missing_skills.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            {t('matches.skills.missing')}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {match.missing_skills.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700"
              >
                {skill}
              </span>
            ))}
            {match.missing_skills.length > 2 && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                +{match.missing_skills.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {match.summary && (
        <p className="mt-4 text-sm text-neutral-600 line-clamp-2">{match.summary}</p>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
        <span>{match.job.posted_at && formatDate(match.job.posted_at)}</span>
        <span className="text-primary-600 font-medium group-hover:underline">
          {t('matches.viewDetails')}
        </span>
      </div>
    </div>
  )
}
