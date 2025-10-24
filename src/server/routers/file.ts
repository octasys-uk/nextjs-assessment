import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const fileRouter = router({
  // BUG #6: File Upload Race Condition
  // ISSUE: Chunked upload handling has race conditions
  uploadChunk: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        fileName: z.string(),
        chunkIndex: z.number(),
        totalChunks: z.number(),
        data: z.string(), // base64 encoded
      })
    )
    .mutation(async ({ ctx, input }) => {
      // BUG: No chunk ordering guarantee
      // BUG: No validation if all chunks received
      // BUG: Race condition when multiple chunks uploaded simultaneously

      // Simulating chunk storage in database (in reality would be object storage)
      const chunk = await ctx.prisma.$executeRaw`
        INSERT INTO file_chunks (project_id, file_name, chunk_index, data)
        VALUES (${input.projectId}, ${input.fileName}, ${input.chunkIndex}, ${input.data})
        ON CONFLICT (project_id, file_name, chunk_index) DO UPDATE SET data = ${input.data}
      `

      // BUG: Race condition - multiple clients might check this simultaneously
      const uploadedChunks = await ctx.prisma.$queryRaw<any[]>`
        SELECT chunk_index FROM file_chunks
        WHERE project_id = ${input.projectId} AND file_name = ${input.fileName}
      `

      // BUG: No locking mechanism
      if (uploadedChunks.length === input.totalChunks) {
        // BUG: Chunks might not be in order
        // BUG: Missing chunk validation
        const allChunks = await ctx.prisma.$queryRaw<any[]>`
          SELECT data FROM file_chunks
          WHERE project_id = ${input.projectId} AND file_name = ${input.fileName}
          ORDER BY chunk_index
        `

        const completeData = allChunks.map((c) => c.data).join('')

        // BUG: File might be created multiple times by concurrent requests
        const file = await ctx.prisma.file.create({
          data: {
            projectId: input.projectId,
            name: input.fileName,
            path: `/uploads/${input.projectId}/${input.fileName}`,
            size: Buffer.from(completeData, 'base64').length,
            mimeType: 'application/octet-stream',
          },
        })

        // BUG: Cleanup might fail, leaving orphaned chunks
        await ctx.prisma.$executeRaw`
          DELETE FROM file_chunks
          WHERE project_id = ${input.projectId} AND file_name = ${input.fileName}
        `

        return { completed: true, file }
      }

      return { completed: false, chunksReceived: uploadedChunks.length }
    }),

  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      // BUG: No authorization check - can list any project's files
      return ctx.prisma.file.findMany({
        where: { projectId: input.projectId },
      })
    }),
})
