"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitCommit,
  Play,
  Star,
  Shield,
  Code,
  FileText,
  GitBranch,
  Sparkles,
  Rocket,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Users,
  Calendar,
  TrendingUp,
  Flame,
  Target,
  Brain,
  Bot,
  Zap,
  BarChart3,
  Settings,
  Activity,
  Database,
  Eye,
  Lock,
  Globe,
} from "lucide-react";

const quickAccess = [
  {
    icon: Settings,
    title: "Dashboard",
    description: "Access your automation control center",
    href: "/dashboard",
    color: "bg-red-500",
  },
  {
    icon: Calendar,
    title: "Daily Committer",
    description: "Schedule daily commits for streak maintenance",
    href: "/daily-committer",
    color: "bg-red-500",
  },
  {
    icon: Zap,
    title: "Features",
    description: "Explore all automation capabilities",
    href: "/features",
    color: "bg-red-500",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "View detailed performance insights",
    href: "/analytics",
    color: "bg-red-500",
  },
];

const features = [
  {
    icon: Calendar,
    title: "Daily Commit Automation",
    description:
      "Schedule commits at specific times daily with intelligent timing optimization and streak protection",
  },
  {
    icon: Flame,
    title: "Streak Protection",
    description:
      "Advanced algorithms to maintain and protect your GitHub contribution streaks automatically",
  },
  {
    icon: Brain,
    title: "AI Commit Messages",
    description:
      "Generate intelligent, contextual commit messages using advanced machine learning algorithms",
  },
  {
    icon: Bot,
    title: "Profile Automation",
    description:
      "Automatically update your GitHub profile README with dynamic content and live statistics",
  },
  {
    icon: TrendingUp,
    title: "Contribution Optimizer",
    description:
      "Optimize your contribution graph for maximum visibility and professional impact",
  },
  {
    icon: Shield,
    title: "Repository Guardian",
    description:
      "Monitor and maintain repository health with automated security checks and alerts",
  },
  {
    icon: Database,
    title: "Multi-Repo Management",
    description:
      "Manage unlimited repositories from a single dashboard with batch operations",
  },
  {
    icon: Eye,
    title: "Real-time Monitoring",
    description:
      "Live monitoring of all automation activities with detailed logs and notifications",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Bank-level security with encrypted tokens and SOC2 compliance standards",
  },
  {
    icon: Globe,
    title: "Global Deployment",
    description:
      "Worldwide infrastructure ensuring 99.9% uptime and lightning-fast performance",
  },
  {
    icon: Code,
    title: "Smart Code Generation",
    description:
      "Automatically generate meaningful code changes and documentation updates",
  },
  {
    icon: Activity,
    title: "Performance Analytics",
    description:
      "Deep insights into your automation performance with actionable recommendations",
  },
];

const stats = [
  { label: "Active Users", value: "100,000+", icon: Users },
  { label: "Daily Commits", value: "500K+", icon: GitCommit },
  { label: "Repositories", value: "1M+", icon: GitBranch },
  { label: "Success Rate", value: "99.9%", icon: Target },
];

