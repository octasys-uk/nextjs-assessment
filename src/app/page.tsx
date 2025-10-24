import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to AI App Builder</h1>
        <p className="text-lg mb-8">
          Build amazing applications powered by AI. Get started by viewing your
          projects.
        </p>
        <div className="space-x-4">
          <Link
            href="/projects"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            View Projects
          </Link>
          <Link
            href="/login"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  )
}
