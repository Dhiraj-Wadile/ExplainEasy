'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <span className="text-red-500 text-2xl font-bold">!</span>
      </div>
      <h1 className="heading-md mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
      >
        Try Again
      </button>
    </div>
  )
}