const commitTypes = [
  {
    icon: Calendar,
    title: "Scheduled Commits",
    description:
      "Automated commits at optimal times for maximum visibility and engagement across all time zones",
  },
  {
    icon: FileText,
    title: "Dynamic Documentation",
    description:
      "Self-updating README files with live stats, achievements, and project status indicators",
  },
  {
    icon: Code,
    title: "Intelligent Code Evolution",
    description:
      "Smart code modifications and version bumps with automated testing and validation",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description:
      "Machine learning generated content, commit messages, and documentation with context awareness",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="section-padding bg-black">
        <div className="container mx-auto container-padding text-center">
          <div className="max-w-6xl mx-auto space-y-12 fade-in">
            <div className="space-y-8">
              <div className="flex justify-center mb-8">
                <img
                  src="/images/devil-logo.png"
                  alt="GitHub Auto Committer"
                  className="w-32 h-32"
                />
              </div>

              <Badge className="bg-red-500 text-white px-8 py-4 text-xl font-black border-2 border-red-500">
                <Rocket className="h-6 w-6 mr-3" />
                WELCOME TO THE DARK SIDE OF GITHUB
              </Badge>

              <h1 className="text-7xl md:text-9xl font-black leading-tight text-white">
                GITHUB
                <span className="text-red-500 block">AUTO COMMITTER</span>
              </h1>

              <p className="text-2xl md:text-3xl text-white max-w-5xl mx-auto leading-relaxed font-bold">
                The most POWERFUL GitHub automation platform with AI-powered
                features, daily commit scheduling, streak protection, and
                intelligent contribution optimization for developers who want to
                DOMINATE.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-red-500 hover:text-red-500 hover:bg-white text-white font-black text-2xl px-12 py-6 rounded-xl"
              >
                <Link href="/dashboard">
                  <Play className="h-8 w-8 mr-4" />
                  START DOMINATING
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-red-500 hover:bg-red-500 hover:text-white font-black text-2xl px-12 py-6 rounded-xl"
              >
                <Link href="/docs">
                  <BookOpen className="h-8 w-8 mr-4" />
                  LEARN THE DARK ARTS
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-red-500">
        <div className="container mx-auto container-padding">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white">
              QUICK ACCESS
            </h2>
            <p className="text-2xl text-white max-w-3xl mx-auto font-bold">
              Jump directly to the tools you need to automate your GitHub
              dominance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickAccess.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={index} href={item.href}>
                  <Card className="bg-white hover:bg-black text-black hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer border-4 border-black">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-2xl flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-black">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg font-bold text-center">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-red-500 rounded-2xl flex items-center justify-center">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-5xl font-black text-black mb-3">
                    {stat.value}
                  </div>
                  <div className="text-xl font-bold text-black">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-black">
        <div className="container mx-auto container-padding">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-6xl md:text-7xl font-black text-white">
              DARK FEATURES
            </h2>
            <p className="text-2xl text-white max-w-4xl mx-auto font-bold">
              Unleash the full power of GitHub automation with features designed
              for total repository domination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="bg-white hover:bg-red-500 text-black hover:text-white transition-all duration-300 transform hover:scale-105 border-4 border-red-500"
                >
                  <CardHeader>
                    <div className="w-16 h-16 mb-6 bg-red-500 rounded-2xl flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-black">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-lg font-bold leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commit Types Section */}
      <section className="section-padding bg-red-500">
        <div className="container mx-auto container-padding">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-6xl md:text-7xl font-black text-white">
              AUTOMATION TYPES
            </h2>
            <p className="text-2xl text-white max-w-4xl mx-auto font-bold">
              Choose your weapon of choice for GitHub automation and repository
              domination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commitTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card
                  key={index}
                  className="bg-white hover:bg-black text-black hover:text-white transition-all duration-300 transform hover:scale-105 border-4 border-black"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center">
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black">
                          {type.title}
                        </CardTitle>
                        <CardDescription className="text-lg font-bold mt-2">
                          {type.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto container-padding">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-6xl md:text-7xl font-black text-black">
              HOW IT WORKS
            </h2>
            <p className="text-2xl text-black max-w-4xl mx-auto font-bold">
              Three simple steps to unleash the dark power of GitHub automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "CONNECT & CONFIGURE",
                description:
                  "Link your GitHub account and set up your automation preferences with military precision",
                icon: GitCommit,
              },
              {
                step: "02",
                title: "AI OPTIMIZATION",
                description:
                  "Our dark AI analyzes your patterns and optimizes everything for maximum impact and efficiency",
                icon: Brain,
              },
              {
                step: "03",
                title: "DOMINATE & SCALE",
                description:
                  "Watch your GitHub profile transform as you dominate the contribution graph across unlimited repositories",
                icon: TrendingUp,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-8 bg-red-500 rounded-full flex items-center justify-center border-4 border-black">
                    <span className="text-white font-black text-3xl">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-black mb-6">
                    {item.title}
                  </h3>
                  <p className="text-xl font-bold text-black leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-black">
        <div className="container mx-auto container-padding text-center">
          <div className="max-w-5xl mx-auto space-y-12">
            <h2 className="text-6xl md:text-7xl font-black text-white">
              READY TO JOIN THE DARK SIDE?
            </h2>
            <p className="text-3xl text-white font-bold">
              Join the elite developers who've embraced the dark power of GitHub
              automation
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-red-500 hover:text-red-500 hover:bg-white text-white font-black text-2xl px-12 py-6 rounded-xl"
              >
                <Link href="/dashboard">
                  <Rocket className="h-8 w-8 mr-4" />
                  START YOUR DARK JOURNEY
                  <ArrowRight className="h-8 w-8 ml-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-red-500 hover:bg-red-500 hover:text-white font-black text-2xl px-12 py-6 rounded-xl"
              >
                <Link href="/docs">
                  <BookOpen className="h-8 w-8 mr-4" />
                  LEARN THE SECRETS
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-16 text-xl text-white">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-red-500" />
                <span className="font-black">FREE TRIAL</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-red-500" />
                <span className="font-black">ENTERPRISE SECURITY</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-8 w-8 text-red-500" />
                <span className="font-black">24/7 SUPPORT</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
