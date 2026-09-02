import { supabase } from '@/lib/supabase'
import type {
  Application,
  ApplicationOutput,
  ApplicationStatus,
  ApplicationOutputType,
  ApplicationWithJob,
  ApplicationWithDetails,
  CreateApplicationParams,
  UpdateApplicationParams,
  CreateApplicationOutputParams,
  UpdateApplicationOutputParams,
  ApplicationStatusCounts,
} from '@/types/application'

// Application Service
export const applicationService = {
  /**
   * Get all applications for a user with job details
   */
  async getApplications(userId: string): Promise<ApplicationWithJob[]> {
    const { data, error } = await supabase
      .from('applications')
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
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return (data as ApplicationWithJob[]) || []
  },

  /**
   * Get a single application with full details including outputs
   */
  async getApplication(applicationId: string): Promise<ApplicationWithDetails | null> {
    const { data: application, error: appError } = await supabase
      .from('applications')
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
          description
        )
      `)
      .eq('id', applicationId)
      .single()

    if (appError) {
      if (appError.code === 'PGRST116') return null
      throw new Error(appError.message)
    }

    // Get outputs
    const { data: outputs, error: outputsError } = await supabase
      .from('application_outputs')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: true })

    if (outputsError) {
      throw new Error(outputsError.message)
    }

    return {
      ...(application as ApplicationWithJob),
      outputs: (outputs as ApplicationOutput[]) || [],
    }
  },

  /**
   * Get applications by status
   */
  async getApplicationsByStatus(userId: string, status: ApplicationStatus): Promise<ApplicationWithJob[]> {
    const { data, error } = await supabase
      .from('applications')
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
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return (data as ApplicationWithJob[]) || []
  },

  /**
   * Get application status counts
   */
  async getStatusCounts(userId: string): Promise<ApplicationStatusCounts> {
    const { data, error } = await supabase
      .from('applications')
      .select('status')
      .eq('user_id', userId)

    if (error) {
      throw new Error(error.message)
    }

    const counts: ApplicationStatusCounts = {
      draft: 0,
      applied: 0,
      pending: 0,
      interview: 0,
      rejected: 0,
      accepted: 0,
      total: data?.length || 0,
    }

    data?.forEach((app) => {
      if (app.status in counts) {
        counts[app.status as ApplicationStatus]++
      }
    })

    return counts
  },

  /**
   * Create a new application
   */
  async createApplication(params: CreateApplicationParams): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: params.userId,
        job_id: params.jobId,
        status: params.status || 'draft',
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('You have already applied to this job')
      }
      throw new Error(error.message)
    }

    return data as Application
  },

  /**
   * Update an application
   */
  async updateApplication(applicationId: string, params: UpdateApplicationParams): Promise<Application> {
    const updates: Record<string, unknown> = {}

    if (params.status !== undefined) updates.status = params.status
    if (params.applied_at !== undefined) updates.applied_at = params.applied_at
    if (params.notes !== undefined) updates.notes = params.notes

    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', applicationId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Application
  },

  /**
   * Delete an application
   */
  async deleteApplication(applicationId: string): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId)

    if (error) {
      throw new Error(error.message)
    }
  },

  /**
   * Check if user has applied to a job
   */
  async hasApplied(userId: string, jobId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('applications')
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

  /**
   * Mark application as applied (change status and set applied_at)
   */
  async markAsApplied(applicationId: string): Promise<Application> {
    return this.updateApplication(applicationId, {
      status: 'applied',
      applied_at: new Date().toISOString(),
    })
  },
}

// Application Output Service
export const applicationOutputService = {
  /**
   * Get outputs for an application
   */
  async getOutputs(applicationId: string): Promise<ApplicationOutput[]> {
    const { data, error } = await supabase
      .from('application_outputs')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return (data as ApplicationOutput[]) || []
  },

  /**
   * Get a single output by type
   */
  async getOutputByType(applicationId: string, type: ApplicationOutputType): Promise<ApplicationOutput | null> {
    const { data, error } = await supabase
      .from('application_outputs')
      .select('*')
      .eq('application_id', applicationId)
      .eq('type', type)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }

    return data as ApplicationOutput
  },

  /**
   * Create or update an application output
   */
  async upsertOutput(params: CreateApplicationOutputParams): Promise<ApplicationOutput> {
    // Check if output exists
    const existing = await applicationOutputService.getOutputByType(
      params.applicationId,
      params.type
    )

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('application_outputs')
        .update({
          content: params.content,
          source_version: existing.source_version + 1,
          user_approved: false,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data as ApplicationOutput
    }

    // Create new
    const { data, error } = await supabase
      .from('application_outputs')
      .insert({
        application_id: params.applicationId,
        type: params.type,
        content: params.content,
        ai_generated: params.aiGenerated ?? true,
        source_version: 1,
        user_approved: false,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as ApplicationOutput
  },

  /**
   * Update output content (user edits)
   */
  async updateOutput(outputId: string, content: string): Promise<ApplicationOutput> {
    const { data, error } = await supabase
      .from('application_outputs')
      .update({ content })
      .eq('id', outputId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as ApplicationOutput
  },

  /**
   * Approve output (user confirms it's ready)
   */
  async approveOutput(outputId: string): Promise<ApplicationOutput> {
    const { data, error } = await supabase
      .from('application_outputs')
      .update({ user_approved: true })
      .eq('id', outputId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as ApplicationOutput
  },

  /**
   * Delete an output
   */
  async deleteOutput(outputId: string): Promise<void> {
    const { error } = await supabase
      .from('application_outputs')
      .delete()
      .eq('id', outputId)

    if (error) {
      throw new Error(error.message)
    }
  },

  /**
   * Check if all required outputs are approved
   */
  async areAllOutputsApproved(applicationId: string): Promise<boolean> {
    const outputs = await this.getOutputs(applicationId)
    
    // We require at least cv and cover_letter to be approved
    const requiredTypes: ApplicationOutputType[] = ['cv', 'cover_letter']
    
    for (const type of requiredTypes) {
      const output = outputs.find(o => o.type === type)
      if (!output || !output.user_approved) {
        return false
      }
    }
    
    return true
  },
}

// AI Content Generation Service
export const contentGenerationService = {
  /**
   * Generate CV content for a job application
   * This is a template-based generator. In production, this would call OpenAI API.
   */
  async generateCV(userId: string, jobId: string): Promise<string> {
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    // Get experiences
    const { data: experiences } = await supabase
      .from('experiences')
      .select('*')
      .eq('profile_id', profile.id)
      .order('start_date', { ascending: false })

    // Get education
    const { data: education } = await supabase
      .from('education')
      .select('*')
      .eq('profile_id', profile.id)
      .order('start_date', { ascending: false })

    // Get skills
    const { data: profileSkills } = await supabase
      .from('profile_skills')
      .select('*, skill:skills(*)')
      .eq('profile_id', profile.id)

    // Get job data
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      throw new Error('Job not found')
    }

    // Generate CV content
    const skillNames = (profileSkills || [])
      .map((ps: { skill?: { name?: string } }) => ps.skill?.name)
      .filter(Boolean)
      .join(', ')

    const experienceList = (experiences || [])
      .map((exp: { company: string; position: string; start_date: string; end_date: string | null; current: boolean; description: string | null }) => {
        const dates = `${exp.start_date}${exp.current ? ' - Present' : exp.end_date ? ` - ${exp.end_date}` : ''}`
        return `${exp.position} at ${exp.company} (${dates})\n${exp.description || ''}`
      })
      .join('\n\n')

    const educationList = (education || [])
      .map((edu: { institution: string; degree: string; field: string; end_date: string | null }) => {
        return `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.end_date || 'Present'})`
      })
      .join('\n')

    return `CURRICULUM VITAE

