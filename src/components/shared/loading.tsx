export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className || ''}`}>
      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-pulse">
      <div className="h-10 bg-muted rounded-lg w-1/3" />
      <div className="h-6 bg-muted rounded-lg w-2/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-muted rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded-2xl" />
    </div>
  )
}
