'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface LivePreviewProps {
  projectId: string
}

// BUG #1: Memory Leak in Real-time Preview
export function LivePreview({ projectId }: LivePreviewProps) {
  const [previewHtml, setPreviewHtml] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const subscriptionsRef = useRef<any[]>([])

  useEffect(() => {
    // BUG: Multiple subscriptions created without cleanup
    const subscription1 = supabase
      .channel(`project-${projectId}-components`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Component',
          filter: `projectId=eq.${projectId}`,
        },
        (payload) => {
          console.log('Component changed:', payload)
          updatePreview()
        }
      )
      .subscribe()

    const subscription2 = supabase
      .channel(`project-${projectId}-files`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'File',
          filter: `projectId=eq.${projectId}`,
        },
        (payload) => {
          console.log('File changed:', payload)
          updatePreview()
        }
      )
      .subscribe()

    // BUG: Subscriptions added to ref but never cleaned up
    subscriptionsRef.current.push(subscription1, subscription2)

    // Initial preview load
    updatePreview()

    // BUG: Missing cleanup function!
    // Subscriptions are never unsubscribed
    // EventListeners accumulate on every render
  }, [projectId]) // BUG: updatePreview dependency missing

  // BUG: Function recreated on every render
  const updatePreview = async () => {
    // Simulate fetching and building preview
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        </head>
        <body>
          <div id="root">Preview for project ${projectId}</div>
          <script>
            // BUG: Event listeners added but never removed
            window.addEventListener('message', function(e) {
              console.log('Message received:', e.data)
            })

            // BUG: Interval never cleared
            setInterval(() => {
              console.log('Preview running...')
            }, 1000)
          </script>
        </body>
      </html>
    `

    setPreviewHtml(html)
  }

  // BUG: Additional useEffect that adds more memory leaks
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    // BUG: Event listener added on every render
    const handleLoad = () => {
      console.log('Iframe loaded')
      // BUG: Creating objects that reference the iframe
      const observers = []
      const observer = new MutationObserver(() => {
        console.log('DOM changed')
      })

      if (iframe.contentDocument) {
        observer.observe(iframe.contentDocument.body, {
          childList: true,
          subtree: true,
        })
      }

      // BUG: Observer never disconnected
      observers.push(observer)
    }

    iframe.addEventListener('load', handleLoad)

    // BUG: Event listener never removed
  }, [previewHtml])

  return (
    <div className="h-full border rounded">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h3 className="font-semibold">Live Preview</h3>
      </div>
      <iframe
        ref={iframeRef}
        srcDoc={previewHtml}
        className="w-full h-full"
        sandbox="allow-scripts"
        title="Preview"
      />
    </div>
  )
}
