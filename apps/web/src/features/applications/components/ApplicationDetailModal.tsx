import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Label } from '@/components/ui/Label'
import { useApplicationStore } from '@/stores/application'
import type { ApplicationWithDetails, ApplicationStatus, ApplicationOutputType } from '@/types/application'

interface ApplicationDetailModalProps {
  isOpen: boolean
  onClose: () => void
  application: ApplicationWithDetails | null
}

type TabType = 'details' | 'cv' | 'cover_letter' | 'application_message'

export function ApplicationDetailModal({ isOpen, onClose, application }: ApplicationDetailModalProps) {
  const { t } = useTranslation()
  const { updateApplication, markAsApplied, generateContent, saveGeneratedContent, approveContent, deleteApplication, generating } = useApplicationStore()
  
  const [activeTab, setActiveTab] = useState<TabType>('details')
  const [notes, setNotes] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('draft')
  const [editingContent, setEditingContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)

  // Reset state when application changes
  useState(() => {
    if (application) {
      setNotes(application.notes || '')
      setSelectedStatus(application.status)
    }
  })

  if (!application) return null

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

  const handleSaveNotes = async () => {
    await updateApplication(application.id, { notes })
  }

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    setSelectedStatus(newStatus)
    await updateApplication(application.id, { status: newStatus })
    if (newStatus === 'applied' && !application.applied_at) {
      await markAsApplied(application.id)
    }
  }

  const handleGenerateContent = async (type: ApplicationOutputType) => {
    const content = await generateContent(application.user_id, application.job_id, type)
    await saveGeneratedContent(application.id, type, content)
  }

  const handleSaveEditedContent = async (type: ApplicationOutputType) => {
    await saveGeneratedContent(application.id, type, editingContent)
    setIsEditing(false)
  }

  const handleApproveContent = async (outputId: string) => {
    await approveContent(outputId)
  }

  const handleDelete = async () => {
    if (confirm(t('applications.confirmDelete'))) {
      await deleteApplication(application.id)
      onClose()
    }
  }

  const getOutputForType = (type: ApplicationOutputType) => {
    return application.outputs.find(o => o.type === type)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {/* Status Section */}
            <div>
              <Label className="text-base font-semibold">{t('applications.status.label')}</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {(['draft', 'applied', 'pending', 'interview', 'rejected', 'accepted'] as ApplicationStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedStatus === status
                        ? getStatusColor(status)
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {t(`applications.status.${status}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <Label className="text-base font-semibold">{t('applications.notes.label')}</Label>
              <div className="mt-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={handleSaveNotes}
                  placeholder={t('applications.notes.placeholder')}
                  className="w-full rounded-lg border border-neutral-300 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  rows={4}
                />
              </div>
            </div>

            {/* Job Info */}
            <div className="rounded-lg bg-neutral-50 p-4">
              <h4 className="font-semibold text-neutral-900">{application.job.title}</h4>
              <p className="text-sm text-neutral-600">{application.job.company}</p>
              {application.job.location && (
                <p className="mt-1 text-sm text-neutral-500">{application.job.location}</p>
              )}
              <a
                href={`/jobs/${application.job.id}`}
                className="mt-2 inline-block text-sm text-primary-600 hover:underline"
              >
                {t('applications.viewJob')}
              </a>
            </div>
          </div>
        )

      case 'cv':
      case 'cover_letter':
      case 'application_message':
        const output = getOutputForType(activeTab)
        const content = output?.content || ''
        const isApproved = output?.user_approved || false
        
        return (
          <div className="space-y-4">
            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {output && (
                  <Badge variant={isApproved ? 'success' : 'warning'}>
                    {isApproved ? t('applications.approved') : t('applications.pendingApproval')}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {!output ? (
                  <Button
                    onClick={() => handleGenerateContent(activeTab)}
                    disabled={generating}
                    size="sm"
                  >
                    {generating ? t('applications.generating') : t('applications.generate')}
                  </Button>
                ) : (
                  <>
                    {!isApproved && (
                      <Button
                        onClick={() => handleGenerateContent(activeTab)}
                        disabled={generating}
                        variant="outline"
                        size="sm"
                      >
                        {t('applications.regenerate')}
                      </Button>
                    )}
                    {isEditing ? (
                      <>
                        <Button
                          onClick={() => handleSaveEditedContent(activeTab)}
                          size="sm"
                        >
                          {t('applications.save')}
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          size="sm"
                        >
                          {t('applications.cancel')}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setEditingContent(content)
                          setIsEditing(true)
                        }}
                        variant="outline"
                        size="sm"
                      >
                        {t('applications.edit')}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            {isEditing ? (
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 p-4 font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                rows={20}
              />
            ) : content ? (
              <pre className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-4 text-sm font-mono">
                {content}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-neutral-600">
                  {t('applications.noContent')}
                </p>
                <Button
                  onClick={() => handleGenerateContent(activeTab)}
                  disabled={generating}
                  className="mt-4"
                >
                  {generating ? t('applications.generating') : t('applications.generateContent')}
                </Button>
              </div>
            )}

            {/* Approve button */}
            {output && !isApproved && !isEditing && (
              <div className="flex justify-end">
                <Button onClick={() => handleApproveContent(output.id)}>
                  {t('applications.approveContent')}
                </Button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'details', label: t('applications.tabs.details') },
    { id: 'cv', label: t('applications.tabs.cv') },
    { id: 'cover_letter', label: t('applications.tabs.coverLetter') },
    { id: 'application_message', label: t('applications.tabs.message') },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={application.job.title}
    >
      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="py-4">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
        <Button
          onClick={handleDelete}
          variant="ghost"
          className="text-error-600 hover:text-error-700 hover:bg-error-50"
        >
          {t('applications.delete')}
        </Button>
        <Button onClick={onClose} variant="outline">
          {t('applications.close')}
        </Button>
      </div>
    </Modal>
  )
}
