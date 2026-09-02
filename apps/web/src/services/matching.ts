import { supabase } from '@/lib/supabase'
import type {
  Match,
  MatchWithJob,
  MatchScoreBreakdown,
  SkillScore,
  ExperienceScore,
  LocationScore,
  SalaryScore,
} from '@/types/matching'
import type { Job } from '@/types/job'

// Profile data structure for matching
interface ProfileData {
  id: string
  user_id: string
  full_name: string | null
  professional_title: string | null
  summary: string | null
  country: string | null
  city: string | null
  location_preferences: string[] | null
}

interface ProfileSkill {
  skill_id: string
  skill: {
    id: string
    name: string
    normalized_name: string
    category: string | null
  }
  level: string | null
  years_experience: number | null
}

interface ProfileExperience {
  id: string
  position: string
  company: string
  start_date: string
  end_date: string | null
  current: boolean
  description: string | null
}

interface JobSkill {
  skill_id: string
  skill: {
    id: string
    name: string
    normalized_name: string
  }
  requirement_type: 'required' | 'preferred'
}

// Matching weights (can be adjusted)
const WEIGHTS = {
  skills: 0.4,
  experience: 0.25,
  location: 0.2,
  salary: 0.15,
}

// Experience level mapping
const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive']

/**
 * Calculate years of experience from start date to now or end date
 */
function calculateYearsExperience(startDate: string, endDate: string | null): number {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)
  return Math.round(diffYears * 10) / 10
}

/**
 * Calculate experience level based on years of experience
 */
function calculateExperienceLevel(years: number): string {
  if (years < 2) return 'entry'
  if (years < 5) return 'mid'
  if (years < 8) return 'senior'
  if (years < 12) return 'lead'
  return 'executive'
}

/**
 * Normalize skill name for comparison
 */
function normalizeSkillName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Check if two skill names match
 */
function skillsMatch(skill1: string, skill2: string): boolean {
  const norm1 = normalizeSkillName(skill1)
  const norm2 = normalizeSkillName(skill2)
  return norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1)
}

