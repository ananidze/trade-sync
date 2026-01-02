import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20">
      <main className="flex flex-col items-center justify-center gap-12 text-center px-8 max-w-4xl">
        <div className="space-y-6">
          <div className="inline-block">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
              TradeSync
            </h1>
          </div>
          <p className="text-2xl text-foreground/80 max-w-3xl leading-relaxed">
            Connect multiple prop firm accounts into a single interface with unified analytics,
            equity tracking, and account oversight.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
            <Link href="/login">
              Login
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="text-lg px-8 py-6 h-auto">
            <Link href="/register">
              Register
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 w-full">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">4+</div>
            <div className="text-muted-foreground">Prop Firms</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">Real-time</div>
            <div className="text-muted-foreground">Analytics</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">Unified</div>
            <div className="text-muted-foreground">Dashboard</div>
          </div>
        </div>
      </main>
    </div>
  );
}
