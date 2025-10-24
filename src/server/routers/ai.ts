import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// BUG #2: Race Condition in AI Generation
// ISSUE: Multiple concurrent requests cause state inconsistencies
export const aiRouter = router({
  generateComponent: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        prompt: z.string(),
        componentName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // BUG: No locking mechanism for concurrent requests
      // BUG: Generation record created before AI response
      const generation = await ctx.prisma.aIGeneration.create({
        data: {
          userId: ctx.session.user.id,
          prompt: input.prompt,
          status: 'processing',
          response: '', // BUG: Empty response created
        },
      })

      try {
        // BUG: No timeout on OpenAI call
        // BUG: No retry logic for failures
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a React component generator. Generate only the component code.',
            },
            {
              role: 'user',
              content: input.prompt,
            },
          ],
        })

        const code = completion.choices[0]?.message?.content || ''

        // BUG: Race condition - multiple requests can create duplicate components
        // BUG: No check if component with same name exists
        const component = await ctx.prisma.component.create({
          data: {
            projectId: input.projectId,
            name: input.componentName,
            code: code,
            type: 'react',
          },
        })

        // BUG: Update happens after component creation
        // If this fails, we have orphaned component
        await ctx.prisma.aIGeneration.update({
          where: { id: generation.id },
          data: {
            status: 'completed',
            response: code,
          },
        })

        return component
      } catch (error: any) {
        // BUG: Error handling doesn't clean up partial state
        // Generation record left in 'processing' state
        await ctx.prisma.aIGeneration.update({
          where: { id: generation.id },
          data: {
            status: 'failed',
            response: error.message,
          },
        })

        throw error
      }
    }),

  regenerateComponent: protectedProcedure
    .input(
      z.object({
        componentId: z.string(),
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // BUG: No locking - multiple regenerate requests cause conflicts
      const component = await ctx.prisma.component.findUnique({
        where: { id: input.componentId },
      })

      if (!component) {
        throw new Error('Component not found')
      }

      // BUG: Race condition - component might be deleted while generating
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a React component generator.',
          },
          {
            role: 'user',
            content: `Regenerate this component: ${component.code}\n\nNew requirements: ${input.prompt}`,
          },
        ],
      })

      const newCode = completion.choices[0]?.message?.content || ''

      // BUG: Update might fail if component was deleted
      // No transaction to ensure atomicity
      const updated = await ctx.prisma.component.update({
        where: { id: input.componentId },
        data: { code: newCode },
      })

      return updated
    }),
})
