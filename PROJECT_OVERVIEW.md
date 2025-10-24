
```
nextjs-assessment/
│
├── ASSESSMENT.md              # Main instructions for candidates
├── README.md                  # Quick start guide
├── SOLUTIONS_TEMPLATE.md      # Where candidates document fixes
├── PROJECT_OVERVIEW.md       # This file
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Bug #7 (hydration)
│   │   ├── page.tsx          # Homepage
│   │   ├── providers.tsx     # tRPC provider
│   │   ├── projects/
│   │   │   ├── page.tsx      # Bug #5 (N+1), #10 (cache)
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Bug #4 (auth)
│   │   └── api/trpc/         # tRPC endpoint
│   │
│   ├── components/
│   │   ├── ComponentEditor.tsx  # Bug #8 (infinite loop)
│   │   └── LivePreview.tsx      # Bug #1 (memory leak)
│   │
│   ├── lib/
│   │   ├── prisma.ts         # Bug #3 (connection pool)
│   │   ├── supabase.ts       # Supabase config
│   │   └── trpc.ts           # tRPC client
│   │
│   └── server/
│       ├── context.ts        # Bug #4 (auth)
│       ├── trpc.ts           # tRPC setup
│       └── routers/
│           ├── _app.ts       # Root router
│           ├── project.ts    # Bugs #4, #5
│           ├── ai.ts         # Bug #2 (race condition)
│           └── file.ts       # Bug #6 (upload)
│
├── prisma/
│   ├── schema.prisma         # Missing indexes, cascades
│   └── seed.ts               # Test data
│
└── setup scripts...
```

