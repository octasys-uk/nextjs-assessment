'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { ComponentEditor } from '@/components/ComponentEditor'
import { LivePreview } from '@/components/LivePreview'

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string

  // BUG #4: Authorization bypass - can access any project by changing URL
  const { data: project, isLoading } = trpc.project.getById.useQuery({
    id: projectId,
  })

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!project) {
    return <div className="container mx-auto px-4 py-8">Project not found</div>
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b px-4 py-4">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <div className="border rounded">
          <ComponentEditor projectId={projectId} />
        </div>

        <div className="border rounded">
          {/* BUG #1: Memory leak component */}
          <LivePreview projectId={projectId} />
        </div>
      </div>
    </div>
  )
}
