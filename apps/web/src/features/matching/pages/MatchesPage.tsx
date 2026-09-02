import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useMatchingStore } from '@/stores/matching'
import { useAuthStore } from '@/stores/auth'
import { useJobStore } from '@/stores/job'
import { Button } from '@/components/ui/Button'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'
import { MatchCard } from '../components/MatchCard'
import { MatchDetailModal } from '../components/MatchDetailModal'
import type { MatchWithJob } from '@/types/matching'

export function MatchesPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  
  const {
    matches,
    loading,
    calculating,
    error,
    fetchMatches,
    calculateAllMatches,
  } = useMatchingStore()

  const { jobs, searchJobs } = useJobStore()

  const [selectedMatch, setSelectedMatch] = useState<MatchWithJob | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [calculatingMatchIds, setCalculatingMatchIds] = useState<Set<string>>(new Set())

  // Initial load
  useEffect(() => {
    if (user) {
      fetchMatches(user.id)
    }
  }, [user])

  // Also ensure we have jobs loaded
  useEffect(() => {
    if (jobs.length === 0) {
      searchJobs()
    }
  }, [])

  const handleMatchClick = useCallback((match: MatchWithJob) => {
    setSelectedMatch(match)
    setDetailModalOpen(true)
  }, [])

  const handleRefreshMatches = useCallback(async () => {
    if (!user) return
    setCalculatingMatchIds(new Set(matches.map(m => m.job_id)))
    await calculateAllMatches(user.id)
    setCalculatingMatchIds(new Set())
  }, [user, matches, calculateAllMatches])

  const handleCloseDetail = useCallback(() => {
    setDetailModalOpen(false)
    setSelectedMatch(null)
  }, [])

  if (!user) {
    return (
      <div className="container-page py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-neutral-900">{t('matches.authRequired.title')}</h2>
          <p className="mt-2 text-neutral-600">{t('matches.authRequired.message')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{t('matches.title')}</h1>
            <p className="mt-2 text-neutral-600">{t('matches.subtitle')}</p>
          </div>
          <Button
            onClick={handleRefreshMatches}
            disabled={calculating || jobs.length === 0}
            variant="outline"
          >
            {calculating ? t('matches.refreshing') : t('matches.refresh')}
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-error-50 p-4 text-error-600">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && matches.length === 0 ? (
          <LoadingScreen />
        ) : (
          <>
            {/* Stats */}
            {matches.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-4 shadow-sm border border-neutral-200">
                  <p className="text-sm text-neutral-600">{t('matches.stats.total')}</p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">{matches.length}</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm border border-neutral-200">
                  <p className="text-sm text-neutral-600">{t('matches.stats.highMatch')}</p>
                  <p className="mt-1 text-2xl font-bold text-success-600">
                    {matches.filter(m => m.score >= 70).length}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm border border-neutral-200">
                  <p className="text-sm text-neutral-600">{t('matches.stats.avgScore')}</p>
                  <p className="mt-1 text-2xl font-bold text-primary-600">
                    {Math.round(matches.reduce((sum, m) => sum + m.score, 0) / matches.length)}%
                  </p>
                </div>
              </div>
            )}

            {/* Matches Grid */}
            {matches.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() => handleMatchClick(match)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-neutral-100 p-4">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {t('matches.empty.title')}
                </h3>
                <p className="mt-2 text-neutral-600 max-w-md">
                  {t('matches.empty.message')}
                </p>
                {jobs.length > 0 && (
                  <Button
                    className="mt-4"
                    onClick={handleRefreshMatches}
                    disabled={calculating}
                  >
                    {t('matches.empty.action')}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Match Detail Modal */}
      <MatchDetailModal
        isOpen={detailModalOpen}
        onClose={handleCloseDetail}
        match={selectedMatch}
      />
    </div>
  )
}
