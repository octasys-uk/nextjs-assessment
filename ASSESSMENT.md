# Senior Next.js Developer Technical Assessment

**Difficulty: Senior Level**

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: tRPC, Next.js API Routes
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **AI Integration**: OpenAI API
- **Real-time**: Supabase Realtime Subscriptions

## The App

An AI-powered application builder where users can:
1. Create projects with AI-generated code
2. Edit components in real-time
3. Preview generated applications
4. Collaborate with team members
5. Deploy applications

## Known Issues (From Bug Reports)

### Critical Issues

1. **Memory Leak in Real-time Preview** (P0)
   - Users report browser tabs crashing after 5-10 minutes
   - Memory usage grows continuously
   - Location: Preview component with WebSocket connections

2. **Race Condition in AI Generation** (P0)
   - Sometimes generates incorrect code or crashes
   - Multiple requests override each other
   - Inconsistent state between UI and database
   - Location: AI generation flow

3. **Database Connection Pool Exhaustion** (P0)
   - Application becomes unresponsive after moderate usage
   - "Too many connections" errors in logs
   - Location: Prisma client initialization

### High Priority Issues

4. **Authentication Bypass Vulnerability** (P1)
   - Users can access other users' projects by manipulating URLs
   - Missing authorization checks in tRPC procedures
   - Location: Project router

5. **N+1 Query Problem** (P1)
   - Dashboard takes 15+ seconds to load
   - Excessive database queries
   - Location: Projects list endpoint

6. **File Upload Race Condition** (P1)
   - Large files sometimes get corrupted
   - Progress bar shows 100% but file isn't saved
   - Missing chunk reassembly logic
   - Location: File upload handler

### Medium Priority Issues

7. **React Hydration Mismatch** (P2)
   - Console warnings on every page load
   - Flashing content on client
   - Location: Layout components

8. **Infinite Re-render Loop** (P2)
   - Component state updates trigger endless renders
   - Browser becomes unresponsive
   - Location: ComponentEditor

9. **TypeScript Type Safety Issues** (P2)
   - Liberal use of `any` types
   - Missing proper tRPC inference
   - No proper error handling types

10. **Stale Data After Mutations** (P2)
    - UI doesn't update after creating/editing projects
    - tRPC cache invalidation missing
    - Location: Project mutations

## Deliverables

1. **Fixed Code**
   - Fix as many issues as possible (minimum 6 out of 10)
   - Prioritize by severity (P0 > P1 > P2)

2. **SOLUTIONS.md File**
   - Document each issue you fixed
   - Explain the root cause
   - Describe your solution
   - Note any trade-offs

3. **Code Review Comments**
   - Add comments in the code explaining critical fixes
   - Document any remaining tech debt

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see `.env.example`)

3. Run Prisma migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Seed database (optional):
   ```bash
   npm run db:seed
   ```

## Testing Your Fixes

1. Run the test suite:
   ```bash
   npm test
   ```

2. Check for memory leaks:
   - Open Chrome DevTools > Memory
   - Take heap snapshot before/after using preview

3. Test authentication:
   - Try accessing other users' projects
   - Test all protected routes

4. Load test the dashboard:
   - Create multiple projects
   - Check query performance

## Bonus Challenges

If you finish early:
- Add proper error boundaries
- Implement optimistic updates
- Add E2E tests for critical flows
- Improve TypeScript strict mode compliance
- Add rate limiting to AI endpoints

## Submission

Document your changes in `SOLUTIONS.md` and be prepared to:
1. Walk through your fixes
2. Explain architectural decisions
3. Discuss alternative approaches
4. Identify remaining issues

Good luck!