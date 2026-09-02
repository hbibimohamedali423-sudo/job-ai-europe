import { create } from 'zustand'
import { jobService, savedJobService } from '@/services/job'
import type { Job, JobSearchParams, SavedJob } from '@/types/job'

interface JobState {
  // Search results
  jobs: Job[]
  totalJobs: number
  currentPage: number
  totalPages: number
  isLoading: boolean
  error: string | null

  // Filters
  searchParams: JobSearchParams

  // Selected job
  selectedJob: Job | null
  selectedJobSkills: Job['id'] extends string ? JobSkill[] : never

  // Saved jobs
  savedJobs: SavedJob[]
  savedJobIds: Set<string>

  // Actions
  searchJobs: (params?: Partial<JobSearchParams>) => Promise<void>
  loadMoreJobs: () => Promise<void>
  setSearchParams: (params: Partial<JobSearchParams>) => void
  clearSearchParams: () => void

  selectJob: (jobId: string) => Promise<void>
  clearSelectedJob: () => void

  loadSavedJobs: (userId: string) => Promise<void>
  saveJob: (userId: string, jobId: string) => Promise<void>
  unsaveJob: (userId: string, jobId: string) => Promise<void>
  isJobSaved: (jobId: string) => boolean

  clearError: () => void
}

// Need to import JobSkill type properly
import type { JobSkill } from '@/types/job'

export const useJobStore = create<JobState>((set, get) => ({
  // Initial state
  jobs: [],
  totalJobs: 0,
  currentPage: 1,
  totalPages: 0,
  isLoading: false,
  error: null,
  searchParams: {
    page: 1,
    limit: 20,
    sort_by: 'created_at',
    sort_order: 'desc',
  },
  selectedJob: null,
  selectedJobSkills: [] as JobSkill[],
  savedJobs: [],
  savedJobIds: new Set(),

  // Search jobs
  searchJobs: async (params?: Partial<JobSearchParams>) => {
    const currentParams = get().searchParams
    const newParams = { ...currentParams, ...params, page: 1 }

    set({ isLoading: true, error: null, searchParams: newParams })

    try {
      const result = await jobService.searchJobs(newParams)
      set({
        jobs: result.jobs,
        totalJobs: result.total,
        currentPage: result.page,
        totalPages: result.total_pages,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search jobs',
        isLoading: false,
      })
    }
  },

  // Load more jobs (pagination)
  loadMoreJobs: async () => {
    const { searchParams, currentPage, totalPages, jobs, isLoading } = get()

    if (isLoading || currentPage >= totalPages) return

    const nextPage = currentPage + 1
    const newParams = { ...searchParams, page: nextPage }

    set({ isLoading: true })

    try {
      const result = await jobService.searchJobs(newParams)
      set({
        jobs: [...jobs, ...result.jobs],
        currentPage: result.page,
        totalPages: result.total_pages,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load more jobs',
        isLoading: false,
      })
    }
  },

  // Set search params without triggering search
  setSearchParams: (params: Partial<JobSearchParams>) => {
    const currentParams = get().searchParams
    set({ searchParams: { ...currentParams, ...params } })
  },

  // Clear search params
  clearSearchParams: () => {
    set({
      searchParams: {
        page: 1,
        limit: 20,
        sort_by: 'created_at',
        sort_order: 'desc',
      },
    })
  },

  // Select a job and load its details
  selectJob: async (jobId: string) => {
    set({ isLoading: true, error: null })

    try {
      const result = await jobService.getJobWithSkills(jobId)
      if (result) {
        set({
          selectedJob: result.job,
          selectedJobSkills: result.skills,
          isLoading: false,
        })
      } else {
        set({ error: 'Job not found', isLoading: false })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load job',
        isLoading: false,
      })
    }
  },

  // Clear selected job
  clearSelectedJob: () => {
    set({ selectedJob: null, selectedJobSkills: [] })
  },

  // Load user's saved jobs
  loadSavedJobs: async (userId: string) => {
    try {
      const savedJobs = await savedJobService.getSavedJobs(userId)
      const savedJobIds = new Set(savedJobs.map((sj) => sj.job_id))
      set({ savedJobs, savedJobIds })
    } catch (error) {
      console.error('Failed to load saved jobs:', error)
    }
  },

  // Save a job
  saveJob: async (userId: string, jobId: string) => {
    try {
      const savedJob = await savedJobService.saveJob(userId, jobId)
      const { savedJobs, savedJobIds } = get()
      set({
        savedJobs: [savedJob, ...savedJobs],
        savedJobIds: new Set([...savedJobIds, jobId]),
      })
    } catch (error) {
      throw error
    }
  },

  // Unsave a job
  unsaveJob: async (userId: string, jobId: string) => {
    try {
      await savedJobService.removeSavedJob(userId, jobId)
      const { savedJobs, savedJobIds } = get()
      const newSavedJobIds = new Set(savedJobIds)
      newSavedJobIds.delete(jobId)
      set({
        savedJobs: savedJobs.filter((sj) => sj.job_id !== jobId),
        savedJobIds: newSavedJobIds,
      })
    } catch (error) {
      throw error
    }
  },

  // Check if job is saved
  isJobSaved: (jobId: string) => {
    return get().savedJobIds.has(jobId)
  },

  // Clear error
  clearError: () => set({ error: null }),
}))
