import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, GitBranch, Play, Activity } from "lucide-react"

const steps = [
  {
    icon: Key,
    title: "1. Add GitHub Token",
    description: "Create a Personal Access Token with repository permissions and add it to the dashboard.",
  },
  {
    icon: GitBranch,
    title: "2. Configure Repository",
    description: "Enter your repository URL, target branch, and customize your commit message template.",
  },
  {
    icon: Play,
    title: "3. Start the Bot",
    description: "Set your desired interval and start the auto-committer. It will begin creating commits immediately.",
  },
  {
    icon: Activity,
    title: "4. Monitor Activity",
    description: "Watch real-time logs, statistics, and countdown timers as your bot maintains repository activity.",
  },
]

export function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-20 bg-slate-50">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How It Works</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Get your GitHub auto-committer running in just four simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <Card key={index} className="text-center relative">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{step.description}</CardDescription>
              </CardContent>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-slate-300 transform -translate-y-1/2" />
              )}
            </Card>
          )
        })}
      </div>
    </section>
  )
}
