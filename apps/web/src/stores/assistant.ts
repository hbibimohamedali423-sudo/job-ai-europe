import { create } from 'zustand'
import { assistantService, aiResponseService } from '@/services/assistant'
import type { AssistantMessage, AssistantContext } from '@/types/assistant'

interface AssistantState {
  messages: AssistantMessage[]
  loading: boolean
  error: string | null
  currentContext: AssistantContext | undefined

  // Actions
  sendMessage: (userId: string, content: string) => Promise<void>
  setContext: (context: AssistantContext) => void
  clearContext: () => void
  clearMessages: () => void
  clearError: () => void
  loadContextForJob: (jobId: string) => Promise<void>
  loadContextForMatch: (matchId: string) => Promise<void>
  loadContextForApplication: (applicationId: string) => Promise<void>
  loadContextForProfile: (userId: string) => Promise<void>
}

let messageIdCounter = 0

export const useAssistantStore = create<AssistantState>((set, get) => ({
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI career assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
  currentContext: undefined,

  sendMessage: async (userId: string, content: string) => {
    // Add user message
    const userMessage: AssistantMessage = {
      id: `user-${++messageIdCounter}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      context: get().currentContext,
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      loading: true,
      error: null,
    }))

    try {
      // Determine intent
      const intent = assistantService.determineIntent(content)

      // Build context based on intent
      let enrichedContext = get().currentContext
      if (enrichedContext) {
        // Context already loaded, use it
      } else if (intent !== 'general' && intent !== 'career_guidance' && intent !== 'translation') {
        // Load profile context for most intents
        const profileContext = await assistantService.buildProfileContext(userId)
        enrichedContext = {
          type: 'profile',
          entityData: profileContext as unknown as Record<string, unknown>,
        }
      }

      // Generate AI response
      const response = await aiResponseService.generateResponse(content, {
        profile: enrichedContext?.entityData as Record<string, unknown>,
      })

      // Add assistant message
      const assistantMessage: AssistantMessage = {
        id: `assistant-${++messageIdCounter}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        context: enrichedContext,
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get response',
        loading: false,
      })
    }
  },

  setContext: (context: AssistantContext) => {
    set({ currentContext: context })
  },

  clearContext: () => {
    set({ currentContext: undefined })
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hello! I'm your AI career assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ],
    })
  },

  clearError: () => {
    set({ error: null })
  },

  loadContextForJob: async (jobId: string) => {
    set({ loading: true, error: null })
    try {
      const jobContext = await assistantService.buildJobContext(jobId)
      set({
        currentContext: {
          type: 'job',
          entityId: jobId,
          entityData: jobContext as unknown as Record<string, unknown>,
        },
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load job context',
        loading: false,
      })
    }
  },

  loadContextForMatch: async (matchId: string) => {
    set({ loading: true, error: null })
    try {
      const matchContext = await assistantService.buildMatchContext(matchId)
      if (matchContext) {
        set({
          currentContext: {
            type: 'match',
            entityId: matchId,
            entityData: matchContext as unknown as Record<string, unknown>,
          },
          loading: false,
        })
      } else {
        set({
          error: 'Match not found',
          loading: false,
        })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load match context',
        loading: false,
      })
    }
  },

  loadContextForApplication: async (applicationId: string) => {
    set({ loading: true, error: null })
    try {
      const appContext = await assistantService.buildApplicationContext(applicationId)
      if (appContext) {
        set({
          currentContext: {
            type: 'application',
            entityId: applicationId,
            entityData: appContext as unknown as Record<string, unknown>,
          },
          loading: false,
        })
      } else {
        set({
          error: 'Application not found',
          loading: false,
        })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load application context',
        loading: false,
      })
    }
  },

  loadContextForProfile: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const profileContext = await assistantService.buildProfileContext(userId)
      set({
        currentContext: {
          type: 'profile',
          entityData: profileContext as unknown as Record<string, unknown>,
        },
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load profile context',
        loading: false,
      })
    }
  },
}))
