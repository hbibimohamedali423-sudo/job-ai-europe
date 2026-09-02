-- Job AI Europe - Initial Database Schema
-- Phase 0 - Foundation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    professional_title TEXT,
    summary TEXT,
    country TEXT,
    city TEXT,
    location_preferences TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user lookup
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- ============================================
-- EXPERIENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    description TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experiences_profile_id ON experiences(profile_id);

-- ============================================
-- EDUCATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_education_profile_id ON education(profile_id);

-- ============================================
-- CERTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certifications_profile_id ON certifications(profile_id);

-- ============================================
-- LANGUAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    level TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_languages_profile_id ON languages(profile_id);

-- ============================================
-- SKILLS TABLE (Canonical skill catalogue)
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    normalized_name TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_normalized_name ON skills(normalized_name);

-- ============================================
-- PROFILE_SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profile_skills (
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level TEXT,
    years_experience NUMERIC,
    PRIMARY KEY (profile_id, skill_id)
);

CREATE INDEX idx_profile_skills_profile_id ON profile_skills(profile_id);
CREATE INDEX idx_profile_skills_skill_id ON profile_skills(skill_id);

-- ============================================
-- JOB SOURCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    provider_type TEXT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    configuration JSONB DEFAULT '{}',
    last_sync_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES job_sources(id),
    external_id TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    location TEXT,
    country TEXT,
    city TEXT,
    employment_type TEXT,
    work_mode TEXT,
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency TEXT,
    experience_level TEXT,
    posted_at TIMESTAMPTZ,
    application_url TEXT,
    source_url TEXT,
    source_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, external_id)
);

CREATE INDEX idx_jobs_source_id ON jobs(source_id);
CREATE INDEX idx_jobs_title ON jobs(title);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_country ON jobs(country);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- Full text search index
CREATE INDEX idx_jobs_search ON jobs USING GIN (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(company, ''))
);

-- ============================================
-- JOB_SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_skills (
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id),
    requirement_type TEXT NOT NULL CHECK (requirement_type IN ('required', 'preferred')),
    importance TEXT,
    PRIMARY KEY (job_id, skill_id)
);

CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill_id ON job_skills(skill_id);

-- ============================================
-- SAVED_JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);

-- ============================================
-- MATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL,
    summary TEXT,
    matched_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    strengths TEXT[] DEFAULT '{}',
    risks TEXT[] DEFAULT '{}',
    explanation TEXT,
    model_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_job_id ON matches(job_id);
CREATE INDEX idx_matches_score ON matches(score DESC);

-- ============================================
-- APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'applied', 'pending', 'interview', 'rejected', 'accepted')),
    applied_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ============================================
-- APPLICATION_OUTPUTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS application_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('cv', 'cover_letter', 'application_message')),
    content TEXT NOT NULL,
    source_version INTEGER DEFAULT 1,
    ai_generated BOOLEAN DEFAULT TRUE,
    user_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_application_outputs_application_id ON application_outputs(application_id);
CREATE INDEX idx_application_outputs_type ON application_outputs(type);

-- ============================================
-- AUDIT_LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- SYSTEM_SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'string',
    description TEXT,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_system_settings_key ON system_settings(key);

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_languages_updated_at BEFORE UPDATE ON languages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_sources_updated_at BEFORE UPDATE ON job_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_outputs_updated_at BEFORE UPDATE ON application_outputs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all user-owned tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_outputs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Experiences: Users can only access their own
CREATE POLICY "Users can view own experiences" ON experiences
    FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own experiences" ON experiences
    FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own experiences" ON experiences
    FOR UPDATE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own experiences" ON experiences
    FOR DELETE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Education: Users can only access their own
CREATE POLICY "Users can view own education" ON education
    FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own education" ON education
    FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own education" ON education
    FOR UPDATE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own education" ON education
    FOR DELETE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Certifications: Users can only access their own
CREATE POLICY "Users can view own certifications" ON certifications
    FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own certifications" ON certifications
    FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own certifications" ON certifications
    FOR UPDATE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own certifications" ON certifications
    FOR DELETE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Languages: Users can only access their own
CREATE POLICY "Users can view own languages" ON languages
    FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own languages" ON languages
    FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own languages" ON languages
    FOR UPDATE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own languages" ON languages
    FOR DELETE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Profile Skills: Users can only access their own
