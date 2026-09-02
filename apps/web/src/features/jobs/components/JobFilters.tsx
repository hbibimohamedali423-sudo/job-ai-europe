import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectTrigger } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import type { JobSearchParams, WorkMode, EmploymentType, ExperienceLevel } from '@/types/job'

interface JobFiltersProps {
  isOpen: boolean
  onClose: () => void
  params: JobSearchParams
  onApply: (params: Partial<JobSearchParams>) => void
}

export function JobFilters({ isOpen, onClose, params, onApply }: JobFiltersProps) {
  const { t } = useTranslation()
  const [localParams, setLocalParams] = useState<Partial<JobSearchParams>>(params)

  const handleApply = () => {
    onApply(localParams)
    onClose()
  }

  const handleReset = () => {
    const resetParams: Partial<JobSearchParams> = {
      work_mode: undefined,
      employment_type: undefined,
      experience_level: undefined,
      salary_min: undefined,
      salary_max: undefined,
      country: undefined,
      city: undefined,
    }
    setLocalParams(resetParams)
  }

  const handleWorkModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setLocalParams({
      ...localParams,
      work_mode: value === 'all' ? undefined : (value as WorkMode),
    })
  }

  const handleEmploymentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setLocalParams({
      ...localParams,
      employment_type: value === 'all' ? undefined : (value as EmploymentType),
    })
  }

  const handleExperienceLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setLocalParams({
      ...localParams,
      experience_level: value === 'all' ? undefined : (value as ExperienceLevel),
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('jobs.filters.title')}
      footer={
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            {t('jobs.filters.reset')}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleApply}>{t('jobs.filters.apply')}</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">{t('jobs.filters.country')}</Label>
          <Input
            id="country"
            value={localParams.country || ''}
            onChange={(e) => setLocalParams({ ...localParams, country: e.target.value || undefined })}
            placeholder={t('jobs.filters.countryPlaceholder')}
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">{t('jobs.filters.city')}</Label>
          <Input
            id="city"
            value={localParams.city || ''}
            onChange={(e) => setLocalParams({ ...localParams, city: e.target.value || undefined })}
            placeholder={t('jobs.filters.cityPlaceholder')}
          />
        </div>

        {/* Work Mode */}
        <div className="space-y-2">
          <Label htmlFor="work_mode">{t('jobs.filters.workMode')}</Label>
          <Select
            id="work_mode"
            value={localParams.work_mode || 'all'}
            onChange={handleWorkModeChange}
          >
            <SelectTrigger>
              <option value="all">{t('jobs.filters.allWorkModes')}</option>
              <option value="remote">{t('jobs.workMode.remote')}</option>
              <option value="hybrid">{t('jobs.workMode.hybrid')}</option>
              <option value="on_site">{t('jobs.workMode.onSite')}</option>
            </SelectTrigger>
          </Select>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <Label htmlFor="employment_type">{t('jobs.filters.employmentType')}</Label>
          <Select
            id="employment_type"
            value={localParams.employment_type || 'all'}
            onChange={handleEmploymentTypeChange}
          >
            <SelectTrigger>
              <option value="all">{t('jobs.filters.allEmploymentTypes')}</option>
              <option value="full_time">{t('jobs.employmentType.fullTime')}</option>
              <option value="part_time">{t('jobs.employmentType.partTime')}</option>
              <option value="contract">{t('jobs.employmentType.contract')}</option>
              <option value="internship">{t('jobs.employmentType.internship')}</option>
              <option value="temporary">{t('jobs.employmentType.temporary')}</option>
            </SelectTrigger>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label htmlFor="experience_level">{t('jobs.filters.experienceLevel')}</Label>
          <Select
            id="experience_level"
            value={localParams.experience_level || 'all'}
            onChange={handleExperienceLevelChange}
          >
            <SelectTrigger>
              <option value="all">{t('jobs.filters.allLevels')}</option>
              <option value="entry">{t('jobs.experienceLevel.entry')}</option>
              <option value="mid">{t('jobs.experienceLevel.mid')}</option>
              <option value="senior">{t('jobs.experienceLevel.senior')}</option>
              <option value="lead">{t('jobs.experienceLevel.lead')}</option>
              <option value="executive">{t('jobs.experienceLevel.executive')}</option>
            </SelectTrigger>
          </Select>
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label>{t('jobs.filters.salaryRange')}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder={t('jobs.filters.minSalary')}
              value={localParams.salary_min || ''}
              onChange={(e) =>
                setLocalParams({
                  ...localParams,
                  salary_min: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
            <Input
              type="number"
              placeholder={t('jobs.filters.maxSalary')}
              value={localParams.salary_max || ''}
              onChange={(e) =>
                setLocalParams({
                  ...localParams,
                  salary_max: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