PERSONAL INFORMATION
Name: ${profile.full_name || 'N/A'}
Title: ${profile.professional_title || job.title}
Location: ${profile.city || ''}, ${profile.country || ''}

PROFESSIONAL SUMMARY
${profile.summary || `Experienced professional seeking ${job.title} position at ${job.company}.`}

KEY SKILLS
${skillNames || 'Relevant skills for this position'}

WORK EXPERIENCE
${experienceList || 'Relevant work experience'}

EDUCATION
${educationList || 'Relevant education'}

TAILORED FOR: ${job.title} at ${job.company}
${job.location ? `Location: ${job.location}` : ''}
${job.employment_type ? `Employment Type: ${job.employment_type}` : ''}
`
  },

  /**
   * Generate cover letter content
   */
  async generateCoverLetter(userId: string, jobId: string): Promise<string> {
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    // Get experiences
    const { data: experiences } = await supabase
      .from('experiences')
      .select('*')
      .eq('profile_id', profile.id)
      .order('start_date', { ascending: false })
      .limit(2)

    // Get job data
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      throw new Error('Job not found')
    }

    const latestExperience = experiences?.[0]
    const yearsExperience = latestExperience
      ? Math.floor((Date.now() - new Date(latestExperience.start_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : 0

    return `COVER LETTER

${profile.full_name || 'Your Name'}
${profile.city || ''}${profile.country ? `, ${profile.country}` : ''}
${profile.email || ''}

${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. ${job.location ? `Based in ${job.location},` : ''} ${profile.professional_title ? `I am a ${profile.professional_title}` : 'I am a dedicated professional'} with ${yearsExperience > 0 ? `over ${yearsExperience} years of experience` : 'valuable experience'} in my field.

${latestExperience ? `In my current role as ${latestExperience.position} at ${latestExperience.company}, I have developed skills that align well with the requirements of this position. ${latestExperience.description || ''}` : 'I am excited about this opportunity to contribute to your team.'}

${profile.summary || `I am drawn to ${job.company} because of the company's reputation${job.employment_type ? ` and the ${job.employment_type.replace('_', ' ')} opportunity` : ''}. I believe my skills and experience make me an excellent candidate for this role.`}

I would welcome the opportunity to discuss how my background and skills would benefit your team. Thank you for considering my application.

Sincerely,
${profile.full_name || 'Your Name'}
`
  },

  /**
   * Generate application message (short intro)
   */
  async generateApplicationMessage(userId: string, jobId: string): Promise<string> {
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      throw new Error('Profile not found')
    }

    // Get job data
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      throw new Error('Job not found')
    }

    return `Dear ${job.company} Team,

I am excited to apply for the ${job.title} position${job.location ? ` in ${job.location}` : ''}. ${profile.professional_title ? `As a ${profile.professional_title},` : ''} I am confident that my skills and experience align well with the requirements of this role.

${profile.summary ? profile.summary.substring(0, 200) + '...' : 'I am passionate about contributing to a dynamic team and look forward to discussing how I can add value to your organization.'}

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${profile.full_name || 'Applicant'}`
  },

  /**
   * Generate content based on type
   */
  async generate(userId: string, jobId: string, type: ApplicationOutputType): Promise<string> {
    switch (type) {
      case 'cv':
        return this.generateCV(userId, jobId)
      case 'cover_letter':
        return this.generateCoverLetter(userId, jobId)
      case 'application_message':
        return this.generateApplicationMessage(userId, jobId)
      default:
        throw new Error(`Unknown output type: ${type}`)
    }
  },
}
