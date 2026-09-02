// Application types
export type ApplicationStatus = 'draft' | 'applied' | 'pending' | 'interview' | 'rejected' | 'accepted'
export type ApplicationOutputType = 'cv' | 'cover_letter' | 'application_message'

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

// Application with job details
export interface ApplicationWithJob extends Application {
  job: {
    id: string
    title: string
    company: string
    location: string | null
    country: string | null
    city: string | null
    employment_type: string | null
    work_mode: string | null
    salary_min: number | null
    salary_max: number | null
    experience_level: string | null
    posted_at: string | null
  }
}

// Application with full details including outputs
export interface ApplicationWithDetails extends ApplicationWithJob {
  outputs: ApplicationOutput[]
}

// Application creation params
export interface CreateApplicationParams {
  userId: string
  jobId: string
  status?: ApplicationStatus
}

// Application update params
export interface UpdateApplicationParams {
  status?: ApplicationStatus
  applied_at?: string | null
  notes?: string | null
}

// Application output creation params
export interface CreateApplicationOutputParams {
  applicationId: string
  type: ApplicationOutputType
  content: string
  aiGenerated?: boolean
}

// Application output update params
export interface UpdateApplicationOutputParams {
  content?: string
  user_approved?: boolean
}

// Generation request for AI content
export interface GenerateContentParams {
  userId: string
  jobId: string
  type: ApplicationOutputType
}

// Status counts for dashboard
export interface ApplicationStatusCounts {
  draft: number
  applied: number
  pending: number
  interview: number
  rejected: number
  accepted: number
  total: number
}
