# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript tenancy application system for Palmer Partners, built with Vite, shadcn/ui, Tailwind CSS, and Supabase backend. The application manages a 6-step tenancy application form with admin dashboard, PDF generation, and email automation.

## Common Commands

```bash
# Development
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build for testing
npm run lint         # Run ESLint checks
npm run preview      # Preview production build
```

**Note:** No test framework is currently configured. When adding tests, you'll need to set up Vitest or Jest.

## Architecture Overview

### Core Technology Stack
- **Frontend:** React 18 + TypeScript + Vite
- **UI:** shadcn/ui components (Radix UI primitives) + Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Forms:** React Hook Form + Zod validation
- **State:** TanStack React Query + Context API

### Multi-Step Form System
The main feature is a 6-step tenancy application:
1. Property Details → 2. Personal Info → 3. Employment → 4. Current Address → 5. Additional Details → 6. Terms & Data

Form state is managed in `src/contexts/FormContext.tsx` with validation schemas in `src/domain/`.

### Component Organization
```
src/components/
├── ui/                          # shadcn/ui components (reusable)
├── tenancy-application/         # Multi-step form components
│   ├── steps/                   # Individual form steps
│   └── employment/              # Employment sub-components
├── admin/                       # Admin dashboard (12 components)
├── applicants/                  # Guarantor management
├── auth/                        # Authentication components
└── shared/                      # Cross-cutting UI components
```

### Key Services
- **PDF Generation:** `src/services/pdfService.ts` - Client-side PDF with jsPDF
- **Email:** Supabase edge functions for automated emails
- **Application Processing:** `src/services/applicationService.ts`

### Database Schema (Supabase)
- `tenancy_applications` - Main application data (uses JSON fields for flexibility)
- `activity_logs` - Application activity tracking
- `profiles` - User profiles
- `user_roles` - Role-based access (admin/user)

## Development Patterns

### Form Components
Form steps use React Hook Form with Zod validation. Follow the pattern in existing steps:
- Import form schema from `src/domain/`
- Use `useFormContext()` for multi-step form state
- Implement validation with `zodResolver`

### UI Components
Use shadcn/ui components from `src/components/ui/`. Custom components follow shadcn patterns with:
- `cn()` utility for className merging
- `forwardRef` for proper ref handling
- Tailwind CSS with design tokens

### API Integration
Supabase client is configured in `src/integrations/supabase/`. Use the existing service patterns:
- Services in `src/services/` for business logic
- Custom hooks in `src/hooks/` for data fetching
- Context providers for global state

### Styling
- Tailwind CSS with custom design system (orange primary #e35c00, Lexend font)
- Mobile-first responsive design
- Dedicated mobile CSS files for complex layouts
- Component-specific CSS in `src/styles/` when needed

## Configuration Notes

### Vite Setup
- Dev server runs on port 8080 (configured in vite.config.ts)
- File proxy to Supabase edge functions for PDF assets
- TypeScript path aliases: `@/` → `./src/`

### TypeScript Configuration
- Relaxed settings (`noImplicitAny: false`) for rapid development
- Path aliases configured for clean imports

### Supabase Integration
- Credentials are hardcoded (no .env file required for current setup)
- Edge functions handle email and file processing
- Row Level Security (RLS) policies control data access

## Known Gaps
- No test framework configured (recommend Vitest for Vite projects)
- No environment variables for credentials
- TypeScript could be more strict for better type safety