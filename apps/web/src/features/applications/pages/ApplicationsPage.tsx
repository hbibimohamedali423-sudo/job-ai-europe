import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useApplicationStore } from '@/stores/application'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/Button'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'
import { ApplicationCard, ApplicationDetailModal } from '../components'
import type { ApplicationStatus } from '@/types/application'

const STATUS_OPTIONS: (ApplicationStatus | 'all')[] = [
  'all',
  'draft',
  'applied',
  'pending',
  'interview',
  'rejected',
  'accepted',
]

export function ApplicationsPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  
  const {
    applications,
    currentApplication,
    statusCounts,
    loading,
    error,
    selectedStatus,
    fetchApplications,
    fetchApplication,
    setSelectedStatus,
    clearCurrentApplication,
  } = useApplicationStore()

  const [detailModalOpen, setDetailModalOpen] = useState(false)

  // Initial load
  useEffect(() => {
    if (user) {
      fetchApplications(user.id)
    }
  }, [user])

  const handleApplicationClick = useCallback(async (applicationId: string) => {
    await fetchApplication(applicationId)
    setDetailModalOpen(true)
  }, [fetchApplication])

  const handleCloseDetail = useCallback(() => {
    setDetailModalOpen(false)
    clearCurrentApplication()
  }, [clearCurrentApplication])

  const filteredApplications = selectedStatus === 'all'
    ? applications
    : applications.filter(app => app.status === selectedStatus)

  if (!user) {
    return (
      <div className="container-page py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-neutral-900">{t('applications.authRequired.title')}</h2>
          <p className="mt-2 text-neutral-600">{t('applications.authRequired.message')}</p>
          <Button asChild className="mt-4">
            <Link to="/login">{t('nav.login')}</Link>
          </Button>
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
            <h1 className="text-3xl font-bold text-neutral-900">{t('applications.title')}</h1>
            <p className="mt-2 text-neutral-600">{t('applications.subtitle')}</p>
          </div>
          <Button asChild>
            <Link to="/jobs">{t('applications.browseJobs')}</Link>
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-error-50 p-4 text-error-600">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && applications.length === 0 ? (
          <LoadingScreen />
        ) : (
          <>
            {/* Stats */}
            {applications.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                <div className="rounded-lg bg-white p-4 shadow-sm border border-neutral-200">
                  <p className="text-sm text-neutral-600">{t('applications.stats.total')}</p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">{statusCounts.total}</p>
                </div>
                {(['draft', 'applied', 'pending', 'interview', 'rejected', 'accepted'] as ApplicationStatus[]).map(status => (
                  <div 
                    key={status}
                    className={`rounded-lg bg-white p-4 shadow-sm border cursor-pointer transition-colors ${
                      selectedStatus === status ? 'border-primary-300 bg-primary-50' : 'border-neutral-200'
                    }`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    <p className="text-sm text-neutral-600">{t(`applications.status.${status}`)}</p>
                    <p className="mt-1 text-2xl font-bold text-neutral-900">{statusCounts[status]}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {status === 'all' ? t('applications.status.all') : t(`applications.status.${status}`)}
                </button>
              ))}
            </div>

            {/* Applications Grid */}
            {filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onClick={() => handleApplicationClick(application.id)}
                  />
                ))}
              </div>
            ) : applications.length === 0 ? (
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {t('applications.empty.title')}
                </h3>
                <p className="mt-2 text-neutral-600 max-w-md">
                  {t('applications.empty.message')}
                </p>
                <Button asChild className="mt-4">
                  <Link to="/jobs">{t('applications.browseJobs')}</Link>
                </Button>
              </div>
            ) : (
              /* Filtered Empty State */
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
                  {t('applications.empty.filtered.title')}
                </h3>
                <p className="mt-2 text-neutral-600 max-w-md">
                  {t('applications.empty.filtered.message')}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSelectedStatus('all')}
                >
                  {t('applications.empty.filtered.clear')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        isOpen={detailModalOpen}
        onClose={handleCloseDetail}
        application={currentApplication}
      />
    </div>
  )
}
