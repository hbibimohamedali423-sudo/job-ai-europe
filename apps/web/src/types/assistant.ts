// AI Assistant types

export type AssistantMessageRole = 'user' | 'assistant' | 'system'

export interface AssistantMessage {
  id: string
  role: AssistantMessageRole
  content: string
  timestamp: string
  context?: AssistantContext
}

export interface AssistantContext {
  type: 'profile' | 'job' | 'match' | 'application' | 'general'
  entityId?: string
  entityData?: Record<string, unknown>
}

export type AssistantIntent =
  | 'profile_help'
  | 'job_explanation'
  | 'match_explanation'
  | 'application_help'
  | 'career_guidance'
  | 'translation'
  | 'interview_prep'
  | 'cv_help'
  | 'general'

export interface AssistantConversation {
  id: string
  userId: string
  messages: AssistantMessage[]
  createdAt: string
  updatedAt: string
}

// Suggestion types for quick actions
export interface AssistantSuggestion {
  key: string
  icon: string
  intent: AssistantIntent
  labelKey: string
}

// Assistant capability/action types
export interface AssistantAction {
  type: 'suggestion' | 'quick_reply' | 'link'
  label: string
  action: string
}

// Language info for translation feature
export interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
]
