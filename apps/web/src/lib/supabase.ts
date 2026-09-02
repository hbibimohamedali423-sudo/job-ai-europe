import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          professional_title: string | null
          summary: string | null
          country: string | null
          city: string | null
          phone: string | null
          avatar_url: string | null
          location_preferences: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          professional_title?: string | null
          summary?: string | null
          country?: string | null
          city?: string | null
          phone?: string | null
          avatar_url?: string | null
          location_preferences?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          professional_title?: string | null
          summary?: string | null
          country?: string | null
          city?: string | null
          phone?: string | null
          avatar_url?: string | null
          location_preferences?: string[] | null
          updated_at?: string
        }
      }
      experiences: {
        Row: {
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
        Insert: {
          id?: string
          profile_id: string
          company: string
          position: string
          start_date: string
          end_date?: string | null
          current?: boolean
          description?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          company?: string
          position?: string
          start_date?: string
          end_date?: string | null
          current?: boolean
          description?: string | null
          location?: string | null
          updated_at?: string
        }
      }
      education: {
        Row: {
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
        Insert: {
          id?: string
          profile_id: string
          institution: string
          degree: string
          field: string
          start_date: string
          end_date?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          institution?: string
          degree?: string
          field?: string
          start_date?: string
          end_date?: string | null
          description?: string | null
          updated_at?: string
        }
      }
      certifications: {
        Row: {
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
        Insert: {
          id?: string
          profile_id: string
          name: string
          issuer: string
          issue_date?: string | null
          expiry_date?: string | null
          credential_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          issuer?: string
          issue_date?: string | null
          expiry_date?: string | null
          credential_id?: string | null
          updated_at?: string
        }
      }
      languages: {
        Row: {
          id: string
          profile_id: string
          language: string
          level: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          language: string
          level: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          language?: string
          level?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          normalized_name: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          normalized_name: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          normalized_name?: string
          category?: string | null
        }
      }
      profile_skills: {
        Row: {
          profile_id: string
          skill_id: string
          level: string | null
          years_experience: number | null
        }
        Insert: {
          profile_id: string
          skill_id: string
          level?: string | null
          years_experience?: number | null
        }
        Update: {
          profile_id?: string
          skill_id?: string
          level?: string | null
          years_experience?: number | null
        }
      }
      job_sources: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          provider_type: string
          enabled?: boolean
          configuration?: Record<string, unknown>
          last_sync_at?: string | null
          last_success_at?: string | null
          last_error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          provider_type?: string
          enabled?: boolean
          configuration?: Record<string, unknown>
          last_sync_at?: string | null
          last_success_at?: string | null
          last_error?: string | null
          updated_at?: string
        }
      }
      jobs: {
        Row: {
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
        Insert: {
          id?: string
          source_id: string
          external_id: string
          title: string
          company: string
          description?: string | null
          location?: string | null
          country?: string | null
          city?: string | null
          employment_type?: string | null
          work_mode?: string | null
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string | null
          experience_level?: string | null
          posted_at?: string | null
          application_url?: string | null
          source_url?: string | null
          source_metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_id?: string
          external_id?: string
          title?: string
          company?: string
          description?: string | null
          location?: string | null
          country?: string | null
          city?: string | null
          employment_type?: string | null
          work_mode?: string | null
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string | null
          experience_level?: string | null
          posted_at?: string | null
          application_url?: string | null
          source_url?: string | null
          source_metadata?: Record<string, unknown>
          updated_at?: string
        }
      }
      job_skills: {
        Row: {
          job_id: string
          skill_id: string
          requirement_type: string
          importance: string | null
        }
        Insert: {
          job_id: string
          skill_id: string
          requirement_type: string
          importance?: string | null
        }
        Update: {
          job_id?: string
          skill_id?: string
          requirement_type?: string
          importance?: string | null
        }
      }
      saved_jobs: {
        Row: {
          id: string
          user_id: string
          job_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
        }
      }
      matches: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          job_id: string
          score: number
          summary?: string | null
          matched_skills: string[]
          missing_skills: string[]
          strengths: string[]
          risks: string[]
          explanation?: string | null
          model_metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          score?: number
          summary?: string | null
          matched_skills?: string[]
          missing_skills?: string[]
          strengths?: string[]
          risks?: string[]
          explanation?: string | null
          model_metadata?: Record<string, unknown>
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          job_id: string
          status: string
          applied_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          status?: string
          applied_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          status?: string
          applied_at?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      application_outputs: {
        Row: {
          id: string
          application_id: string
          type: string
          content: string
          source_version: number
          ai_generated: boolean
          user_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          type: string
          content: string
          source_version?: number
          ai_generated?: boolean
          user_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          type?: string
          content?: string
          source_version?: number
          ai_generated?: boolean
          user_approved?: boolean
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          actor_user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          metadata: Record<string, unknown>
          created_at: string
        }
        Insert: {
          id?: string
          actor_user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          metadata?: Record<string, unknown>
          created_at?: string
        }
        Update: {
          id?: string
          actor_user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          metadata?: Record<string, unknown>
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: string
          type: string
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          type: string
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          type?: string
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
    }
  }
}
