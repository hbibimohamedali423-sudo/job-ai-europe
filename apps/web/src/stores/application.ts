import { create } from 'zustand'
import {
  applicationService,
  applicationOutputService,
  contentGenerationService,
} from '@/services/application'
import type {
  ApplicationWithJob,
  ApplicationWithDetails,
  ApplicationStatus,
  ApplicationOutputType,
  ApplicationStatusCounts,
  UpdateApplicationParams,
} from '@/types/application'

interface ApplicationState {
  applications: ApplicationWithJob[]
  currentApplication: ApplicationWithDetails | null
  statusCounts: ApplicationStatusCounts
  loading: boolean
  generating: boolean
  error: string | null
  selectedStatus: ApplicationStatus | 'all'

  // Actions
  fetchApplications: (userId: string) => Promise<void>
  fetchApplication: (applicationId: string) => Promise<void>
  fetchStatusCounts: (userId: string) => Promise<void>
  createApplication: (userId: string, jobId: string) => Promise<ApplicationWithJob>
  updateApplication: (applicationId: string, params: UpdateApplicationParams) => Promise<void>
  deleteApplication: (applicationId: string) => Promise<void>
  markAsApplied: (applicationId: string) => Promise<void>
  
  // Content generation
  generateContent: (userId: string, jobId: string, type: ApplicationOutputType) => Promise<string>
  saveGeneratedContent: (applicationId: string, type: ApplicationOutputType, content: string) => Promise<void>
  approveContent: (outputId: string) => Promise<void>
  
  // UI state
  setSelectedStatus: (status: ApplicationStatus | 'all') => void
  clearCurrentApplication: () => void
  clearError: () => void
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  currentApplication: null,
  statusCounts: {
    draft: 0,
    applied: 0,
    pending: 0,
    interview: 0,
    rejected: 0,
    accepted: 0,
    total: 0,
  },
  loading: false,
  generating: false,
  error: null,
  selectedStatus: 'all',

  fetchApplications: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const applications = await applicationService.getApplications(userId)
      set({ applications, loading: false })
      // Also refresh status counts
      await get().fetchStatusCounts(userId)
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch applications',
        loading: false,
      })
    }
  },

  fetchApplication: async (applicationId: string) => {
    set({ loading: true, error: null })
    try {
      const application = await applicationService.getApplication(applicationId)
      set({ currentApplication: application, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch application',
        loading: false,
      })
    }
  },

  fetchStatusCounts: async (userId: string) => {
    try {
      const counts = await applicationService.getStatusCounts(userId)
      set({ statusCounts: counts })
    } catch (error) {
      console.error('Failed to fetch status counts:', error)
    }
  },

  createApplication: async (userId: string, jobId: string) => {
    set({ loading: true, error: null })
    try {
      const application = await applicationService.createApplication({ userId, jobId })
      
      // Fetch full application with job details
      const fullApplication = await applicationService.getApplication(application.id)
      
      if (fullApplication) {
        set(state => ({
          applications: [fullApplication, ...state.applications],
          currentApplication: fullApplication,
          loading: false,
        }))
        await get().fetchStatusCounts(userId)
        return fullApplication
      }
      
      set({ loading: false })
      throw new Error('Failed to fetch created application')
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create application',
        loading: false,
      })
      throw error
    }
  },

  updateApplication: async (applicationId: string, params: UpdateApplicationParams) => {
    set({ loading: true, error: null })
    try {
      await applicationService.updateApplication(applicationId, params)
      
      // Refresh current application if it matches
      const { currentApplication } = get()
      if (currentApplication?.id === applicationId) {
        await get().fetchApplication(applicationId)
      }
      
      // Refresh applications list (need userId - we'll refetch all)
      // For now, just update the loading state
      set({ loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update application',
        loading: false,
      })
      throw error
    }
  },

  deleteApplication: async (applicationId: string) => {
    set({ loading: true, error: null })
    try {
      await applicationService.deleteApplication(applicationId)
      
      set(state => ({
        applications: state.applications.filter(a => a.id !== applicationId),
        currentApplication: state.currentApplication?.id === applicationId 
          ? null 
          : state.currentApplication,
        loading: false,
      }))
      
      // Refresh status counts
      const { currentApplication } = get()
      if (currentApplication) {
        await get().fetchStatusCounts(currentApplication.user_id)
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete application',
        loading: false,
      })
      throw error
    }
  },

  markAsApplied: async (applicationId: string) => {
    set({ loading: true, error: null })
    try {
      await applicationService.markAsApplied(applicationId)
      
      // Refresh current application if it matches
      const { currentApplication } = get()
      if (currentApplication?.id === applicationId) {
        await get().fetchApplication(applicationId)
      }
      
      set({ loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark as applied',
        loading: false,
      })
      throw error
    }
  },

  generateContent: async (userId: string, jobId: string, type: ApplicationOutputType) => {
    set({ generating: true, error: null })
    try {
      const content = await contentGenerationService.generate(userId, jobId, type)
      set({ generating: false })
      return content
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to generate content',
        generating: false,
      })
      throw error
    }
  },

  saveGeneratedContent: async (applicationId: string, type: ApplicationOutputType, content: string) => {
    set({ loading: true, error: null })
    try {
      await applicationOutputService.upsertOutput({
        applicationId,
        type,
        content,
        aiGenerated: true,
      })
      
      // Refresh current application
      await get().fetchApplication(applicationId)
      
      set({ loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save content',
        loading: false,
      })
      throw error
    }
  },

  approveContent: async (outputId: string) => {
    set({ loading: true, error: null })
    try {
      await applicationOutputService.approveOutput(outputId)
      
      // Refresh current application
      const { currentApplication } = get()
      if (currentApplication) {
        await get().fetchApplication(currentApplication.id)
      }
      
      set({ loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to approve content',
        loading: false,
      })
      throw error
    }
  },

  setSelectedStatus: (status: ApplicationStatus | 'all') => {
    set({ selectedStatus: status })
  },

  clearCurrentApplication: () => {
    set({ currentApplication: null })
  },

  clearError: () => {
    set({ error: null })
  },
}))
