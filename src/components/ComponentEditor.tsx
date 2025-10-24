'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'

interface ComponentEditorProps {
  projectId: string
  componentId?: string
}

// BUG #8: Infinite Re-render Loop
export function ComponentEditor({ projectId, componentId }: ComponentEditorProps) {
  const [code, setCode] = useState('')
  const [prompt, setPrompt] = useState('')

  const generateComponent = trpc.ai.generateComponent.useMutation()
  const regenerateComponent = trpc.ai.regenerateComponent.useMutation()

  // BUG: This effect causes infinite re-renders
  // ISSUE: Setting state inside useEffect without proper dependencies
  useEffect(() => {
    if (!componentId) {
      // BUG: This triggers re-render, which triggers useEffect again
      setCode('// Start coding...')
    }
  }) // BUG: Missing dependency array!

  // BUG: Another effect that might cause issues
  useEffect(() => {
    if (code.length > 1000) {
      // BUG: State update in render loop
      setCode((prev) => prev.substring(0, 1000))
    }
  }, [code]) // This creates a loop when code is being trimmed

  const handleGenerate = async () => {
    if (!prompt) return

    try {
      const result = await generateComponent.mutateAsync({
        projectId,
        prompt,
        componentName: `Component${Date.now()}`,
      })

      setCode(result.code)
      setPrompt('')
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  const handleRegenerate = async () => {
    if (!componentId || !prompt) return

    try {
      const result = await regenerateComponent.mutateAsync({
        componentId,
        prompt,
      })

      setCode(result.code)
      setPrompt('')
    } catch (error) {
      console.error('Regeneration failed:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the component..."
            className="border px-4 py-2 rounded flex-1"
          />
          <button
            onClick={componentId ? handleRegenerate : handleGenerate}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            disabled={generateComponent.isPending || regenerateComponent.isPending}
          >
            {componentId ? 'Regenerate' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full font-mono text-sm border rounded p-4"
          placeholder="Component code will appear here..."
        />
      </div>
    </div>
  )
}