CREATE POLICY "Users can view own profile_skills" ON profile_skills
    FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own profile_skills" ON profile_skills
    FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own profile_skills" ON profile_skills
    FOR UPDATE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own profile_skills" ON profile_skills
    FOR DELETE USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Saved Jobs: Users can only access their own
CREATE POLICY "Users can view own saved_jobs" ON saved_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved_jobs" ON saved_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved_jobs" ON saved_jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Matches: Users can only access their own
CREATE POLICY "Users can view own matches" ON matches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own matches" ON matches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own matches" ON matches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own matches" ON matches
    FOR DELETE USING (auth.uid() = user_id);

-- Applications: Users can only access their own
CREATE POLICY "Users can view own applications" ON applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON applications
    FOR DELETE USING (auth.uid() = user_id);

-- Application Outputs: Users can only access their own
CREATE POLICY "Users can view own application_outputs" ON application_outputs
    FOR SELECT USING (application_id IN (SELECT id FROM applications WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own application_outputs" ON application_outputs
    FOR INSERT WITH CHECK (application_id IN (SELECT id FROM applications WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own application_outputs" ON application_outputs
    FOR UPDATE USING (application_id IN (SELECT id FROM applications WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own application_outputs" ON application_outputs
    FOR DELETE USING (application_id IN (SELECT id FROM applications WHERE user_id = auth.uid()));

-- Jobs: Public read access
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view jobs" ON jobs
    FOR SELECT USING (true);

-- Job Sources: Admin only (service role)
ALTER TABLE job_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage job_sources" ON job_sources
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Skills: Public read access
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills" ON skills
    FOR SELECT USING (true);

-- Job Skills: Public read access
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view job_skills" ON job_skills
    FOR SELECT USING (true);

-- Audit Logs: Admin only
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit_logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid()
            AND user_id IN (SELECT user_id FROM profiles WHERE user_id = auth.uid() AND user_id IN (
                SELECT user_id FROM profiles WHERE user_id = auth.uid()
            ))
        )
    );

-- System Settings: Admin only
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage system_settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid()
            AND (user_id IN (SELECT user_id FROM profiles WHERE user_id = auth.uid()))
        )
    );

-- ============================================
-- SEED DATA: Default Skills
-- ============================================
INSERT INTO skills (name, normalized_name, category) VALUES
    ('JavaScript', 'javascript', 'Programming Languages'),
    ('TypeScript', 'typescript', 'Programming Languages'),
    ('Python', 'python', 'Programming Languages'),
    ('Java', 'java', 'Programming Languages'),
    ('C++', 'cplusplus', 'Programming Languages'),
    ('C#', 'csharp', 'Programming Languages'),
    ('Go', 'go', 'Programming Languages'),
    ('Rust', 'rust', 'Programming Languages'),
    ('Ruby', 'ruby', 'Programming Languages'),
    ('PHP', 'php', 'Programming Languages'),
    ('Swift', 'swift', 'Programming Languages'),
    ('Kotlin', 'kotlin', 'Programming Languages'),
    ('SQL', 'sql', 'Databases'),
    ('PostgreSQL', 'postgresql', 'Databases'),
    ('MySQL', 'mysql', 'Databases'),
    ('MongoDB', 'mongodb', 'Databases'),
    ('Redis', 'redis', 'Databases'),
    ('React', 'react', 'Frameworks'),
    ('Angular', 'angular', 'Frameworks'),
    ('Vue.js', 'vuejs', 'Frameworks'),
    ('Node.js', 'nodejs', 'Frameworks'),
    ('Django', 'django', 'Frameworks'),
    ('Flask', 'flask', 'Frameworks'),
    ('Spring Boot', 'springboot', 'Frameworks'),
    ('AWS', 'aws', 'Cloud'),
    ('Azure', 'azure', 'Cloud'),
    ('Google Cloud', 'gcp', 'Cloud'),
    ('Docker', 'docker', 'DevOps'),
    ('Kubernetes', 'kubernetes', 'DevOps'),
    ('Git', 'git', 'Tools'),
    ('Machine Learning', 'machinelearning', 'AI/ML'),
    ('Deep Learning', 'deeplearning', 'AI/ML'),
    ('Data Science', 'datascience', 'Data'),
    ('Project Management', 'projectmanagement', 'Soft Skills'),
    ('Communication', 'communication', 'Soft Skills'),
    ('Leadership', 'leadership', 'Soft Skills'),
    ('Problem Solving', 'problemsolving', 'Soft Skills')
ON CONFLICT (name) DO NOTHING;
