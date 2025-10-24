import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const projectRouter = router({
  // BUG #5: N+1 Query Problem
  // ISSUE: Loading projects without includes causes multiple queries
  list: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      // BUG: Missing include for components, files, etc.
      // This causes N+1 queries when displaying project details
    })

    // BUG: Additional queries in loop - TERRIBLE performance
    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const components = await ctx.prisma.component.findMany({
          where: { projectId: project.id },
        })

        const files = await ctx.prisma.file.findMany({
          where: { projectId: project.id },
        })

        const deployments = await ctx.prisma.deployment.findMany({
          where: { projectId: project.id },
          orderBy: { createdAt: 'desc' },
          take: 1,
        })

        return {
          ...project,
          componentCount: components.length,
          fileCount: files.length,
          lastDeployment: deployments[0],
        }
      })
    )

    return projectsWithDetails
  }),

  // BUG #4: Authorization Bypass
  // ISSUE: No ownership verification - any user can access any project!
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: {
          components: true,
          files: true,
        },
      })

      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      // BUG: Missing authorization check!
      // Should verify: project.userId === ctx.session.user.id

      return project
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id,
        },
      })

      // BUG #10: Missing cache invalidation
      // UI won't update without manual refresh
      return project
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // BUG: No authorization check here either!
      const project = await ctx.prisma.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      })

      return project
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // BUG: No authorization check
      // BUG: No cascade delete handling for related records
      await ctx.prisma.project.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),
})
