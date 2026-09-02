import { supabase } from '@/lib/supabase'
import type { AssistantIntent, AssistantContext } from '@/types/assistant'

// Profile data structure for context
interface ProfileContext {
  profile: {
    full_name: string | null
    professional_title: string | null
    summary: string | null
  } | null
  experiences: unknown[] | null
  skills: unknown[] | null
  education: unknown[] | null
}

// Job data structure for context
interface JobContext {
  job: {
    title: string | null
    company: string | null
    city: string | null
    country: string | null
    work_mode: string | null
    employment_type: string | null
    experience_level: string | null
    salary_min: number | null
    salary_max: number | null
    description: string | null
  } | null
  jobSkills: unknown[] | null
}

// Match data structure for context
interface MatchContext {
  match: {
    score: number | null
    skills_score: number | null
    experience_score: number | null
    location_score: number | null
    strengths: string[] | null
    risks: string[] | null
    explanation: string | null
  } | null
}

// Application data structure for context
interface ApplicationContext {
  application: {
    status: string | null
    applied_at: string | null
  } | null
}

// Assistant Service - handles context-aware AI conversations
export const assistantService = {
  /**
   * Build context for profile-related questions
   */
  async buildProfileContext(userId: string): Promise<ProfileContext> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: experiences } = await supabase
      .from('experiences')
      .select('*')
      .eq('profile_id', profile?.id)
      .order('start_date', { ascending: false })

    const { data: education } = await supabase
      .from('education')
      .select('*')
      .eq('profile_id', profile?.id)
      .order('start_date', { ascending: false })

    const { data: skills } = await supabase
      .from('profile_skills')
      .select('*, skill:skills(*)')
      .eq('profile_id', profile?.id)

    return { profile, experiences, skills, education }
  },

  /**
   * Build context for a job
   */
  async buildJobContext(jobId: string): Promise<JobContext> {
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    const { data: jobSkills } = await supabase
      .from('job_skills')
      .select('*, skill:skills(*)')
      .eq('job_id', jobId)

    return { job, jobSkills }
  },

  /**
   * Build context for a match
   */
  async buildMatchContext(matchId: string): Promise<MatchContext | null> {
    const { data: match } = await supabase
      .from('matches')
      .select('*, job:jobs(*), user_id')
      .eq('id', matchId)
      .single()

    if (!match) return null

    return { match }
  },

  /**
   * Build context for an application
   */
  async buildApplicationContext(applicationId: string): Promise<ApplicationContext | null> {
    const { data: application } = await supabase
      .from('applications')
      .select('*, job:jobs(*), user_id')
      .eq('id', applicationId)
      .single()

    if (!application) return null

    return { application }
  },

  /**
   * Determine intent from user message
   */
  determineIntent(message: string): AssistantIntent {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('profile') || lowerMessage.includes('resume') || lowerMessage.includes('experience')) {
      return 'profile_help'
    }
    if (lowerMessage.includes('job') && (lowerMessage.includes('explain') || lowerMessage.includes('requirement') || lowerMessage.includes('detail'))) {
      return 'job_explanation'
    }
    if (lowerMessage.includes('match') || lowerMessage.includes('score') || lowerMessage.includes('compatible')) {
      return 'match_explanation'
    }
    if (lowerMessage.includes('application') || lowerMessage.includes('apply') || lowerMessage.includes('submit')) {
      return 'application_help'
    }
    if (lowerMessage.includes('career') || lowerMessage.includes('guidance') || lowerMessage.includes('advice')) {
      return 'career_guidance'
    }
    if (lowerMessage.includes('translate') || lowerMessage.includes('translation') || lowerMessage.includes('بدون')) {
      return 'translation'
    }
    if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
      return 'interview_prep'
    }
    if (lowerMessage.includes('cv') || lowerMessage.includes('curriculum') || lowerMessage.includes('improve')) {
      return 'cv_help'
    }

    return 'general'
  },

  /**
   * Generate response based on intent and context
   */
  generateResponse(intent: AssistantIntent, context: AssistantContext, _userMessage: string): string {
    switch (intent) {
      case 'profile_help':
        return this.generateProfileHelpResponse(context)
      case 'job_explanation':
        return this.generateJobExplanationResponse(context)
      case 'match_explanation':
        return this.generateMatchExplanationResponse(context)
      case 'application_help':
        return this.generateApplicationHelpResponse(context)
      case 'career_guidance':
        return this.generateCareerGuidanceResponse()
      case 'translation':
        return this.generateTranslationResponse()
      case 'interview_prep':
        return this.generateInterviewPrepResponse(context)
      case 'cv_help':
        return this.generateCVHelpResponse()
      default:
        return this.generateGeneralResponse()
    }
  },

  /**
   * Generate profile help response
   */
  generateProfileHelpResponse(context: AssistantContext): string {
    const profileData = context.entityData as ProfileContext | undefined
    const profile = profileData?.profile
    const skills = profileData?.skills
    const experiences = profileData?.experiences

    if (!profile) {
      return "I can help you improve your profile! To get started, please make sure you've completed your profile information including your professional title, summary, and work experience. What specific aspect of your profile would you like help with?"
    }

    const skillNames = Array.isArray(skills)
      ? skills.map((s: unknown) => (s as { skill?: { name?: string } })?.skill?.name).filter(Boolean).join(', ')
      : 'No skills added yet'

    return `Based on your profile, here are some suggestions for improvement:

**Professional Title**: ${profile.professional_title || 'Consider adding a professional title to highlight your expertise'}

**Summary**: ${profile.summary ? 'Your summary looks good!' : 'Consider adding a professional summary to introduce yourself to recruiters'}

**Skills**: ${skillNames}

**Experience**: ${experiences?.length || 0} work experiences added

To improve your profile:
1. Add a compelling professional summary
2. List all relevant skills for your target jobs
3. Keep your work experience up to date
4. Add any certifications or education

Would you like me to help with any specific aspect?`
  },

  /**
   * Generate job explanation response
   */
  generateJobExplanationResponse(context: AssistantContext): string {
    const jobData = context.entityData as JobContext | undefined
    const job = jobData?.job
    const jobSkills = jobData?.jobSkills

    if (!job) {
      return "I can help explain job requirements! Please navigate to a job details page and ask me to explain the requirements."
    }

    const skillNames = Array.isArray(jobSkills)
      ? jobSkills.map((js: unknown) => (js as { skill?: { name?: string } })?.skill?.name).filter(Boolean).join(', ')
      : 'Skills not specified'

    return `**${job.title}** at **${job.company}**

**Location**: ${job.city || 'N/A'}, ${job.country || 'N/A'}
**Work Mode**: ${job.work_mode || 'Not specified'}
**Employment Type**: ${job.employment_type || 'Not specified'}
**Experience Level**: ${job.experience_level || 'Not specified'}

**Salary Range**: ${job.salary_min ? `€${job.salary_min}` : 'N/A'} - ${job.salary_max ? `€${job.salary_max}` : 'N/A'}

**Required Skills**: ${skillNames}

**Description**: ${job.description || 'No description available'}

Would you like me to help you:
1. Understand how your profile matches these requirements?
2. Identify gaps in your skills for this position?
3. Prepare a strong application for this job?`
  },

  /**
   * Generate match explanation response
   */
  generateMatchExplanationResponse(context: AssistantContext): string {
    const matchData = context.entityData as MatchContext | undefined
    const match = matchData?.match

    if (!match) {
      return "I can help explain your job matches! Please navigate to a match detail and ask me for more information."
    }

    return `**Match Analysis**

**Overall Score**: ${match.score || 0}%
**Skills Match**: ${match.skills_score || 0}%
**Experience Match**: ${match.experience_score || 0}%
**Location Match**: ${match.location_score || 0}%

**Match Strengths**:
${match.strengths?.map((s) => `- ${s}`).join('\n') || '- Good overall compatibility'}

**Potential Risks**:
${match.risks?.map((r) => `- ${r}`).join('\n') || '- No significant risks identified'}

**Explanation**: ${match.explanation || 'This job aligns well with your profile and preferences.'}

Would you like me to help you understand how to improve your match score for this position?`
  },

  /**
   * Generate application help response
   */
  generateApplicationHelpResponse(context: AssistantContext): string {
    const appData = context.entityData as ApplicationContext | undefined
    const application = appData?.application

    if (!application) {
      return "I can help with your job applications! Here are some tips for successful applications:\n\n1. **Tailor your CV** - Customize your CV for each application\n2. **Write a compelling cover letter** - Highlight relevant experience\n3. **Review requirements** - Ensure you meet the key criteria\n4. **Track your applications** - Use the applications page to monitor status\n\nWould you like help with a specific application?"
    }

    return `**Application Status**: ${application.status || 'draft'}

**Applied Date**: ${application.applied_at || 'Not yet applied'}

To complete your application:
1. Review your CV and cover letter
2. Ensure all required documents are attached
3. Approve the generated content if AI-assisted
4. Mark as ready to apply

Would you like me to help you prepare or review your application materials?`
  },

  /**
   * Generate career guidance response
   */
  generateCareerGuidanceResponse(): string {
    return `**Career Guidance**

Here are some general career development tips:

1. **Continuous Learning**: Keep your skills up-to-date with industry trends

2. **Network**: Build professional relationships in your field

3. **Personal Brand**: Maintain a strong LinkedIn profile and portfolio

4. **Career Goals**: Set clear short-term and long-term career objectives

5. **Job Market Awareness**: Stay informed about industry demands and salary trends

6. **Interview Skills**: Practice common interview questions and scenarios

7. **Feedback**: Seek constructive feedback from peers and mentors

Would you like specific advice on any of these areas? I can also analyze your profile to suggest career paths that might suit you well.`
  },

  /**
   * Generate translation response
   */
  generateTranslationResponse(): string {
    return `**Translation Service**

I can help translate career-related content between supported languages:
- English
- German (Deutsch)
- French (Français)
- Arabic (العربية)
- Italian (Italiano)
- Spanish (Español)

To use translation:
1. Specify the source and target language
2. Paste the text you want translated
3. I'll provide an accurate translation

Example: "Translate this cover letter from English to German"

Please provide the text and languages you'd like me to translate between.`
  },

  /**
   * Generate interview preparation response
   */
  generateInterviewPrepResponse(context: AssistantContext): string {
    const jobData = context.entityData as JobContext | undefined
    const job = jobData?.job

    return `**Interview Preparation**

${job?.title && job?.company ? `For the **${job.title}** position at **${job.company}**, here are key preparation tips:

**Common Questions**:
1. Tell me about yourself
2. Why do you want to work here?
3. What are your strengths and weaknesses?
4. Describe a challenging situation and how you handled it
5. Where do you see yourself in 5 years?

**Company Research**:
- Review ${job.company}'s website and recent news
- Understand their products/services
- Know their mission and values

**Technical Preparation**:
- Review job-specific skills
- Prepare portfolio/work samples
- Practice coding problems if applicable

` : ''}**General Tips**:
- Dress professionally
- Arrive 10-15 minutes early
- Prepare thoughtful questions
- Follow up with a thank-you email

Would you like me to help you practice specific interview questions?`
  },

  /**
   * Generate CV help response
   */
  generateCVHelpResponse(): string {
    return `**CV/Curriculum Vitae Improvement**

Here are key elements of a strong CV:

**Structure**:
1. Contact Information
2. Professional Summary
3. Key Skills
4. Work Experience
5. Education
6. Certifications (optional)
7. Languages (optional)

**Tips for Success**:
- Keep it concise (2-3 pages max)
- Use action verbs (achieved, developed, led)
- Quantify achievements where possible
- Customize for each application
- Ensure consistent formatting
- Proofread for errors

**Common Mistakes to Avoid**:
- Spelling and grammar errors
- Outdated information
- Generic objectives
- Including irrelevant personal details

Would you like me to review your CV or help you improve specific sections?`
  },

  /**
   * Generate general response
   */
  generateGeneralResponse(): string {
    return `Hello! I'm your AI career assistant. I can help you with:

- **Profile Help**: Improve your professional profile
- **Job Explanations**: Understand job requirements
- **Match Analysis**: Understand why jobs match your profile
- **Application Assistance**: Navigate the application process
- **Career Guidance**: Get advice on career development
- **Interview Prep**: Prepare for job interviews
- **CV Help**: Improve your curriculum vitae
- **Translation**: Translate career documents

What would you like help with today?`
  },
}

// AI Response Generation - uses OpenAI API through backend
export const aiResponseService = {
  /**
   * Generate AI response using OpenAI
   * Note: In production, this would call a Supabase Edge Function
   * which securely uses the OpenAI API
   */
  async generateResponse(
    userMessage: string,
    context: {
      profile?: Record<string, unknown>
      job?: Record<string, unknown>
      match?: Record<string, unknown>
      application?: Record<string, unknown>
    }
  ): Promise<string> {
    // For now, use template-based responses
    // In production, this would call OpenAI API via Edge Function
    const intent = assistantService.determineIntent(userMessage)

    // Build minimal context for template responses
    const assistantContext: AssistantContext = {
      type: 'general',
      entityData: context as Record<string, unknown>,
    }

    return assistantService.generateResponse(intent, assistantContext, userMessage)
  },
}
