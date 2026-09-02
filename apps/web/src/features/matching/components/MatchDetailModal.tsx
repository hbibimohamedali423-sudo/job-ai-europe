import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { MatchWithJob } from '@/types/matching'

interface MatchDetailModalProps {
  isOpen: boolean
  onClose: () => void
  match: MatchWithJob | null
}

export function MatchDetailModal({ isOpen, onClose, match }: MatchDetailModalProps) {
  const { t } = useTranslation()

  if (!match) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 bg-success-50'
    if (score >= 60) return 'text-primary-600 bg-primary-50'
    if (score >= 40) return 'text-warning-600 bg-warning-50'
    return 'text-error-600 bg-error-50'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const formatSalary = (min: number | null, max: number | null, currency: string | null) => {
    if (!min && !max) return null
    const curr = currency || 'EUR'
    const formatNum = (n: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)
    if (min && max) return `${formatNum(min)} - ${formatNum(max)} ${curr}`
    if (min) return `From ${formatNum(min)} ${curr}`
    if (max) return `Up to ${formatNum(max)} ${curr}`
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('matches.detail.title')}
      footer={
        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to={`/jobs/${match.job_id}`} onClick={onClose}>
              {t('matches.detail.viewJob')}
            </Link>
          </Button>
          <Button asChild>
            <a
              href={match.job.application_url || `#`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              {t('matches.detail.apply')}
            </a>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Job Header */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">{match.job.title}</h3>
              <p className="mt-1 text-neutral-600">{match.job.company}</p>
            </div>
            <div className={`flex flex-col items-center rounded-lg px-4 py-2 ${getScoreColor(match.score)}`}>
              <span className="text-2xl font-bold">{match.score}%</span>
              <span className="text-xs font-medium">{t('matches.detail.match')}</span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {match.job.location && (
            <div>
              <p className="font-medium text-neutral-500">{t('jobs.fields.location')}</p>
              <p className="mt-1 text-neutral-900">{match.job.location}</p>
            </div>
          )}
          {match.job.work_mode && (
            <div>
              <p className="font-medium text-neutral-500">{t('jobs.fields.workMode')}</p>
              <p className="mt-1 text-neutral-900">
                {t(`jobs.workMode.${match.job.work_mode === 'on_site' ? 'onsite' : match.job.work_mode}`)}
              </p>
            </div>
          )}
          {match.job.employment_type && (
            <div>
              <p className="font-medium text-neutral-500">{t('jobs.fields.employmentType')}</p>
              <p className="mt-1 text-neutral-900">{t(`jobs.employmentType.${match.job.employment_type}`)}</p>
            </div>
          )}
          {match.job.experience_level && (
            <div>
              <p className="font-medium text-neutral-500">{t('jobs.fields.experienceLevel')}</p>
              <p className="mt-1 text-neutral-900">{t(`jobs.experienceLevel.${match.job.experience_level}`)}</p>
            </div>
          )}
          {(match.job.salary_min || match.job.salary_max) && (
            <div className="col-span-2">
              <p className="font-medium text-neutral-500">{t('jobs.fields.salary')}</p>
              <p className="mt-1 text-neutral-900">
                {formatSalary(match.job.salary_min, match.job.salary_max, match.job.salary_currency)}
              </p>
            </div>
          )}
          {match.job.posted_at && (
            <div className="col-span-2">
              <p className="font-medium text-neutral-500">{t('jobs.fields.postedAt')}</p>
              <p className="mt-1 text-neutral-900">{formatDate(match.job.posted_at)}</p>
            </div>
          )}
        </div>

        {/* Match Summary */}
        {match.summary && (
          <div className="rounded-lg bg-neutral-50 p-4">
            <h4 className="font-semibold text-neutral-900">{t('matches.detail.summary')}</h4>
            <p className="mt-2 text-neutral-700">{match.summary}</p>
          </div>
        )}

        {/* Strengths */}
        {match.strengths.length > 0 && (
          <div>
            <h4 className="font-semibold text-neutral-900">{t('matches.detail.strengths')}</h4>
            <ul className="mt-2 space-y-1">
              {match.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-success-700">
                  <svg className="h-5 w-5 text-success-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {match.risks.length > 0 && (
          <div>
            <h4 className="font-semibold text-neutral-900">{t('matches.detail.risks')}</h4>
            <ul className="mt-2 space-y-1">
              {match.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-warning-700">
                  <svg className="h-5 w-5 text-warning-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills Match */}
        <div className="grid grid-cols-2 gap-6">
          {/* Matched Skills */}
          {match.matched_skills.length > 0 && (
            <div>
              <h4 className="font-semibold text-neutral-900">{t('matches.skills.matched')}</h4>
              <div className="mt-2 flex flex-wrap gap-1">
                {match.matched_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-success-50 px-2 py-1 text-xs font-medium text-success-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {match.missing_skills.length > 0 && (
            <div>
              <h4 className="font-semibold text-neutral-900">{t('matches.skills.missing')}</h4>
              <div className="mt-2 flex flex-wrap gap-1">
                {match.missing_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-warning-50 px-2 py-1 text-xs font-medium text-warning-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
