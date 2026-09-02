import { create } from 'zustand'
import { useAuthStore } from '@/stores/auth'
import * as profileService from '@/services/profile'
import type { Profile, Experience, Education, Certification, Language, ProfileSkill, Skill } from '@/services/profile'

interface ProfileState {
  profile: Profile | null
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
  languages: Language[]
  skills: ProfileSkill[]
  allSkills: Skill[]
  loading: boolean
  initialized: boolean
  error: string | null

  // Actions
  initialize: () => Promise<void>
  loadProfile: () => Promise<void>
  loadExperiences: () => Promise<void>
  loadEducation: () => Promise<void>
  loadCertifications: () => Promise<void>
  loadLanguages: () => Promise<void>
  loadSkills: () => Promise<void>
  loadAllSkills: () => Promise<void>
  
  // Profile
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  
  // Experiences
  addExperience: (experience: Omit<Experience, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateExperience: (id: string, updates: Partial<Experience>) => Promise<void>
  deleteExperience: (id: string) => Promise<void>
  
  // Education
  addEducation: (education: Omit<Education, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateEducation: (id: string, updates: Partial<Education>) => Promise<void>
  deleteEducation: (id: string) => Promise<void>
  
  // Certifications
  addCertification: (certification: Omit<Certification, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateCertification: (id: string, updates: Partial<Certification>) => Promise<void>
  deleteCertification: (id: string) => Promise<void>
  
  // Languages
  addLanguage: (language: Omit<Language, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateLanguage: (id: string, updates: Partial<Language>) => Promise<void>
  deleteLanguage: (id: string) => Promise<void>
  
  // Skills
  addSkill: (skillId: string, level?: string, yearsExperience?: number) => Promise<void>
  updateSkill: (skillId: string, level?: string, yearsExperience?: number) => Promise<void>
  removeSkill: (skillId: string) => Promise<void>
  
  // Utilities
  calculateCompletion: () => number
  clearError: () => void
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  experiences: [],
  education: [],
  certifications: [],
  languages: [],
  skills: [],
  allSkills: [],
  loading: false,
  initialized: false,
  error: null,

  initialize: async () => {
    if (get().initialized) return
    
    set({ loading: true, error: null })
    
    await get().loadProfile()
    await get().loadAllSkills()
    
    const { profile } = get()
    if (profile) {
      await Promise.all([
        get().loadExperiences(),
        get().loadEducation(),
        get().loadCertifications(),
        get().loadLanguages(),
        get().loadSkills(),
      ])
    }
    
    set({ loading: false, initialized: true })
  },

  loadProfile: async () => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ error: 'User not authenticated' })
      return
    }

    const { profile, error } = await profileService.getProfile(user.id)
    
    if (error) {
      set({ error })
      return
    }
    
    set({ profile })
  },

  loadExperiences: async () => {
    const { profile } = get()
    if (!profile) return

    const { experiences, error } = await profileService.getExperiences(profile.id)
    
    if (error) {
      set({ error })
      return
    }
    
    set({ experiences })
  },

  loadEducation: async () => {
    const { profile } = get()
    if (!profile) return

    const { education, error } = await profileService.getEducation(profile.id)
    
    if (error) {
      set({ error })
      return
    }
    
    set({ education })
  },

  loadCertifications: async () => {
    const { profile } = get()
    if (!profile) return

    const { certifications, error } = await profileService.getCertifications(profile.id)
    
    if (error) {
      set({ error })
      return
    }
    
    set({ certifications })
  },

  loadLanguages: async () => {
    const { profile } = get()
    if (!profile) return

    const { languages, error } = await profileService.getLanguages(profile.id)
    
    if (error) {
      set({ error })
      return
    }
    
    set({ languages })
  },

  loadSkills: async () => {
    const { profile } = get()
    if (!profile) return

    const { skills, error } = await profileService.getProfileSkills(profile.id)
    
    if (error) {
      set({ error })
      return
    }
    
    set({ skills })
  },

  loadAllSkills: async () => {
    const { skills, error } = await profileService.getAllSkills()
    
    if (error) {
      set({ error })
      return
    }
    
    set({ allSkills: skills })
  },

  updateProfile: async (updates) => {
    const user = useAuthStore.getState().user
    if (!user) return

    set({ loading: true, error: null })

    const { profile, error } = await profileService.updateProfile(user.id, updates)
    
    if (error) {
      set({ loading: false, error })
      return
    }
    
    set({ profile, loading: false })
  },

  addExperience: async (experience) => {
    const { profile } = get()
    if (!profile) return

    set({ loading: true, error: null })

    const { experience: newExp, error } = await profileService.addExperience(profile.id, experience)
    
    if (error || !newExp) {
      set({ loading: false, error: error || 'Failed to add experience' })
      return
    }
    
    set({ experiences: [newExp, ...get().experiences], loading: false })
  },

  updateExperience: async (id, updates) => {
    set({ loading: true, error: null })

    const { experience, error } = await profileService.updateExperience(id, updates)
    
    if (error || !experience) {
      set({ loading: false, error: error || 'Failed to update experience' })
      return
    }
    
    set({
      experiences: get().experiences.map(e => e.id === id ? experience : e),
      loading: false
    })
  },

