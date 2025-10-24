import { router } from '../trpc'
import { projectRouter } from './project'
import { aiRouter } from './ai'
import { fileRouter } from './file'

export const appRouter = router({
  project: projectRouter,
  ai: aiRouter,
  file: fileRouter,
})

export type AppRouter = typeof appRouter
