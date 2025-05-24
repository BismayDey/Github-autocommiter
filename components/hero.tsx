import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GitCommit, Play, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900">Automate Your GitHub Commits</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Keep your repositories active with automated commits. Perfect for maintaining contribution streaks and
            project activity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/dashboard">
              <Play className="h-5 w-5 mr-2" />
              Get Started
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <Link href="/docs">
              <GitCommit className="h-5 w-5 mr-2" />
              Learn More
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>Free to use</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitCommit className="h-4 w-4" />
            <span>GitHub API</span>
          </div>
          <div className="flex items-center space-x-1">
            <Play className="h-4 w-4" />
            <span>Real-time monitoring</span>
          </div>
        </div>
      </div>
    </section>
  )
}
