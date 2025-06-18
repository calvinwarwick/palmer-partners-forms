
# Tenancy Application System - Palmer & Partners

A comprehensive tenancy application management system built with React, TypeScript, and Supabase.

## Project info

**URL**: https://lovable.dev/projects/c0c4d145-b715-4d36-855a-41890ccb2e58

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI/Styling**: Tailwind CSS, shadcn/ui, Radix UI, Lexend font
- **Forms**: React Hook Form, Zod validation
- **Backend**: Supabase (PostgreSQL, Authentication, Edge Functions)
- **State Management**: TanStack React Query, React Context
- **Additional**: jsPDF, Recharts, Lucide React icons

## Features

- Multi-step tenancy application form
- Admin dashboard for application management
- PDF generation and document handling
- User authentication and role-based access
- Responsive design with mobile optimization
- Guarantor management system

## Local Development Setup

### Prerequisites

- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager
- Git

### Installation Steps

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Environment Setup**
   
   This project uses Supabase for backend services. The following environment variables are configured:
   - `SUPABASE_URL`: https://akgmvwevnljjhcjgnzly.supabase.co
   - `SUPABASE_ANON_KEY`: Already configured in the codebase
   
   No additional `.env` file is needed as the project uses direct configuration.

4. **Start the development server**
   ```sh
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── tenancy-application/  # Form-specific components
│   ├── admin/          # Admin dashboard components
│   └── applicants/     # Applicant management components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API and business logic services
├── styles/             # CSS modules and global styles
├── domain/             # TypeScript types and validation
└── integrations/       # External service integrations
```

### Database Setup

The project uses Supabase with the following key tables:
- User profiles and authentication
- Tenancy applications
- Email verification codes
- User roles and permissions

Database functions and RLS policies are automatically configured.

### Key Features & Routes

- `/` - Home page
- `/tenancy-application` - Multi-step application form
- `/admin` - Admin dashboard (requires authentication)
- `/applicants` - Applicant management
- `/login` - User authentication

### Mobile Optimization

The application is fully responsive with specific optimizations for:
- Touch-friendly form inputs (48px minimum height)
- Mobile-specific CSS classes
- Optimized spacing and typography
- Mobile form validation

### Authentication

The system supports:
- Email/password authentication
- Email verification codes
- Role-based access control
- Protected routes

## Deployment Options

### Lovable Platform (Recommended)

1. Open [Lovable](https://lovable.dev/projects/c0c4d145-b715-4d36-855a-41890ccb2e58)
2. Click Share → Publish
3. Your app will be deployed automatically

### Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain"
3. Follow the setup instructions

*Note: A paid Lovable plan is required for custom domains.*

### Manual Deployment

You can also deploy to other platforms like Vercel, Netlify, or any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables if needed

## Development Guidelines

- Follow the existing code structure and naming conventions
- Use TypeScript for all new code
- Implement responsive design with Tailwind CSS
- Write focused, single-responsibility components
- Use React Hook Form for form management
- Follow the established file organization patterns

## Support & Documentation

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- [Project Settings](https://lovable.dev/projects/c0c4d145-b715-4d36-855a-41890ccb2e58)

## Contributing

1. Create a feature branch from main
2. Make your changes following the project conventions
3. Test your changes locally
4. Submit a pull request with a clear description

For questions or issues, please use the Lovable project interface or Discord community.
