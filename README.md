# Job AI Europe

AI-powered international job search and application platform.

## Overview

Job AI Europe is an AI-powered professional job platform that helps users:

- Build a professional profile
- Search real jobs from multiple sources
- Get AI-powered job matching
- Generate job-specific CVs and cover letters
- Track job applications
- Get AI assistance for career guidance

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI (server-side)
- **Job Sources**: TheirStack (configurable)
- **i18n**: English, German, French, Arabic (RTL), Italian, Spanish

## Project Structure

```
job-ai/
├── apps/
│   └── web/                 # React web application
│       └── src/
│           ├── app/         # App routes and pages
│           ├── components/  # Reusable UI components
│           ├── features/   # Feature modules
│           ├── hooks/       # Custom React hooks
│           ├── services/   # API services
│           ├── stores/     # Zustand stores
│           ├── types/      # TypeScript types
│           ├── validation/ # Form validation schemas
│           ├── i18n/       # Internationalization
│           └── lib/        # Utilities and helpers
├── packages/
│   ├── types/      # Shared TypeScript types
│   ├── validation/ # Shared validation schemas
│   ├── ui/         # Shared UI components
│   └── config/     # Shared configuration
├── supabase/
│   ├── migrations/ # Database migrations
│   └── functions/  # Supabase Edge Functions
└── tests/
    ├── integration/ # Integration tests
    └── e2e/        # End-to-end tests
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Copy environment file:

```bash
cp .env.example .env
```

4. Configure environment variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Run database migrations:

```bash
pnpm db:migrate
```

6. Start the development server:

```bash
pnpm dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_APP_ENV` | Environment (development/production) |
| `VITE_APP_URL` | Application URL |

Server-side only (never expose to client):

| Variable | Description |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `OPENAI_API_KEY` | OpenAI API key |
| `THEIRSTACK_API_KEY` | TheirStack API key |

## Features

### Phase 0 - Foundation

- Project structure and configuration
- UI component library
- i18n with RTL support
- Supabase integration
- Database schema with RLS

### Phase 1 - Authentication

- User registration
- User login
- Session management
- Protected routes
- Role-based access

### Phase 2 - Professional Profile

- Personal information
- Work experience
- Education
- Certifications
- Languages
- Skills
- Job preferences

### Phase 3 - Job Search

- Real job data from providers
- Advanced search and filtering
- Job details
- Saved jobs

### Phase 4 - AI Matching

- Job analysis
- Profile analysis
- Skill matching
- Compatibility scoring
- Recommendations

### Phase 5 - Applications

- Job-specific CV generation
- Cover letter generation
- Application message generation
- Review and editing
- Application tracking

### Phase 6 - AI Assistant

- Context-aware assistance
- Profile help
- Job explanation
- Career guidance

## Testing

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run e2e tests
pnpm test:e2e
```

## Development

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Tailwind CSS for styling

### Database Changes

Always use migrations:

```bash
pnpm db:migrate
```

## Security

- Row Level Security (RLS) on all user data
- Server-side authentication
- Environment variable secrets
- Input validation
- No secrets in frontend code

## License

Private - All rights reserved
