import { create } from 'zustand'
import { matchingService } from '@/services/matching'
import type { MatchWithJob, MatchScoreBreakdown } from '@/types/matching'

interface MatchingState {
  matches: MatchWithJob[]
  currentMatch: MatchWithJob | null
  currentScoreBreakdown: MatchScoreBreakdown | null
  loading: boolean
  calculating: boolean
  error: string | null

  // Actions
  fetchMatches: (userId: string) => Promise<void>
  fetchMatch: (matchId: string) => Promise<void>
  calculateMatch: (userId: string, jobId: string) => Promise<void>
  calculateAllMatches: (userId: string) => Promise<void>
  deleteMatch: (matchId: string) => Promise<void>
  clearCurrentMatch: () => void
  clearError: () => void
}

export const useMatchingStore = create<MatchingState>((set, get) => ({
  matches: [],
  currentMatch: null,
  currentScoreBreakdown: null,
  loading: false,
  calculating: false,
  error: null,

  fetchMatches: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const matches = await matchingService.getMatches(userId)
      set({ matches, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch matches',
        loading: false
      })
    }
  },

  fetchMatch: async (matchId: string) => {
    set({ loading: true, error: null })
    try {
      const match = await matchingService.getMatch(matchId)
      set({ currentMatch: match, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch match',
        loading: false
      })
    }
  },

  calculateMatch: async (userId: string, jobId: string) => {
    set({ calculating: true, error: null })
    try {
      const result = await matchingService.calculateMatch(userId, jobId)
      
      // Update current match and breakdown
      set({
        currentMatch: result.match as MatchWithJob,
        currentScoreBreakdown: result.scoreBreakdown,
        calculating: false
      })
      
      // Refresh matches list
      await get().fetchMatches(userId)
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to calculate match',
        calculating: false
      })
    }
  },

  calculateAllMatches: async (userId: string) => {
    set({ calculating: true, error: null })
    try {
      const result = await matchingService.calculateAllMatches(userId)
      
      // Refresh matches list
      await get().fetchMatches(userId)
      
      set({ calculating: false })
      
      if (result.jobsWithoutMatch.length > 0) {
        console.warn(`Could not calculate matches for ${result.jobsWithoutMatch.length} jobs`)
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to calculate matches',
        calculating: false
      })
    }
  },

  deleteMatch: async (matchId: string) => {
    set({ loading: true, error: null })
    try {
      await matchingService.deleteMatch(matchId)
      
      // Remove from matches list
      set(state => ({
        matches: state.matches.filter(m => m.id !== matchId),
        currentMatch: state.currentMatch?.id === matchId ? null : state.currentMatch,
        loading: false
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete match',
        loading: false
      })
    }
  },

  clearCurrentMatch: () => {
    set({ currentMatch: null, currentScoreBreakdown: null })
  },

  clearError: () => {
    set({ error: null })
  },
}))
