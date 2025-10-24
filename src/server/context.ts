import { CreateNextContextOptions } from '@trpc/server/adapters/next'
import prisma from '@/lib/prisma'

export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession(opts.req)

  return {
    prisma,
    session,
    req: opts.req,
    res: opts.res,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

// BUG #4: Authentication Bypass Vulnerability
// ISSUE: Session validation is weak and can be bypassed
async function getSession(req: any) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return null
  }

  // BUG: No token verification
  // BUG: No expiration check
  // BUG: Vulnerable to token manipulation
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  return session
}
