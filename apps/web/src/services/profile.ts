import { supabase } from '@/lib/supabase'

// Types
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
}

export interface ProfileSkill {
  skill_id: string
  level: string | null
  years_experience: number | null
  skill: Skill
}

export interface JobPreferences {
  desired_title: string | null
  desired_country: string | null
  desired_city: string | null
  work_mode: string | null
  employment_type: string | null
  salary_min: number | null
  salary_max: number | null
  experience_level: string | null
}

// Profile CRUD
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    return { profile: null, error: error.message }
  }

  return { profile: data as Profile, error: null }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    return { profile: null, error: error.message }
  }

  return { profile: data as Profile, error: null }
}

// Experience CRUD
export async function getExperiences(profileId: string) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('profile_id', profileId)
    .order('start_date', { ascending: false })

  if (error) {
    return { experiences: [], error: error.message }
  }

  return { experiences: data as Experience[], error: null }
}

export async function addExperience(profileId: string, experience: Omit<Experience, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('experiences')
    .insert({ ...experience, profile_id: profileId })
    .select()
    .single()

  if (error) {
    return { experience: null, error: error.message }
  }

  return { experience: data as Experience, error: null }
}

export async function updateExperience(id: string, updates: Partial<Experience>) {
  const { data, error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { experience: null, error: error.message }
  }

  return { experience: data as Experience, error: null }
}

export async function deleteExperience(id: string) {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

// Education CRUD
export async function getEducation(profileId: string) {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('profile_id', profileId)
    .order('start_date', { ascending: false })

  if (error) {
    return { education: [], error: error.message }
  }

  return { education: data as Education[], error: null }
}

export async function addEducation(profileId: string, education: Omit<Education, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('education')
    .insert({ ...education, profile_id: profileId })
    .select()
    .single()

  if (error) {
    return { education: null, error: error.message }
  }

  return { education: data as Education, error: null }
}

export async function updateEducation(id: string, updates: Partial<Education>) {
  const { data, error } = await supabase
    .from('education')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { education: null, error: error.message }
  }

  return { education: data as Education, error: null }
}

export async function deleteEducation(id: string) {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

// Certification CRUD
export async function getCertifications(profileId: string) {
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('profile_id', profileId)
    .order('issue_date', { ascending: false })

  if (error) {
    return { certifications: [], error: error.message }
  }

  return { certifications: data as Certification[], error: null }
}

export async function addCertification(profileId: string, certification: Omit<Certification, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('certifications')
    .insert({ ...certification, profile_id: profileId })
    .select()
    .single()

  if (error) {
    return { certification: null, error: error.message }
  }

  return { certification: data as Certification, error: null }
}

export async function updateCertification(id: string, updates: Partial<Certification>) {
  const { data, error } = await supabase
    .from('certifications')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { certification: null, error: error.message }
  }

  return { certification: data as Certification, error: null }
}

export async function deleteCertification(id: string) {
  const { error } = await supabase
    .from('certifications')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

// Language CRUD
export async function getLanguages(profileId: string) {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .eq('profile_id', profileId)

  if (error) {
    return { languages: [], error: error.message }
  }

  return { languages: data as Language[], error: null }
}

export async function addLanguage(profileId: string, language: Omit<Language, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('languages')
    .insert({ ...language, profile_id: profileId })
    .select()
    .single()

  if (error) {
    return { language: null, error: error.message }
  }

  return { language: data as Language, error: null }
}

export async function updateLanguage(id: string, updates: Partial<Language>) {
  const { data, error } = await supabase
    .from('languages')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { language: null, error: error.message }
  }

  return { language: data as Language, error: null }
}

export async function deleteLanguage(id: string) {
  const { error } = await supabase
    .from('languages')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

// Skills
export async function getProfileSkills(profileId: string) {
  const { data, error } = await supabase
    .from('profile_skills')
    .select('*, skill:skills(*)')
    .eq('profile_id', profileId)

  if (error) {
    return { skills: [], error: error.message }
  }

  return { skills: data as ProfileSkill[], error: null }
}

export async function addProfileSkill(profileId: string, skillId: string, level?: string, yearsExperience?: number) {
  const { data, error } = await supabase
    .from('profile_skills')
    .insert({
      profile_id: profileId,
      skill_id: skillId,
      level,
      years_experience: yearsExperience,
    })
    .select('*, skill:skills(*)')
    .single()

  if (error) {
    return { skill: null, error: error.message }
  }

  return { skill: data as ProfileSkill, error: null }
}

export async function updateProfileSkill(profileId: string, skillId: string, level?: string, yearsExperience?: number) {
  const { data, error } = await supabase
    .from('profile_skills')
    .update({
      level,
      years_experience: yearsExperience,
    })
    .eq('profile_id', profileId)
    .eq('skill_id', skillId)
    .select('*, skill:skills(*)')
    .single()

  if (error) {
    return { skill: null, error: error.message }
  }

  return { skill: data as ProfileSkill, error: null }
}

export async function removeProfileSkill(profileId: string, skillId: string) {
  const { error } = await supabase
    .from('profile_skills')
    .delete()
    .eq('profile_id', profileId)
    .eq('skill_id', skillId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function getAllSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('name')

  if (error) {
    return { skills: [], error: error.message }
  }

  return { skills: data as Skill[], error: null }
}

// Job Preferences (stored in profile)
export async function updateJobPreferences(userId: string, preferences: JobPreferences) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      location_preferences: preferences.desired_country ? [preferences.desired_country] : [],
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    return { profile: null, error: error.message }
  }

  return { profile: data as Profile, error: null }
}
