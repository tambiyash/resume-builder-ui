# Resume Builder Studio

A modern, AI-powered resume builder designed to help job seekers create ATS-friendly resumes with intelligent optimization features.

## 🎯 Approach

The development approach was inspired by **Wozber.com's** minimalistic and user-focused UI/UX design. I provided detailed prompts along with screenshots and the actual product link to **v0 by Vercel** to generate a foundational skeleton UI that captured the clean, distraction-free editing experience.

### Development Journey:

1. **Initial Setup**: Published the first iteration to GitHub immediately after v0 generated the basic structure
2. **State Management**: Integrated **Zustand** with localStorage persistence to maintain resume data across sessions
3. **Authentication**: Implemented **Better Auth** for email/password and social logins (Google, LinkedIn)
4. **AI Resume Parsing**: Integrated **OpenAI API** to parse uploaded CV files (.doc, .docx, .txt, .pdf) and automatically populate the resume preview
5. **ATS Score Checker**: Built a micro-app that analyzes resumes against job postings (via URL or description) using OpenAI
6. **PDF Export**: Added download functionality using **html2canvas** and **jsPDF** to export resumes as A4-sized PDFs
7. **AI Resume Optimization**: Implemented intelligent resume improvement feature that uses OpenAI to optimize content for better ATS scores

## 🛠️ Tools & Technologies

### Core Framework
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library

### AI & Intelligence
- **OpenAI GPT-4o** - Resume parsing, ATS scoring, and content optimization
- **OpenAI GPT-4o-mini** - Fast AI processing for lighter tasks

### State Management
- **Zustand** - Lightweight state management with persistence
- **localStorage** - Client-side data persistence

### Authentication
- **Better Auth** - Modern authentication solution
  - Email/Password login
  - Google OAuth 2.0
  - LinkedIn OAuth 2.0
- **PostgreSQL** - Database for user data
- **Drizzle ORM** - Type-safe database queries

### PDF Generation
- **html2canvas** - HTML to canvas conversion
- **jsPDF** - Client-side PDF generation

### Development Tools
- **v0 by Vercel** - AI-powered UI generation
- **Cursor** - AI-assisted code editor
- **Bun** - Fast JavaScript runtime and package manager

## 💡 How This Module Contributes to the System

### User Journey:

1. **Authentication**
   - Users can sign up/login using email/password, Google, or LinkedIn
   - Secure session management with Better Auth
   - Profile page showing user details and connected accounts

2. **Resume Creation & Management**
   - Start with a clean, ATS-friendly template
   - Upload existing resume (supports .doc, .docx, .txt, .pdf)
   - AI automatically parses and populates resume data into structured fields
   - All data persists in Zustand store with localStorage backup

3. **Live Preview & Editing**
   - Real-time preview of resume as you edit
   - Section-based editing (Personal Info, Experience, Education, Skills, etc.)
   - Clean, distraction-free interface
   - Changes automatically saved

4. **ATS Score Analysis**
   - Analyze resume against any job posting (URL or description)
   - Get comprehensive feedback:
     - ATS compatibility score (0-100)
     - Strengths and gaps analysis
     - Keyword match/missing analysis
     - Actionable recommendations

5. **AI-Powered Optimization**
   - One-click resume improvement for specific jobs
   - AI rewrites experience bullets with:
     - Strong action verbs
     - Quantified achievements
     - Relevant keywords from job posting
   - Maintains truthfulness (never fabricates information)
   - Optimized data automatically updates in the editor

6. **PDF Export**
   - Download resume as professional A4-sized PDF
   - Preview modal before download
   - Maintains exact visual appearance
   - Print-ready quality with proper margins

### Key Features:

✅ **ATS-Friendly Templates** - Optimized for Applicant Tracking Systems  
✅ **AI Resume Parsing** - Extract data from existing resumes  
✅ **Smart Optimization** - Improve content for better ATS scores  
✅ **Real-time Preview** - See changes instantly  
✅ **Persistent State** - Never lose your work  
✅ **Multi-format Upload** - Support for DOC, DOCX, TXT, PDF  
✅ **Professional Export** - Download as high-quality PDF  
✅ **Social Login** - Quick authentication with Google/LinkedIn  

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database
- OpenAI API key
- Google OAuth credentials (optional)
- LinkedIn OAuth credentials (optional)

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Add your API keys and database URL

# Run database migrations
bun run db:push

# Start development server
bun run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=your-deployed-url

# OpenAI
OPENAI_API_KEY=sk-...

# Google OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# LinkedIn OAuth (optional)
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
```

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── analyze-cv/         # CV parsing endpoint
│   │   ├── calculate-ats/      # ATS scoring endpoint
│   │   ├── improve-resume/     # Resume optimization endpoint
│   │   └── auth/               # Authentication endpoints
│   ├── preview/                # Resume editor page
│   ├── profile/                # User profile page
│   ├── login/                  # Login page
│   └── signup/                 # Signup page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── ats-score-modal.tsx     # ATS analysis modal
│   ├── resume-preview-modal.tsx # PDF preview modal
│   └── top-nav.tsx             # Navigation component
├── lib/
│   ├── auth.ts                 # Better Auth configuration
│   ├── auth-client.ts          # Auth client utilities
│   ├── store/                  # Zustand store
│   │   └── resume-store.ts     # Resume state management
│   └── pdf-generator.ts        # PDF export utilities
```

