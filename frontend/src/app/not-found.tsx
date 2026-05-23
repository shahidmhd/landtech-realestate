import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-ink-900 text-ivory">
        <div className="text-center">
          <p className="font-display text-7xl">404</p>
          <p className="mt-2 text-ivory/60">This address doesn't exist.</p>
          <Link href="/" className="mt-6 inline-block text-gold hover:underline">
            Return home
          </Link>
        </div>
      </body>
    </html>
  );
}
