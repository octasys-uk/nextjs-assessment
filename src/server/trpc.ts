import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from './context'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

// BUG: Middleware doesn't properly check authorization
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // BUG: Only checks if session exists, not if it's valid
  // BUG: Doesn't verify session expiration
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})
