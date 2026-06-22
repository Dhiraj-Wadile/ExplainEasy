import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl font-bold text-primary mb-4">404</div>
      <h1 className="heading-md mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
      >
        Go Home
      </Link>
    </div>
  )
}