// Matching Service
export const matchingService = {
  /**
   * Get user's matches with job details
   */
  async getMatches(userId: string): Promise<MatchWithJob[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        job:jobs(
          id,
          title,
          company,
          location,
          country,
          city,
          employment_type,
          work_mode,
          salary_min,
          salary_max,
          experience_level,
          posted_at
        )
      `)
      .eq('user_id', userId)
      .order('score', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return (data as MatchWithJob[]) || []
  },

  /**
   * Get a single match with job details
   */
  async getMatch(matchId: string): Promise<MatchWithJob | null> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        job:jobs(
          id,
          title,
          company,
          location,
          country,
          city,
          employment_type,
          work_mode,
          salary_min,
          salary_max,
          experience_level,
          posted_at,
          description,
          application_url
        )
      `)
      .eq('id', matchId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }

    return data as MatchWithJob
  },

  /**
   * Delete a match
   */
  async deleteMatch(matchId: string): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId)

    if (error) {
      throw new Error(error.message)
    }
  },

  /**
   * Calculate match score between profile and job
   */
  async calculateMatch(userId: string, jobId: string): Promise<{
    match: Match
    scoreBreakdown: MatchScoreBreakdown
  }> {
    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    // Fetch profile skills
    const { data: profileSkills, error: skillsError } = await supabase
      .from('profile_skills')
      .select('*, skill:skills(*)')
      .eq('profile_id', profile.id)

    if (skillsError) {
      throw new Error(skillsError.message)
    }

    // Fetch profile experiences
    const { data: experiences, error: expError } = await supabase
      .from('experiences')
      .select('*')
      .eq('profile_id', profile.id)
      .order('start_date', { ascending: false })

    if (expError) {
      throw new Error(expError.message)
    }

    // Fetch job data
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      throw new Error('Job not found')
    }

    // Fetch job skills
    const { data: jobSkills, error: jobSkillsError } = await supabase
      .from('job_skills')
      .select('*, skill:skills(*)')
      .eq('job_id', jobId)

    if (jobSkillsError) {
      throw new Error(jobSkillsError.message)
    }

    // Calculate score breakdown
    const scoreBreakdown = calculateScoreBreakdown(
      profile as ProfileData,
      profileSkills as ProfileSkill[],
      experiences as ProfileExperience[],
      job as Job,
      jobSkills as JobSkill[]
    )

    // Prepare matched/missing skills for storage
    const requiredSkills = jobSkills
      .filter(js => js.requirement_type === 'required')
      .map(js => js.skill.name)

    const matchedSkills = requiredSkills.filter(rs =>
      profileSkills.some(ps => skillsMatch(ps.skill.name, rs))
    )

    const missingSkills = requiredSkills.filter(rs =>
      !profileSkills.some(ps => skillsMatch(ps.skill.name, rs))
    )

    // Generate strengths and risks
    const strengths: string[] = []
    const risks: string[] = []

    // Add skill-based insights
    if (matchedSkills.length >= requiredSkills.length * 0.7) {
      strengths.push(`Strong skill match: ${matchedSkills.length}/${requiredSkills.length} required skills`)
    } else if (matchedSkills.length < requiredSkills.length * 0.3) {
      risks.push(`Limited skill overlap: only ${matchedSkills.length}/${requiredSkills.length} required skills`)
    }

    // Add experience insights
    const totalYears = experiences.reduce((sum, exp) => {
      return sum + calculateYearsExperience(exp.start_date, exp.end_date)
    }, 0)

    if (job.experience_level) {
      const userLevel = calculateExperienceLevel(totalYears)
      const jobLevelIndex = EXPERIENCE_LEVELS.indexOf(job.experience_level)
      const userLevelIndex = EXPERIENCE_LEVELS.indexOf(userLevel)

      if (userLevelIndex >= jobLevelIndex) {
        strengths.push(`Meets experience level requirement (${userLevel} vs ${job.experience_level})`)
      } else {
        risks.push(`May need more experience (${userLevel} vs ${job.experience_level} required)`)
      }
    }

    // Add location insights
    if (job.country && profile.country && job.country === profile.country) {
      strengths.push('Location match: same country')
    }

    if (job.work_mode && (job.work_mode === 'remote' || profile.location_preferences?.includes(job.country || ''))) {
      strengths.push('Work mode preference aligned')
    }

    // Generate summary
    const summary = generateMatchSummary(scoreBreakdown, matchedSkills, missingSkills, strengths, risks)

    // Save match to database
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .upsert({
        user_id: userId,
        job_id: jobId,
        score: scoreBreakdown.overall,
        summary,
        matched_skills: matchedSkills,
        missing_skills: missingSkills,
        strengths,
        risks,
        explanation: summary,
        model_metadata: {
          breakdown: scoreBreakdown,
          calculated_at: new Date().toISOString(),
          method: 'rule-based',
        },
      })
      .select()
      .single()

    if (matchError) {
      throw new Error(matchError.message)
    }

    return {
      match: match as Match,
      scoreBreakdown,
    }
  },

  /**
   * Calculate matches for all jobs for a user
   */
  async calculateAllMatches(userId: string, limit = 50): Promise<{
    matches: Match[]
    jobsWithoutMatch: string[]
  }> {
    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    // Get recent jobs (or all jobs, limited)
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (jobsError) {
      throw new Error(jobsError.message)
    }

    const matches: Match[] = []
    const jobsWithoutMatch: string[] = []

    for (const job of jobs || []) {
      try {
        const result = await this.calculateMatch(userId, job.id)
        matches.push(result.match)
      } catch {
        jobsWithoutMatch.push(job.id)
      }
    }

    return { matches, jobsWithoutMatch }
  },
}

/**
 * Calculate detailed score breakdown
 */
function calculateScoreBreakdown(
  profile: ProfileData,
  profileSkills: ProfileSkill[],
  experiences: ProfileExperience[],
  job: Job,
  jobSkills: JobSkill[]
): MatchScoreBreakdown {
  // Skill score
  const skillScore = calculateSkillScore(profileSkills, jobSkills)

  // Experience score
  const experienceScore = calculateExperienceScore(experiences, job.experience_level)

  // Location score
  const locationScore = calculateLocationScore(profile, job)

  // Salary score (simplified - no actual salary data in profile yet)
  const salaryScore: SalaryScore = {
    score: 0.5,
    withinRange: true,
  }

  // Calculate overall weighted score
  const overall = Math.round(
    (skillScore.score * WEIGHTS.skills +
      experienceScore.score * WEIGHTS.experience +
      locationScore.score * WEIGHTS.location +
      salaryScore.score * WEIGHTS.salary) * 100
  )

  return {
    overall,
    skills: skillScore,
    experience: experienceScore,
    location: locationScore,
    salary: salaryScore,
  }
}

/**
 * Calculate skill match score
 */
