# AGENTS.md — OpenHands Execution Rules

## Project: Job AI Europe

This file defines permanent execution rules for AI agents working on this project.

---

## 1. Architecture Authority

**ARCHITECTURE.md** is the single source of truth for project architecture.

All agents MUST read ARCHITECTURE.md before implementing any feature.

---

## 2. Phase Roadmap (LOCKED)

This project has exactly 7 phases:

| Phase | Name | Status |
|-------|------|--------|
| Phase 0 | Foundation | ✅ COMPLETE |
| Phase 1 | Authentication | ✅ COMPLETE | |
| Phase 2 | Professional Profile | ✅ COMPLETE | |
| Phase 3 | Job Search | ✅ COMPLETE | |
| Phase 4 | AI Matching | ✅ COMPLETE |
| Phase 5 | Applications | NOT STARTED |
| Phase 6 | AI Assistant | NOT STARTED |

**Do NOT create Phase 7 or additional phases.**

---

## 3. Phase 0 — Foundation (COMPLETE)

Phase 0 established the technical foundation and MUST NOT be modified without explicit authorization.

### Phase 0 Components:

**Frontend Foundation:**
- React 18 + TypeScript + Vite
- TailwindCSS styling
- i18n support (EN, DE, FR, AR, IT, ES)
- Arabic RTL support
- UI component library
- Feature-based module structure

**Backend Foundation:**
- Supabase integration
- PostgreSQL database
- Row Level Security (RLS)
- Server-side architecture

**Database Schema (Phase 0):**
- profiles (user profiles)
- experiences (work history)
- education (education records)
- certifications (professional certifications)
- languages (language skills)
- skills (canonical skill catalogue)
- profile_skills (user skill associations)
- job_sources (job provider configuration)
- jobs (normalized job listings)
- job_skills (job skill requirements)
- saved_jobs (user saved jobs)
- matches (job profile matches)
- applications (job applications)
- application_outputs (generated application materials)
- audit_logs (admin action logs)
- system_settings (configuration)

**RLS Policies:**
- User-owned tables: profiles, experiences, education, certifications, languages, profile_skills, saved_jobs, matches, applications, application_outputs
- Public tables: jobs, skills, job_skills
- Admin tables: job_sources, audit_logs, system_settings

**Triggers:**
- update_updated_at_column() - auto-update timestamps
- handle_new_user() - auto-create profile on user registration

**Seed Data:**
- 37 default skills (JavaScript, Python, React, AWS, etc.)

---

## 4. Technology Stack (LOCKED)

| Component | Technology |
|-----------|------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| AI | OpenAI (server-side) |
| Job Sources | TheirStack (configurable provider) |
| i18n | EN, DE, FR, AR (RTL), IT, ES |

---

## 5. Repository Structure

```
job-ai/
├── apps/
│   └── web/                    # React web application
│       └── src/
│           ├── app/            # App routes and pages
│           ├── components/     # Reusable UI components
│           ├── features/       # Feature modules
│           ├── hooks/         # Custom React hooks
│           ├── services/      # API services
│           ├── stores/        # Zustand stores
│           ├── types/         # TypeScript types
│           ├── validation/    # Form validation schemas
│           ├── i18n/          # Internationalization
│           └── lib/           # Utilities and helpers
├── packages/
│   ├── types/                  # Shared TypeScript types
│   ├── validation/            # Shared validation schemas
│   ├── ui/                    # Shared UI components
│   └── config/                # Shared configuration
├── supabase/
│   ├── migrations/            # Database migrations
│   └── functions/             # Supabase Edge Functions
├── tests/
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
├── .env.example               # Environment template
├── ARCHITECTURE.md            # Master architecture
├── README.md                  # Project documentation
├── AGENTS.md                 # This file
└── STATUS.md                 # Project status
```

---

## 6. Supabase Configuration

**Project URL:** `https://waxkzbegqmepopwsycpl.supabase.co`

### Client-Safe Variables (public):
```
VITE_SUPABASE_URL=https://waxkzbegqmepopwsycpl.supabase.co
VITE_SUPABASE_ANON_KEY=<safe-to-expose>
VITE_APP_ENV=development|production
VITE_APP_URL=<application-url>
```

### Server-Only Variables (NEVER expose):
```
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
THEIRSTACK_API_KEY
```

---

## 7. Database Migration Rules

