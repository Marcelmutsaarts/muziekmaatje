# CLAUDE.md - MuziekMaatje Project Guide

## Project Overview

**MuziekMaatje** is an AI-powered assistant specifically designed for singing pedagogues (voice teachers). The application helps music teachers prepare lessons and create personalized homework schemes for their students using Google's Gemini AI.

### Key Features
- **Lesson Preparation**: Generate structured lesson plans with student background, objectives, methodology, and level
- **Exercise Schemes**: Create personalized homework schedules based on lesson content and student availability
- **Editable Content**: In-place editing of generated content with visual indicators
- **PDF Export**: Generate PDFs of lesson plans and exercise schemes
- **Name Auto-fill**: Automatic student name extraction from lesson content
- **Professional Design**: Card-based layout with color-coded sections and timing indicators

## Common Commands

```bash
# Development
npm run dev                # Start development server (http://localhost:3000)
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Run ESLint checks

# Deployment
npm run netlify-build     # Build specifically for Netlify deployment
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.3.3 with TypeScript
- **Styling**: Tailwind CSS with custom gradients and responsive design
- **AI Integration**: Google Generative AI (Gemini 2.0 Flash)
- **PDF Generation**: jsPDF for client-side PDF creation
- **State Management**: React hooks (useState, useEffect)

### Key Dependencies
- `@google/generative-ai`: Gemini AI integration
- `jspdf`: PDF generation
- `mammoth`: DOCX file processing
- `pdf-parse`: PDF text extraction
- `next`: React framework

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main application with tab navigation
│   ├── layout.tsx                  # App layout and metadata
│   ├── globals.css                 # Tailwind CSS and global styles
│   └── api/
│       ├── lesson-prep/route.ts    # Gemini API for lesson preparation
│       └── exercise-scheme/route.ts # Gemini API for exercise schemes
├── components/
│   ├── LessonPrepForm.tsx          # Form for lesson preparation input
│   ├── LessonPrepDisplay.tsx       # Display and edit lesson preparations
│   ├── ExerciseSchemeForm.tsx      # Form for exercise scheme input
│   ├── ProfessionalExerciseDisplay.tsx # Professional card-based exercise display
│   ├── EditableContent.tsx         # Reusable in-place editing component
│   └── TabNavigation.tsx           # Tab switching between lesson prep and exercises
└── utils/
    ├── nameExtractor.ts            # Extract student names from generated content
    └── pdfGenerator.ts             # PDF generation utilities
```

## Environment Variables

Required environment variable in `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## Key Components & Patterns

### 1. Main Application (src/app/page.tsx)
- **Tab Management**: Switches between lesson preparation and exercise scheme
- **State Management**: Manages lesson content, exercise schemes, and student names
- **Name Auto-fill**: Automatically extracts student names from lesson prep and pre-fills exercise form

### 2. Editable Content Pattern (EditableContent.tsx)
- **In-place Editing**: Click to edit content directly
- **Keyboard Shortcuts**: Ctrl+S to save, Escape to cancel
- **Visual Indicators**: Shows edited state with blue border and "Bewerkt" badge
- **Auto-resize**: Textarea automatically adjusts height to content

### 3. Professional Exercise Display (ProfessionalExerciseDisplay.tsx)
- **Card-based Layout**: Color-coded sections with icons and timing
- **Section Parsing**: Automatically detects exercise sections and applies appropriate styling
- **Timeline View**: Visual progress bar showing exercise timing
- **Export Options**: PDF export, print, copy, and share functionality

### 4. API Integration Pattern
- **Streaming Responses**: Not currently implemented but architecture supports it
- **Error Handling**: Basic error handling in API routes
- **Dutch Language**: All prompts and responses in Dutch for Dutch-speaking users

## Teaching Methodologies

The application includes predefined teaching methodologies:
- Estill Voice Training
- Complete Vocal Technique (CVT)
- Speech Level Singing (SLS)
- Bel Canto
- Mix Voice Training
- Alexander Techniek
- Feldenkrais
- Lichtenberger Methode
- Algemene pedagogiek

## Student Levels

Predefined student levels:
- Beginner
- Gevorderd beginner
- Intermediate
- Gevorderd intermediate
- Professioneel

## Name Extraction Logic

The `nameExtractor.ts` utility uses multiple regex patterns to extract student names:
```typescript
const patterns = [
  /(?:voor:?\s*)([A-Za-z\s]+?)(?:\n|$|,|\.|;)/i,
  /(?:student|leerling):?\s*([A-Za-z\s]+?)(?:\n|$|,|\.|;)/i,
  /(?:naam|name):?\s*([A-Za-z\s]+?)(?:\n|$|,|\.|;)/i,
]
```

## PDF Generation

Uses jsPDF with automatic file naming:
- Lesson preparations: `lesvoorbereiding_DD-MM-YYYY.pdf`
- Exercise schemes: `oefenschema_[student]_DD-MM-YYYY.pdf`

## Share Functionality

Exercise schemes can be shared via unique links stored in localStorage:
- Generates random 9-character ID
- Stores content in `localStorage` with key `exercise-scheme-${id}`
- Creates shareable URL: `${window.origin}/share/${id}`

## Styling Patterns

### Color Scheme
- **Primary**: Purple gradients (`from-purple-500 to-purple-600`)
- **Secondary**: Blue to purple gradients for backgrounds
- **Exercise Categories**:
  - Warming up: Orange/Red (`from-orange-400 to-red-400`)
  - Technique: Blue/Indigo (`from-blue-400 to-indigo-400`)
  - Repertoire: Green/Emerald (`from-green-400 to-emerald-400`)
  - Homework: Purple/Violet (`from-purple-400 to-violet-400`)

### Responsive Design
- **Mobile-first**: Tailwind CSS responsive utilities
- **Grid Layouts**: `lg:grid-cols-2` for side-by-side layout on larger screens
- **Touch Targets**: Appropriate button sizes for mobile interaction

## Error Handling

### Common Issues
- **Missing API Key**: Check environment variables in development and deployment
- **Build Failures**: Clear `.next` cache with `rm -rf .next node_modules/.cache`
- **TypeScript Errors**: Run `npm run lint` to check for type issues

### Debugging Tips
- Check browser console for client-side errors
- Verify API responses in Network tab
- Test with different student names and content variations

## Future Enhancement Opportunities

1. **Real-time Collaboration**: Multiple teachers working on same lesson
2. **Template Library**: Pre-made lesson templates for different skill levels
3. **Student Progress Tracking**: Database integration for student history
4. **Audio Integration**: Voice memo support for lesson notes
5. **Calendar Integration**: Sync with teaching schedules
6. **Multilingual Support**: English and other language versions

## Deployment Notes

### Netlify (Current)
- Uses `netlify-build` script for optimized builds
- Environment variables configured in Netlify dashboard
- Automatic deployments from Git repository

### Local Development
- Ensure Node.js >= 18.0.0
- Install dependencies: `npm install`
- Set up `.env.local` with required API keys
- Start development: `npm run dev`

## Security Considerations

- API keys stored server-side only (never exposed to client)
- No user authentication currently implemented
- Content stored temporarily in localStorage for sharing
- HTTPS required for production deployment

## Performance Notes

- Client-side PDF generation for better user experience
- Optimized image loading and responsive images
- Lazy loading not currently implemented but recommended for future
- Bundle size kept minimal with selective imports

---

This documentation should help future Claude instances understand the project structure, key patterns, and common tasks when working with the MuziekMaatje codebase.