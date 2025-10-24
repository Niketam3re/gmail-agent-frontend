# Gmail Agent - Frontend

AI-powered email management assistant built with Next.js 14 and Supabase.

## Milestone 0: Foundation ✅

This is the initial foundation with:
- ✅ Next.js 14 with App Router
- ✅ Supabase Auth (Google OAuth)
- ✅ Landing page
- ✅ Dashboard (protected route)
- ✅ TypeScript + Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Features

### Milestone 0 (Current)
- [x] Google OAuth authentication
- [x] Landing page
- [x] Protected dashboard
- [x] User profile display

### Milestone 1 (Next)
- [ ] Gmail connection UI
- [ ] View inbox
- [ ] Message detail view

### Milestone 2
- [ ] AI triage UI
- [ ] Label display

### Milestone 3
- [ ] Draft editor
- [ ] Approve & send

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Deployment

Deployed on Vercel via MCP.

## License

Private project
