// User Types
export type UserRole = 'user' | 'admin' | 'super_admin'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

// Profile Types
export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  professional_title: string | null
  summary: string | null
  country: string | null
  city: string | null
  location_preferences: string[] | null
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  profile_id: string
  company: string
  position: string
  start_date: string
  end_date: string | null
  current: boolean
  description: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  profile_id: string
  institution: string
  degree: string
  field: string
  start_date: string
  end_date: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  profile_id: string
  name: string
  issuer: string
  issue_date: string | null
  expiry_date: string | null
  credential_id: string | null
  created_at: string
  updated_at: string
}

export interface Language {
  id: string
  profile_id: string
  language: string
  level: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  normalized_name: string
  category: string | null
  created_at: string
}

export interface ProfileSkill {
  profile_id: string
  skill_id: string
  level: string | null
  years_experience: number | null
}

// Job Types
export interface JobSource {
  id: string
  name: string
  provider_type: string
  enabled: boolean
  configuration: Record<string, unknown>
  last_sync_at: string | null
  last_success_at: string | null
  last_error: string | null
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  source_id: string
  external_id: string
  title: string
  company: string
  description: string | null
  location: string | null
  country: string | null
  city: string | null
  employment_type: string | null
  work_mode: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string | null
  experience_level: string | null
  posted_at: string | null
  application_url: string | null
  source_url: string | null
  source_metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface JobSkill {
  job_id: string
  skill_id: string
  requirement_type: 'required' | 'preferred'
  importance: string | null
}

export interface SavedJob {
  id: string
  user_id: string
  job_id: string
  created_at: string
}

// Match Types
export interface Match {
  id: string
  user_id: string
  job_id: string
  score: number
  summary: string | null
  matched_skills: string[]
  missing_skills: string[]
  strengths: string[]
  risks: string[]
  explanation: string | null
  model_metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Application Types
export type ApplicationStatus = 'draft' | 'applied' | 'pending' | 'interview' | 'rejected' | 'accepted'

export interface Application {
  id: string
  user_id: string
  job_id: string
  status: ApplicationStatus
  applied_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ApplicationOutputType = 'cv' | 'cover_letter' | 'application_message'

export interface ApplicationOutput {
  id: string
  application_id: string
  type: ApplicationOutputType
  content: string
  source_version: number
  ai_generated: boolean
  user_approved: boolean
  created_at: string
  updated_at: string
}

// Audit Types
export interface AuditLog {
  id: string
  actor_user_id: string | null
  action: string
  resource_type: string
  resource_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
}

export interface ProfileForm {
  full_name: string
  professional_title: string
  summary: string
  country: string
  city: string
  location_preferences: string[]
}

export interface ExperienceForm {
  company: string
  position: string
  start_date: string
  end_date: string
  current: boolean
  description: string
  location: string
}

export interface EducationForm {
  institution: string
  degree: string
  field: string
  start_date: string
  end_date: string
  description: string
}

export interface CertificationForm {
  name: string
  issuer: string
  issue_date: string
  expiry_date: string
  credential_id: string
}

export interface LanguageForm {
  language: string
  level: string
}

export interface JobSearchFilters {
  query?: string
  country?: string
  city?: string
  work_mode?: string
  employment_type?: string
  experience_level?: string
  salary_min?: number
  salary_max?: number
  posted_within?: string
  skills?: string[]
}
