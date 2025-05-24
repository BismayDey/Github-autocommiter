import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommit, Clock, Shield, BarChart3, Settings, Zap, CheckCircle, Activity } from "lucide-react"

const features = [
  {
    icon: GitCommit,
    title: "Automated Commits",
    description: "Automatically create commits at specified intervals to keep your repositories active.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Set custom intervals from minutes to hours. Perfect for maintaining contribution streaks.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your GitHub token is stored locally and never sent to our servers. Complete privacy guaranteed.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Monitor commit success rates, uptime, and detailed activity logs in real-time.",
  },
  {
    icon: Settings,
    title: "Customizable Messages",
    description: "Create custom commit messages with timestamps and variables for meaningful commits.",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Get started in minutes. Just add your GitHub token and repository URL.",
  },
  {
    icon: CheckCircle,
    title: "Error Recovery",
    description: "Robust error handling ensures the bot continues running even if individual commits fail.",
  },
  {
    icon: Activity,
    title: "Live Monitoring",
    description: "Watch your bot in action with live status updates and countdown timers.",
  },
]

export function Features() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Powerful Features</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Everything you need to automate your GitHub commits and maintain active repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