  deleteExperience: async (id) => {
    set({ loading: true, error: null })

    const { error } = await profileService.deleteExperience(id)
    
    if (error) {
      set({ loading: false, error })
      return
    }
    
    set({
      experiences: get().experiences.filter(e => e.id !== id),
      loading: false
    })
  },

  addEducation: async (education) => {
    const { profile } = get()
    if (!profile) return

    set({ loading: true, error: null })

    const { education: newEdu, error } = await profileService.addEducation(profile.id, education)
    
    if (error || !newEdu) {
      set({ loading: false, error: error || 'Failed to add education' })
      return
    }
    
    set({ education: [newEdu, ...get().education], loading: false })
  },

  updateEducation: async (id, updates) => {
    set({ loading: true, error: null })

    const { education: updatedEdu, error } = await profileService.updateEducation(id, updates)
    
    if (error || !updatedEdu) {
      set({ loading: false, error: error || 'Failed to update education' })
      return
    }
    
    set({
      education: get().education.map(e => e.id === id ? updatedEdu : e),
      loading: false
    })
  },

  deleteEducation: async (id) => {
    set({ loading: true, error: null })

    const { error } = await profileService.deleteEducation(id)
    
    if (error) {
      set({ loading: false, error })
      return
    }
    
    set({
      education: get().education.filter(e => e.id !== id),
      loading: false
    })
  },

  addCertification: async (certification) => {
    const { profile } = get()
    if (!profile) return

    set({ loading: true, error: null })

    const { certification: newCert, error } = await profileService.addCertification(profile.id, certification)
    
    if (error || !newCert) {
      set({ loading: false, error: error || 'Failed to add certification' })
      return
    }
    
    set({ certifications: [newCert, ...get().certifications], loading: false })
  },

  updateCertification: async (id, updates) => {
    set({ loading: true, error: null })

    const { certification: updatedCert, error } = await profileService.updateCertification(id, updates)
    
    if (error || !updatedCert) {
      set({ loading: false, error: error || 'Failed to update certification' })
      return
    }
    
    set({
      certifications: get().certifications.map(c => c.id === id ? updatedCert : c),
      loading: false
    })
  },

  deleteCertification: async (id) => {
    set({ loading: true, error: null })

    const { error } = await profileService.deleteCertification(id)
    
    if (error) {
      set({ loading: false, error })
      return
    }
    
    set({
      certifications: get().certifications.filter(c => c.id !== id),
      loading: false
    })
  },

  addLanguage: async (language) => {
    const { profile } = get()
    if (!profile) return

    set({ loading: true, error: null })

    const { language: newLang, error } = await profileService.addLanguage(profile.id, language)
    
    if (error || !newLang) {
      set({ loading: false, error: error || 'Failed to add language' })
      return
    }
    
    set({ languages: [...get().languages, newLang], loading: false })
  },

  updateLanguage: async (id, updates) => {
    set({ loading: true, error: null })

    const { language: updatedLang, error } = await profileService.updateLanguage(id, updates)
    
    if (error || !updatedLang) {
      set({ loading: false, error: error || 'Failed to update language' })
      return
    }
    
    set({
      languages: get().languages.map(l => l.id === id ? updatedLang : l),
      loading: false
    })
  },

  deleteLanguage: async (id) => {
    set({ loading: true, error: null })

    const { error } = await profileService.deleteLanguage(id)
    
    if (error) {
      set({ loading: false, error })
      return
    }
    
    set({
      languages: get().languages.filter(l => l.id !== id),
      loading: false
    })
  },

  addSkill: async (skillId, level, yearsExperience) => {
    const { profile } = get()
    if (!profile) return

    set({ loading: true, error: null })

    const { skill, error } = await profileService.addProfileSkill(profile.id, skillId, level, yearsExperience)
    
    if (error || !skill) {
      set({ loading: false, error: error || 'Failed to add skill' })
      return
    }
    
    set({ skills: [...get().skills, skill], loading: false })
  },

  updateSkill: async (skillId, level, yearsExperience) => {
    const { profile } = get()
    if (!profile) return

    set({ loading: true, error: null })

    const { skill, error } = await profileService.updateProfileSkill(profile.id, skillId, level, yearsExperience)
    
    if (error || !skill) {
      set({ loading: false, error: error || 'Failed to update skill' })
      return
    }
    
    set({
      skills: get().skills.map(s => s.skill_id === skillId ? skill : s),
      loading: false
    })
  },

  removeSkill: async (skillId) => {
    const { profile } = get()
    if (!profile) return

    set({ loading: true, error: null })

    const { error } = await profileService.removeProfileSkill(profile.id, skillId)
    
    if (error) {
      set({ loading: false, error })
      return
    }
    
    set({
      skills: get().skills.filter(s => s.skill_id !== skillId),
      loading: false
    })
  },

  calculateCompletion: () => {
    const { profile, experiences, education, languages, skills } = get()
    
    let score = 0
    const totalChecks = 7
    
    if (profile?.full_name) score++
    if (profile?.professional_title) score++
    if (profile?.summary) score++
    if (experiences.length > 0) score++
    if (education.length > 0) score++
    if (languages.length > 0) score++
    if (skills.length > 0) score++
    
    return Math.round((score / totalChecks) * 100)
  },

  clearError: () => set({ error: null }),
}))
