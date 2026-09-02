// Job Source types
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

// Job types
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
  employment_type: EmploymentType | null
  work_mode: WorkMode | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string | null
  experience_level: ExperienceLevel | null
  posted_at: string | null
  application_url: string | null
  source_url: string | null
  source_metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary'
export type WorkMode = 'remote' | 'hybrid' | 'on_site'
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive'

// Job Skill types
export interface JobSkill {
  job_id: string
  skill_id: string
  requirement_type: 'required' | 'preferred'
  importance: string | null
  skill?: Skill
}

// Skill type (reference)
export interface Skill {
  id: string
  name: string
  normalized_name: string
  category: string | null
}

// Saved Job types
export interface SavedJob {
  id: string
  user_id: string
  job_id: string
  created_at: string
  job?: Job
}

// Job Search types
export interface JobSearchParams {
  query?: string
  title?: string
  country?: string
  city?: string
  work_mode?: WorkMode
  employment_type?: EmploymentType
  experience_level?: ExperienceLevel
  salary_min?: number
  salary_max?: number
  skills?: string[]
  sort_by?: 'created_at' | 'posted_at' | 'relevance'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface JobSearchResult {
  jobs: Job[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Job Provider interface (for abstraction)
export interface JobProvider {
  name: string
  search(params: JobSearchParams): Promise<JobSearchResult>
  fetchJob(externalId: string): Promise<Job | null>
  healthCheck(): Promise<boolean>
}
