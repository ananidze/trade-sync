import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex flex-col items-center justify-center gap-8 text-center px-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">
            TradeSync
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Connect multiple prop firm accounts into a single interface with unified analytics,
            equity tracking, and account oversight.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
      </main>
    </div>
  );
}
