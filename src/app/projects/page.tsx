'use client'

import { trpc } from '@/lib/trpc'
import Link from 'next/link'
import { useState } from 'react'

export default function ProjectsPage() {
  const [newProjectName, setNewProjectName] = useState('')

  // BUG #5: N+1 queries triggered here
  const { data: projects, isLoading } = trpc.project.list.useQuery()

  // BUG #10: Missing cache invalidation after mutation
  const createProject = trpc.project.create.useMutation({
    // BUG: onSuccess missing - no refetch or invalidation
  })

  const handleCreate = async () => {
    if (!newProjectName) return

    await createProject.mutateAsync({
      name: newProjectName,
      description: 'A new AI-generated project',
    })

    setNewProjectName('')
    // BUG: UI won't update - need to manually refresh page
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>

      <div className="mb-8 flex gap-4">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name"
          className="border px-4 py-2 rounded flex-1"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project: any) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="text-sm text-gray-500">
              <div>Components: {project.componentCount}</div>
              <div>Files: {project.fileCount}</div>
              {project.lastDeployment && (
                <div>Status: {project.lastDeployment.status}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
