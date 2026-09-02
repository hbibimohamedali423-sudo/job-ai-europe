import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useJobStore } from '@/stores/job'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'
import { JobCard, JobFilters } from '../components'
import type { JobSearchParams } from '@/types/job'

export function JobsPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  
  const {
    jobs,
    totalJobs,
    isLoading,
    error,
    searchParams,
    savedJobIds,
    searchJobs,
    loadSavedJobs,
    saveJob,
    unsaveJob,
  } = useJobStore()

  const [searchQuery, setSearchQuery] = useState(searchParams.query || '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Initial load
  useEffect(() => {
    searchJobs()
    if (user) {
      loadSavedJobs(user.id)
    }
  }, [user])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== searchParams.query) {
        searchJobs({ query: searchQuery || undefined })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    searchJobs({ query: searchQuery || undefined })
  }, [searchQuery, searchJobs])

  const handleFiltersApply = useCallback((params: Partial<JobSearchParams>) => {
    searchJobs({ ...params, query: searchQuery || undefined })
  }, [searchQuery, searchJobs])

  const handleSaveToggle = useCallback(async (jobId: string, currentlySaved: boolean) => {
    if (!user) return
    try {
      if (currentlySaved) {
        await unsaveJob(user.id, jobId)
      } else {
        await saveJob(user.id, jobId)
      }
    } catch (err) {
      console.error('Failed to toggle save:', err)
    }
  }, [user, saveJob, unsaveJob])

  const hasActiveFilters = 
    searchParams.country ||
    searchParams.city ||
    searchParams.work_mode ||
    searchParams.employment_type ||
    searchParams.experience_level ||
    searchParams.salary_min ||
    searchParams.salary_max

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
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('jobs.title')}</h1>
          <p className="mt-2 text-neutral-600">{t('jobs.subtitle')}</p>
        </div>

        {/* Search and Filters */}
        <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <Input
              placeholder={t('jobs.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline">
            {t('jobs.search.search')}
          </Button>
          <Button
            type="button"
            variant={hasActiveFilters ? 'default' : 'outline'}
            onClick={() => setFiltersOpen(true)}
          >
            {t('jobs.search.filters')}
            {hasActiveFilters && ' *'}
          </Button>
        </form>

        {/* Results count */}
        <p className="text-sm text-neutral-600">
          {t('jobs.search.results', { count: totalJobs })}
        </p>

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-error-50 p-4 text-error-600">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && jobs.length === 0 ? (
          <LoadingScreen />
        ) : (
          <>
            {/* Jobs Grid */}
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.has(job.id)}
                    onSaveToggle={handleSaveToggle}
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {t('jobs.search.noResults')}
                </h3>
                <p className="mt-2 text-neutral-600">{t('jobs.search.adjustFilters')}</p>
              </div>
            )}

            {/* Load More */}
            {jobs.length > 0 && jobs.length < totalJobs && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => useJobStore.getState().loadMoreJobs()}
                  loading={isLoading}
                >
                  {t('jobs.search.loadMore')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filters Modal */}
      <JobFilters
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        params={searchParams}
        onApply={handleFiltersApply}
      />
    </div>
  )
}