function calculateSkillScore(
  profileSkills: ProfileSkill[],
  jobSkills: JobSkill[]
): SkillScore {
  if (jobSkills.length === 0) {
    return {
      score: 1,
      matched: [],
      missing: [],
      matchedCount: 0,
      totalRequired: 0,
    }
  }

  const requiredSkills = jobSkills
    .filter(js => js.requirement_type === 'required')
    .map(js => js.skill.name)

  const preferredSkills = jobSkills
    .filter(js => js.requirement_type === 'preferred')
    .map(js => js.skill.name)

  const matched: string[] = []
  const missing: string[] = []

  // Check required skills
  for (const reqSkill of requiredSkills) {
    const found = profileSkills.find(ps => skillsMatch(ps.skill.name, reqSkill))
    if (found) {
      matched.push(reqSkill)
    } else {
      missing.push(reqSkill)
    }
  }

  // Check preferred skills (partial match)
  for (const prefSkill of preferredSkills) {
    const found = profileSkills.find(ps => skillsMatch(ps.skill.name, prefSkill))
    if (found) {
      matched.push(`${prefSkill} (preferred)`)
    }
  }

  // Calculate score: 70% required skills, 30% preferred skills
  const requiredScore = requiredSkills.length > 0
    ? matched.filter(s => !s.includes('(preferred)')).length / requiredSkills.length
    : 1

  const preferredScore = preferredSkills.length > 0
    ? matched.filter(s => s.includes('(preferred)')).length / preferredSkills.length
    : 1

  const score = (requiredScore * 0.7 + preferredScore * 0.3)

  return {
    score: Math.round(score * 100) / 100,
    matched,
    missing,
    matchedCount: matched.filter(s => !s.includes('(preferred)')).length,
    totalRequired: requiredSkills.length,
  }
}

/**
 * Calculate experience match score
 */
function calculateExperienceScore(
  experiences: ProfileExperience[],
  requiredLevel: string | null
): ExperienceScore {
  if (!requiredLevel) {
    return {
      score: 0.75,
      level: null,
      yearsAtLevel: null,
    }
  }

  const totalYears = experiences.reduce((sum, exp) => {
    return sum + calculateYearsExperience(exp.start_date, exp.end_date)
  }, 0)

  const userLevel = calculateExperienceLevel(totalYears)
  const requiredLevelIndex = EXPERIENCE_LEVELS.indexOf(requiredLevel)
  const userLevelIndex = EXPERIENCE_LEVELS.indexOf(userLevel)

  // Calculate score based on level match
  let score: number
  if (userLevelIndex >= requiredLevelIndex) {
    // User meets or exceeds requirement
    score = 1
  } else if (userLevelIndex === requiredLevelIndex - 1) {
    // User is one level below
    score = 0.7
  } else {
    // User is more than one level below
    score = 0.4
  }

  return {
    score,
    level: userLevel,
    yearsAtLevel: totalYears,
  }
}

/**
 * Calculate location match score
 */
function calculateLocationScore(
  profile: ProfileData,
  job: Job
): LocationScore {
  let score = 0.5
  let locationMatch = false
  let workModeMatch = false

  // Check country match
  if (job.country && profile.country && job.country === profile.country) {
    score += 0.25
    locationMatch = true
  }

  // Check city match
  if (job.city && profile.city && job.city === profile.city) {
    score += 0.15
  }

  // Check work mode
  if (job.work_mode === 'remote') {
    // Remote jobs are always a match
    score += 0.1
    workModeMatch = true
  } else if (job.work_mode && profile.location_preferences?.includes(job.country || '')) {
    // User prefers this location
    score += 0.1
    workModeMatch = true
  }

  return {
    score: Math.min(1, score),
    locationMatch,
    workModeMatch,
  }
}

/**
 * Generate a human-readable match summary
 */
function generateMatchSummary(
  breakdown: MatchScoreBreakdown,
  matchedSkills: string[],
  missingSkills: string[],
  strengths: string[],
  risks: string[]
): string {
  const parts: string[] = []

  // Overall score interpretation
  if (breakdown.overall >= 80) {
    parts.push('Excellent match')
  } else if (breakdown.overall >= 60) {
    parts.push('Good match')
  } else if (breakdown.overall >= 40) {
    parts.push('Moderate match')
  } else {
    parts.push('Low match')
  }

  // Skills summary
  if (matchedSkills.length > 0) {
    parts.push(`${matchedSkills.length} matching skills`)
  }

  // Top strength
  if (strengths.length > 0) {
    parts.push(strengths[0])
  }

  // Top risk if low match
  if (breakdown.overall < 60 && risks.length > 0) {
    parts.push(risks[0])
  }

  return parts.join('. ') + '.'
}
