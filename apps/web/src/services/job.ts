import { supabase } from '@/lib/supabase'
import type {
  Job,
  JobSearchParams,
  JobSearchResult,
  SavedJob,
  JobSkill,
  Skill,
} from '@/types/job'

// Job Service
export const jobService = {
  // Search jobs
  async searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
    const {
      query,
      country,
      city,
      work_mode,
      employment_type,
      experience_level,
      salary_min,
      salary_max,
      sort_by = 'created_at',
      sort_order = 'desc',
      page = 1,
      limit = 20,
    } = params

    let supabaseQuery = supabase
      .from('jobs')
      .select('*', { count: 'exact' })

    // Apply filters
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,company.ilike.%${query}%,description.ilike.%${query}%`
      )
    }
    if (country) {
      supabaseQuery = supabaseQuery.eq('country', country)
    }
    if (city) {
      supabaseQuery = supabaseQuery.eq('city', city)
    }
    if (work_mode) {
      supabaseQuery = supabaseQuery.eq('work_mode', work_mode)
    }
    if (employment_type) {
      supabaseQuery = supabaseQuery.eq('employment_type', employment_type)
    }
    if (experience_level) {
      supabaseQuery = supabaseQuery.eq('experience_level', experience_level)
    }
    if (salary_min) {
      supabaseQuery = supabaseQuery.gte('salary_min', salary_min)
    }
    if (salary_max) {
      supabaseQuery = supabaseQuery.lte('salary_max', salary_max)
    }

    // Sorting
    const ascending = sort_order === 'asc'
    supabaseQuery = supabaseQuery.order(sort_by, { ascending })

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    supabaseQuery = supabaseQuery.range(from, to)

    const { data, error, count } = await supabaseQuery

    if (error) {
      throw new Error(error.message)
    }

    return {
      jobs: (data as Job[]) || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }
  },

  // Get single job by ID
  async getJob(jobId: string): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new Error(error.message)
    }

    return data as Job
  },

  // Get job with skills
  async getJobWithSkills(jobId: string): Promise<{ job: Job; skills: JobSkill[] } | null> {
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError) {
      if (jobError.code === 'PGRST116') return null
      throw new Error(jobError.message)
    }

    const { data: skills, error: skillsError } = await supabase
      .from('job_skills')
      .select('*, skill:skills(*)')
      .eq('job_id', jobId)

    if (skillsError) {
      throw new Error(skillsError.message)
    }

    return {
      job: job as Job,
      skills: (skills as JobSkill[]) || [],
    }
  },

  // Full-text job search
  async fullTextSearch(query: string, page = 1, limit = 20): Promise<JobSearchResult> {
    const { data, error, count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .textSearch(
        'title',
        query,
        { type: 'websearch', config: 'english' }
      )
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      throw new Error(error.message)
    }

    return {
      jobs: (data as Job[]) || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }
  },
}

// Saved Jobs Service
export const savedJobService = {
  // Get user's saved jobs
  async getSavedJobs(userId: string): Promise<SavedJob[]> {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('*, job:jobs(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return (data as SavedJob[]) || []
  },

  // Save a job
  async saveJob(userId: string, jobId: string): Promise<SavedJob> {
    const { data, error } = await supabase
      .from('saved_jobs')
      .insert({ user_id: userId, job_id: jobId })
      .select('*, job:jobs(*)')
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('Job is already saved')
      }
      throw new Error(error.message)
    }

    return data as SavedJob
  },

  // Remove saved job
  async removeSavedJob(userId: string, jobId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId)

    if (error) {
      throw new Error(error.message)
    }
  },

  // Check if job is saved
  async isJobSaved(userId: string, jobId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return false
      return false
    }

    return !!data
  },

  // Get saved job IDs for user (for quick lookup)
  async getSavedJobIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', userId)

    if (error) {
      throw new Error(error.message)
    }

    return (data || []).map((item) => item.job_id)
  },
}

// Skills Service (for job skills)
export const skillService = {
  // Get all skills
  async getAllSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(error.message)
    }

    return (data as Skill[]) || []
  },

  // Search skills by name
  async searchSkills(query: string): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(20)

    if (error) {
      throw new Error(error.message)
    }

    return (data as Skill[]) || []
  },
}