1. All database changes MUST use migrations in `supabase/migrations/`
2. NEVER modify existing migration files
3. Create new migration files for each change
4. Migration naming: `{sequence}_{description}.sql`
5. All tables have RLS enabled (except public read tables)
6. User data is protected by ownership-based RLS policies
7. Admin tables require service_role for modification

---

## 8. Security Rules

### Authentication & Authorization:
- Supabase Auth for authentication
- RLS for data authorization
- User can only access their own private data
- Admin operations require service_role
- All protected endpoints verify session and ownership

### Secrets:
- NEVER commit secrets to repository
- NEVER expose service_role keys to client
- NEVER expose API keys in frontend code
- Use environment variables for all secrets

### Data Protection:
- profiles: user owns their own profile
- experiences, education, certifications, languages: owned via profile
- saved_jobs, matches, applications: user owns directly
- jobs, skills, job_skills: public read
- job_sources, audit_logs, system_settings: admin only

---

## 9. Rules for Future Agents

### BEFORE ANY WORK:
1. Read ARCHITECTURE.md completely
2. Read AGENTS.md (this file)
3. Read STATUS.md for current state
4. Verify current phase in STATUS.md

### IMPLEMENTATION RULES:
- Follow the phase order: Phase 0 → Phase 1 → Phase 2 → ...
- Implement only the current phase's scope
- Do not implement later-phase features before their dependencies exist
- Keep domain responsibilities separated (AUTH ≠ PROFILE ≠ JOBS ≠ MATCHING ≠ APPLICATIONS ≠ AI ASSISTANT)
- Use service abstractions for external integrations

### MODIFICATION RULES:
- Do NOT modify Phase 0 foundation without explicit authorization
- Do NOT modify database schema without new migration
- Do NOT modify RLS policies without justification
- Do NOT modify existing triggers or functions
- Do NOT remove implemented features
- Do NOT change technology stack without architectural approval

### PHASE COMPLETION:
- A phase is complete only when all its components are implemented and tested
- Update STATUS.md when phase is verified complete
- Do not mark phase as complete until all requirements are met

---

## 10. Phase 0 Boundaries (IMmutable)

Phase 0 established these boundaries that future phases must respect:

### Database:
- 16 tables with defined schema
- 26 indexes for performance
- 11 triggers for automation
- 51 RLS policies for security
- 37 seed skills

### Frontend:
- React 18 + TypeScript + Vite
- TailwindCSS
- i18n with 6 languages
- Component library structure
- Feature module structure

### Backend:
- Supabase as backend-as-a-service
- PostgreSQL database
- Auth integration
- RLS enforcement

### Configuration:
- Environment-based configuration
- Client-safe and server-only variable separation

---

## 11. Environment Variables

### Client-Safe (VITE_ prefix):
```env
VITE_SUPABASE_URL=https://waxkzbegqmepopwsycpl.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-key>
VITE_APP_ENV=development|production
VITE_APP_URL=http://localhost:3000
VITE_ENABLE_AI_FEATURES=false|true
VITE_ENABLE_JOB_SEARCH=false|true
```

### Server-Only (NEVER expose):
```env
SUPABASE_SERVICE_ROLE_KEY=<secret-key>
OPENAI_API_KEY=<secret-key>
THEIRSTACK_API_KEY=<secret-key>
```

---

## 12. Git Rules

- Commit message format: `{Phase} - {Brief description}`
- Example: `Phase 0 - Foundation: Project structure, UI components, i18n`
- Do NOT commit secrets, .env files, or sensitive data
- Keep commits focused and coherent
- Update STATUS.md when phase completes

---

## 13. Documentation Requirements

### AGENTS.md (this file):
- Permanent execution rules
- Phase boundaries
- Technology stack
- Security rules

### STATUS.md:
- Current project state
- Phase completion status
- GitHub and Supabase state
- Pending work

### ARCHITECTURE.md:
- Master architecture specification
- Phase dependencies
- Feature requirements

---

## 14. Explicit Prohibitions

Future agents MUST NOT:
1. Modify Phase 0 foundation without explicit authorization
2. Create Phase 7 or additional phases
3. Change technology stack without architectural approval
4. Remove implemented RLS policies or security measures
5. Expose secrets in code or commits
6. Implement features out of phase order
7. Modify existing migration files
8. Bypass authentication/authorization for convenience
9. Create fake production data
10. Claim features are complete without verification

---

## 15. Current Project State

See STATUS.md for current state.

Current phase: **Phase 4 COMPLETE**

Next phase: **Phase 5 - Applications**
