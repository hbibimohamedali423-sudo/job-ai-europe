// Match types
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

export interface MatchWithJob extends Match {
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

// Score breakdown types
export interface MatchScoreBreakdown {
  overall: number
  skills: SkillScore
  experience: ExperienceScore
  location: LocationScore
  salary: SalaryScore
}

export interface SkillScore {
  score: number
  matched: string[]
  missing: string[]
  matchedCount: number
  totalRequired: number
}

export interface ExperienceScore {
  score: number
  level: string | null
  yearsAtLevel: number | null
}

export interface LocationScore {
  score: number
  locationMatch: boolean
  workModeMatch: boolean
}

export interface SalaryScore {
  score: number
  withinRange: boolean
  userSalaryMin?: number
  userSalaryMax?: number
}

// Matching parameters
export interface MatchJobParams {
  jobId: string
  userId: string
}

export interface MatchProfileParams {
  profileId: string
  jobIds: string[]
}

// Match result
export interface MatchResult {
  match: Match
  scoreBreakdown: MatchScoreBreakdown
}