## 🎨 Features in Detail

### 1. AI Resume Parsing
Upload your existing resume and watch as OpenAI extracts:
- Personal information (name, email, phone, location)
- Professional summary
- Work experience with bullet points
- Education history
- Skills, languages, and certificates

### 2. ATS Score Checker
Enter a job URL or paste the job description to get:
- **Score**: 0-100 compatibility rating
- **Summary**: Brief assessment of fit
- **Strengths**: What makes you a good candidate
- **Gaps**: Areas where you fall short
- **Recommendations**: Specific improvements to make
- **Keyword Analysis**: Matched and missing keywords

### 3. Smart Resume Optimizer
Click "Improve Resume for This Job" to:
- Rewrite experience bullets for impact
- Add relevant keywords from job posting
- Quantify achievements
- Optimize professional summary
- Maintain factual accuracy

### 4. Professional PDF Export
Download your resume with:
- A4 page size (210mm × 297mm)
- High-quality rendering (2x scale)
- Proper margins (20mm sides, 25mm bottom)
- Multi-page support with top margins
- Preview modal with 3-second countdown

## 🔒 Security & Privacy

- Secure authentication with Better Auth
- Session management with HTTP-only cookies
- Environment variables for sensitive data
- No resume data stored on servers (client-side only)
- Zustand state persisted in user's localStorage

## 🚧 What More Could I Have Done, Given More Time?

While this project demonstrates a comprehensive set of features, there are several areas that could be further enhanced with additional time:

### 1. Enhanced UI/UX & Animations
I prioritized implementing core functionalities to showcase my abilities as a **Fullstack Developer** rather than just a Frontend specialist. With more time, I would:
- Add **charismatic animations** and micro-interactions using **Framer Motion**
- Implement smooth page transitions and loading states
- Create a more visually striking design with advanced CSS techniques
- Add interactive elements like drag-and-drop for resume sections
- Design custom illustrations and graphics
- Implement advanced theme customization options

### 2. LinkedIn Profile Integration
The current implementation uses LinkedIn OAuth for authentication, but I wanted to fetch comprehensive profile data post-authentication. However:
- **LinkedIn APIs** only provide full profile access to apps in the **Affiliated Partner Program**
- With partnership access, I could have:
  - Auto-populated work experience from LinkedIn profile
  - Imported skills, endorsements, and recommendations
  - Synced education history and certifications
  - Pulled profile summary and headline
  - Integrated LinkedIn connections for networking features

### 3. Better Code Architecture
While functional, the codebase could benefit from:
- **Design System Implementation**:
  - Centralized theme tokens and design variables
  - Standardized component patterns
  - Consistent spacing, typography, and color scales
- **Modularization**:
  - Breaking down large components into smaller, reusable pieces
  - Creating a proper component library structure
  - Separating business logic from presentation
