"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Code,
  GitBranch,
  Sparkles,
  Clock,
  Shield,
  Zap,
  Target,
  Rocket,
  Brain,
  Globe,
  Database,
  Bell,
  Calendar,
} from "lucide-react"

const commitTypes = [
  {
    id: "readme",
    icon: FileText,
    title: "README Automation",
    description: "Keep your README files fresh and engaging",
    features: [
      "Dynamic stats and metrics",
      "Automated badge updates",
      "Visitor counters",
      "Recent activity feeds",
      "Project status updates",
      "Contribution guidelines",
    ],
    example: `# My Awesome Project

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=user.repo)
![Last Updated](https://img.shields.io/badge/last%20updated-${new Date().toLocaleDateString()}-brightgreen)

## 📊 Project Stats
- Total commits: 1,247
- Contributors: 15
- Issues resolved: 89
- Last activity: ${new Date().toLocaleDateString()}

## 🚀 Recent Updates
- Added new feature X
- Fixed critical bug Y
- Improved performance by 30%`,
  },
  {
    id: "version",
    icon: Code,
    title: "Version Management",
    description: "Automatic version bumping and changelog generation",
    features: [
      "Semantic versioning",
      "Automatic changelog updates",
      "Package.json version bumps",
      "Git tag creation",
      "Release notes generation",
      "Dependency updates",
    ],
    example: `{
  "name": "my-project",
  "version": "2.1.4",
  "description": "An awesome project",
  "lastUpdated": "${new Date().toISOString()}",
  "buildNumber": 1247,
  "releaseDate": "${new Date().toLocaleDateString()}"
}`,
  },
  {
    id: "code",
    icon: GitBranch,
    title: "Code Evolution",
    description: "Smart code modifications and updates",
    features: [
      "Timestamp updates",
      "Build number increments",
      "Configuration changes",
      "Comment additions",
      "Variable modifications",
      "Metadata updates",
    ],
    example: `// Auto-generated build info
const BUILD_INFO = {
  timestamp: "${new Date().toISOString()}",
  buildNumber: 1247,
  version: "2.1.4",
  environment: "production",
  lastCommit: "${Math.random().toString(36).substring(7)}"
};

// Last updated: ${new Date().toLocaleDateString()}
export default BUILD_INFO;`,
  },
  {
    id: "custom",
    icon: Sparkles,
    title: "Custom Files",
    description: "Create and maintain any type of file",
    features: [
      "Activity logs",
      "Data files",
      "Configuration updates",
      "Documentation",
      "Test files",
      "Asset management",
    ],
    example: `# Daily Activity Log - ${new Date().toLocaleDateString()}

## Automated Tasks Completed
- ✅ Repository backup
- ✅ Dependency scan
- ✅ Performance metrics
- ✅ Security audit
- ✅ Code quality check

## Statistics
- Files processed: 247
- Tests passed: 156/156
- Coverage: 94.2%
- Performance score: A+`,
  },
]

const advancedFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Commits",
    description: "Intelligent commit messages based on code changes",
    color: "text-purple-400",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "Time zone aware scheduling with working hours",
    color: "text-blue-400",
  },
  {
    icon: Globe,
    title: "Multi-Repository",
    description: "Manage multiple repositories from one dashboard",
    color: "text-green-400",
  },
  {
    icon: Database,
    title: "Data Persistence",
    description: "Cloud sync and backup for all your configurations",
    color: "text-yellow-400",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Discord, Slack, and email integration",
    color: "text-red-400",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC2 compliant with advanced encryption",
    color: "text-cyan-400",
  },
]

export default function FeaturesPage() {
  const [selectedType, setSelectedType] = useState("readme")

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="github-button-primary px-4 py-2">
          <Zap className="h-4 w-4 mr-2" />
          Advanced Features
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-white">Powerful Automation Features</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover the comprehensive suite of tools designed to automate your GitHub workflow and boost productivity.
        </p>
      </div>

      {/* Commit Types */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Smart Commit Types</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose from multiple intelligent commit types, each designed for specific automation needs.
          </p>
        </div>

        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
            {commitTypes.map((type) => {
              const Icon = type.icon
              return (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className="flex items-center space-x-2 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{type.title.split(" ")[0]}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {commitTypes.map((type) => {
            const Icon = type.icon
            return (
              <TabsContent key={type.id} value={type.id} className="space-y-6">
                <Card className="github-card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white">{type.title}</CardTitle>
                        <CardDescription className="text-gray-300 text-lg">{type.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Key Features</h4>
                        <ul className="space-y-2">
                          {type.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-gray-300">
                              <Target className="h-4 w-4 text-red-400 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Example Output</h4>
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                            {type.example}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </section>

      {/* Advanced Features */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Advanced Capabilities</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Enterprise-grade features for professional developers and teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="github-card commit-type-card group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-gray-700 transition-colors">
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Performance Stats */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Performance & Reliability</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Built for scale with enterprise-grade performance and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="github-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-red-400 mb-2">99.9%</div>
              <div className="text-white font-semibold">Uptime</div>
              <div className="text-gray-400 text-sm">SLA Guaranteed</div>
            </CardContent>
          </Card>
          <Card className="github-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-white font-semibold">Commits/Day</div>
              <div className="text-gray-400 text-sm">Platform Wide</div>
            </CardContent>
          </Card>
          <Card className="github-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">2.5s</div>
              <div className="text-white font-semibold">Avg Response</div>
              <div className="text-gray-400 text-sm">API Latency</div>
            </CardContent>
          </Card>
          <Card className="github-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">10K+</div>
              <div className="text-white font-semibold">Active Users</div>
              <div className="text-gray-400 text-sm">Worldwide</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Experience the power of advanced GitHub automation with our comprehensive feature set.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="github-button-primary glow-effect">
            <Rocket className="h-5 w-5 mr-2" />
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg" className="github-button-secondary">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Demo
          </Button>
        </div>
      </section>
    </div>
  )
}
