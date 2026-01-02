import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center gap-8 text-center px-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">
            TradeSync
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Connect multiple prop firm accounts into a single interface with unified analytics,
            equity tracking, and account oversight.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-8 py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-lg font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
        >
          Go to Dashboard
        </Link>
      </main>
    </div>
  );
}