- **DRY (Don't Repeat Yourself) Principles**:
  - Extracting common patterns into utilities
  - Creating shared hooks for repeated logic
  - Implementing proper abstraction layers

### 4. Testing & Quality Assurance
A production-ready application should have comprehensive testing:
- **Unit Tests** with **Vitest**:
  - Testing individual functions and components
  - Mocking API calls and external dependencies
  - Ensuring edge cases are handled
- **Integration Tests**:
  - Testing component interactions
  - Verifying state management flows
  - API endpoint testing
- **End-to-End Tests** with **Playwright**:
  - Full user journey testing
  - Cross-browser compatibility
  - Critical path validation (auth flow, resume creation, PDF download)
- **TDD Approach**:
  - Writing tests before implementation
  - Ensuring better code coverage
  - Catching bugs earlier in development

### 5. Additional Features
- **Resume Templates**: Multiple professional templates (currently only one free template)
- **Collaboration**: Share resume with mentors/peers for feedback
- **Version History**: Track changes and revert to previous versions
- **Cover Letter Builder**: Companion tool for job applications
- **Job Tracking**: Integrated job application tracker
- **Analytics**: Track resume views and download metrics
- **AI Suggestions**: Real-time writing suggestions while editing
- **Mobile App**: Native mobile experience with React Native

### 6. Performance Optimization
- Implement proper code splitting and lazy loading
- Optimize bundle size and reduce initial load time
- Add service worker for offline functionality
- Implement proper caching strategies
- Use React Server Components more effectively

### 7. Accessibility & Internationalization
- WCAG 2.1 AA compliance
- Keyboard navigation improvements
- Screen reader optimization
- Multi-language support (i18n)
- RTL (Right-to-Left) language support

Despite these potential enhancements, the current implementation demonstrates a solid foundation with **production-ready authentication**, **AI-powered features**, and **core resume building functionality** that delivers real value to users.

## 📝 License

This project is part of a portfolio/assignment demonstration.

## 🚀 Deployment to Vercel

### Database Setup Options

#### Option 1: Vercel Postgres (Recommended)

1. **Create a Vercel Postgres Database**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Storage → Create Database → Postgres
   - Choose your preferred region
   - Click "Create"

2. **Connect to Your Project**:
   - After creation, go to the `.env.local` tab
   - Copy the `POSTGRES_URL` or `DATABASE_URL`
   - Add it to your project's environment variables in Vercel

3. **Set Environment Variables in Vercel**:
   ```
   DATABASE_URL=postgres://...         (from Vercel Postgres)
   BETTER_AUTH_SECRET=your-secret-key  (generate with: openssl rand -base64 32)
   BETTER_AUTH_URL=https://your-app.vercel.app
   OPENAI_API_KEY=sk-...
   GOOGLE_CLIENT_ID=...                (optional)
   GOOGLE_CLIENT_SECRET=...            (optional)
   LINKEDIN_CLIENT_ID=...              (optional)
   LINKEDIN_CLIENT_SECRET=...          (optional)
   ```

4. **Run Migrations**:
   After deployment, run migrations using Vercel CLI or add a build script:
   ```bash
   # Using Vercel CLI locally
   vercel env pull .env.local
   bun run db:push
   
   # Or add to package.json
   "scripts": {
     "vercel-build": "bun run db:push && next build"
   }
   ```

#### Option 2: Neon (Serverless Postgres)

[Neon](https://neon.tech) offers a generous free tier with serverless PostgreSQL:

1. **Create Account**: Sign up at [neon.tech](https://neon.tech)
2. **Create Project**: Create a new project and copy the connection string
3. **Add to Vercel**: Paste the connection string as `DATABASE_URL` in Vercel environment variables

#### Option 3: Supabase

[Supabase](https://supabase.com) provides free PostgreSQL with additional features:

1. **Create Project**: Sign up and create a project at [supabase.com](https://supabase.com)
2. **Get Connection String**: 
   - Go to Project Settings → Database
   - Copy the "Connection string" (URI mode)
3. **Add to Vercel**: Use as `DATABASE_URL` in environment variables

#### Option 4: Railway

[Railway](https://railway.app) offers easy PostgreSQL deployment:

1. **Create Project**: Sign up at [railway.app](https://railway.app)
2. **Add PostgreSQL**: Click "New" → "Database" → "PostgreSQL"
3. **Get Connection String**: Copy from the "Connect" tab
4. **Add to Vercel**: Use as `DATABASE_URL`

### Deployment Steps

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**:
   - In the Vercel import screen, add all environment variables
   - Make sure to update `BETTER_AUTH_URL` with your Vercel URL

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

5. **Update OAuth Redirect URIs**:
   After deployment, update your OAuth provider settings:
   
   **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Add `https://your-app.vercel.app/api/auth/callback/google` to Authorized redirect URIs
   
   **LinkedIn OAuth**:
   - Go to [LinkedIn Developers](https://www.linkedin.com/developers)
   - Add `https://your-app.vercel.app/api/auth/callback/linkedin` to Redirect URLs

6. **Run Database Migrations**:
   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel
   
   # Pull environment variables
   vercel env pull .env.local
   
   # Run migrations (if using Drizzle)
   bun run db:push
   
   # Or use Better Auth CLI
   npx @better-auth/cli migrate
   ```

### Post-Deployment Checklist

- ✅ Database connected and migrations run
- ✅ Environment variables set correctly
- ✅ OAuth redirect URIs updated
- ✅ `BETTER_AUTH_URL` points to production domain
- ✅ Test authentication flows
- ✅ Test OpenAI features (CV parsing, ATS scoring)
- ✅ Test PDF download functionality

### Troubleshooting

**Build Errors**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation succeeds locally

**Database Connection Issues**:
- Verify `DATABASE_URL` format is correct
- Check if database allows connections from Vercel's IP addresses
- For Vercel Postgres, use the provided connection string as-is

**Authentication Issues**:
- Ensure `BETTER_AUTH_URL` matches your deployed URL
- Verify OAuth redirect URIs are updated
- Check that `BETTER_AUTH_SECRET` is set

**API Errors**:
- Verify `OPENAI_API_KEY` is valid and has credits
- Check Vercel function logs for detailed error messages

### Cost Considerations

**Free Tier Limits**:
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Vercel Postgres**: 256MB storage, 60 hours compute time/month
- **Neon**: 3GB storage, 1 database
- **Supabase**: 500MB storage, 50MB file storage
- **Railway**: $5 free credit/month

For production use, consider upgrading based on traffic and storage needs.

## 🙏 Acknowledgments

- UI/UX inspiration from Wozber.com
- v0 by Vercel for initial UI scaffolding
- OpenAI for powerful AI capabilities
- Better Auth for authentication solution
- shadcn/ui for beautiful components

