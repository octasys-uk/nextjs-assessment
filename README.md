# AI App Builder - Senior Developer Assessment

**IMPORTANT: READ [ASSESSMENT.md](ASSESSMENT.md) FIRST**

This is a technical assessment project containing intentional bugs and issues that need to be fixed. The challenge is to identify and fix realistic production bugs in an AI-powered app builder.

## The Challenge

Fix a broken AI app builder with 10 realistic bugs:

**🔴 Critical (P0):**
1. Memory leak in real-time preview
2. Race condition in AI generation
3. Database connection pool exhaustion

**🟡 High Priority (P1):**
4. Authentication bypass vulnerability
5. N+1 query problem
6. File upload race condition

**🟢 Medium Priority (P2):**
7. React hydration mismatch
8. Infinite re-render loop
9. TypeScript type safety issues
10. Stale data after mutations

### Requirements
- **Minimum:** Fix at least 6 out of 10 bugs
- **Deliverable:** Document fixes in SOLUTIONS.md
- **Priority:** Fix P0 issues first, then P1, then P2

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- OpenAI API key (for AI generation features)

### Setup Instructions

You can use automated setup scripts or follow manual instructions:

#### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your credentials:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `OPENAI_API_KEY`: Your OpenAI API key

3. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Testing Authentication

After seeding, you can use these test tokens:

- **User 1**: `test-token-1` (test@example.com)
- **User 2**: `test-token-2` (john@example.com)

To authenticate:
1. Go to `/login` page
2. Enter any email/password (authentication is simulated)
3. Or manually set the token in localStorage:
   ```javascript
   localStorage.setItem('auth_token', 'test-token-1')
   ```

## Project Structure

```
nextjs-assessment/
├── 📖 Documentation
│   ├── README.md              ← You are here
│   ├── ASSESSMENT.md          ← Main instructions
│   ├── QUICK_START.md         ← Quick start guide
│   └── PROJECT_OVERVIEW.md    ← Deep dive into architecture
│
├── 🔧 Setup Scripts
│   ├── setup.sh               ← macOS/Linux automated setup
│   └── setup.ps1              ← Windows automated setup
│
├── 📝 Templates
│   └── SOLUTIONS_TEMPLATE.md  ← Copy to SOLUTIONS.md for your fixes
│
├── ⚙️ Configuration
│   ├── .env.example           ← Environment variables template
│   ├── package.json           ← Dependencies
│   ├── tsconfig.json          ← TypeScript configuration
│   ├── next.config.js         ← Next.js configuration
│   └── tailwind.config.ts     ← Tailwind CSS configuration
│
├── 💾 Database
│   └── prisma/
│       ├── schema.prisma      ← Database schema (has bugs!)
│       └── seed.ts            ← Test data seeder
│
└── 💻 Application Code
    └── src/
        ├── app/               ← Next.js pages (bugs #7, #10)
        │   ├── projects/      ← Project list and detail pages
        │   ├── login/         ← Login page
        │   └── api/trpc/      ← tRPC API endpoint
        ├── components/        ← React components (bugs #1, #8)
        │   ├── ComponentEditor.tsx  ← Code editor (infinite loop bug)
        │   └── LivePreview.tsx      ← Preview iframe (memory leak)
        ├── lib/               ← Utilities (bug #3)
        │   ├── prisma.ts      ← Prisma client (connection pool issue)
        │   ├── supabase.ts    ← Supabase client
        │   └── trpc.ts        ← tRPC client setup
        └── server/            ← Backend (bugs #2, #4, #5, #6)
            ├── context.ts     ← tRPC context (auth bypass vulnerability)
            ├── trpc.ts        ← tRPC router setup
            └── routers/       ← API routers
                ├── project.ts ← Project CRUD (N+1 queries, auth bypass)
                ├── ai.ts      ← AI generation (race conditions)
                └── file.ts    ← File upload (race conditions)
```

## Your Task

1. **Read [ASSESSMENT.md](ASSESSMENT.md) completely** before coding
2. **Set up the project** and verify it runs
3. **Copy SOLUTIONS_TEMPLATE.md** to SOLUTIONS.md
4. **Identify and fix bugs** (minimum 6/10)
5. **Document your fixes** in SOLUTIONS.md
6. **Add code comments** explaining critical fixes
7. **Test your fixes** - Don't assume they work

## FAQ

### Q: Can I use AI assistants like ChatGPT or Claude?
**A:** No, this tests YOUR skills. The use of AI assistants will be detected and result in disqualification.

### Q: Can I use Google/documentation?
**A:** Yes! MDN, React docs, Prisma docs, etc. are all fair game. Real developers use documentation.

### Q: What if I can't finish all 10 bugs?
**A:** That's expected. Fix minimum 6, prioritize P0 first. Quality over quantity.

### Q: How do I submit my work?
**A:** Commit your changes and fill out SOLUTIONS.md with detailed explanations of your fixes.

### Q: Can I add tests?
**A:** Yes! Bonus points for testing your fixes, though it's not required.

### Q: Can I refactor code beyond fixing bugs?
**A:** Minor refactoring to support your fixes is fine, but don't rewrite the entire application.

## Ready to Start?

1. ✅ Read [ASSESSMENT.md](ASSESSMENT.md) thoroughly
2. ✅ Complete setup (automated or manual)
3. ✅ Copy SOLUTIONS_TEMPLATE.md to SOLUTIONS.md
4. 🚀 **BEGIN FIXING BUGS!**

---

## Good Luck!

This is a challenging but fair assessment. The goal is to evaluate real-world skills in a realistic scenario. Not everyone will fix all 10 bugs (and that's okay!) - how you approach problems matters as much as the fixes themselves.

**Now go build something amazing!**
