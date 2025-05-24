"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  GitCommit,
  Star,
  Eye,
  Download,
  Filter,
  Zap,
  Target,
  Award,
  Flame,
  Brain,
  Globe,
  Clock,
  Activity,
} from "lucide-react"

interface AnalyticsData {
  commits: {
    total: number
    thisWeek: number
    thisMonth: number
    growth: number
  }
  repositories: {
    total: number
    active: number
    stars: number
    forks: number
  }
  streaks: {
    current: number
    longest: number
    average: number
  }
  performance: {
    successRate: number
    avgCommitTime: number
    uptime: number
  }
  insights: {
    bestTime: string
    mostActiveDay: string
    topRepository: string
    commitPattern: string
  }
}

const mockData: AnalyticsData = {
  commits: {
    total: 2847,
    thisWeek: 47,
    thisMonth: 203,
    growth: 23.5,
  },
  repositories: {
    total: 24,
    active: 18,
    stars: 1247,
    forks: 89,
  },
  streaks: {
    current: 47,
    longest: 89,
    average: 12.3,
  },
  performance: {
    successRate: 98.7,
    avgCommitTime: 2.1,
    uptime: 99.9,
  },
  insights: {
    bestTime: "15:30",
    mostActiveDay: "Tuesday",
    topRepository: "awesome-project",
    commitPattern: "Consistent",
  },
}

const timeRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
]

const chartData = [
  { day: "Mon", commits: 12, success: 11 },
  { day: "Tue", commits: 19, success: 18 },
  { day: "Wed", commits: 15, success: 15 },
  { day: "Thu", commits: 22, success: 21 },
  { day: "Fri", commits: 18, success: 17 },
  { day: "Sat", commits: 8, success: 8 },
  { day: "Sun", commits: 6, success: 6 },
]

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(mockData)
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("commits")

  return (
    <div className="container mx-auto container-padding py-8 space-y-8 uniques-theme">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 text-lg">Comprehensive insights into your GitHub automation performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="uniques-input w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="uniques-button-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="uniques-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commits</p>
                <p className="text-3xl font-bold text-gray-900">{data.commits.total.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />+{data.commits.growth}% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <GitCommit className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="uniques-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Repositories</p>
                <p className="text-3xl font-bold text-gray-900">{data.repositories.active}</p>
                <p className="text-sm text-gray-500 mt-1">of {data.repositories.total} total</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="uniques-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900">{data.streaks.current}</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <Flame className="h-4 w-4 mr-1" />
                  {data.streaks.current} days strong
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="uniques-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">{data.performance.successRate}%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Target className="h-4 w-4 mr-1" />
                  Excellent performance
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Commit Activity Chart */}
        <Card className="uniques-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900">Weekly Activity</CardTitle>
                <CardDescription className="text-gray-600">Commits and success rate by day</CardDescription>
              </div>
              <Badge className="uniques-button-primary">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((day) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(day.commits / 25) * 100}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900 w-8">{day.commits}</div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600">
                    {Math.round((day.success / day.commits) * 100)}% success
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="uniques-card">
          <CardHeader>
            <CardTitle className="text-gray-900">Performance Metrics</CardTitle>
            <CardDescription className="text-gray-600">Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Average Commit Time</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{data.performance.avgCommitTime}s</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">System Uptime</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{data.performance.uptime}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Automation Efficiency</span>
                </div>
                <span className="text-sm font-bold text-gray-900">97.2%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">AI Optimization</span>
                </div>
                <span className="text-sm font-bold text-green-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Insights */}
        <Card className="uniques-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-red-600" />
              <CardTitle className="text-gray-900">AI Insights</CardTitle>
            </div>
            <CardDescription className="text-gray-600">Intelligent recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Optimal Timing</span>
              </div>
              <p className="text-sm text-blue-800">
                Your best commit time is {data.insights.bestTime}. Consider scheduling more commits around this time.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Growth Opportunity</span>
              </div>
              <p className="text-sm text-green-800">
                {data.insights.mostActiveDay} is your most productive day. Leverage this pattern for better results.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Achievement</span>
              </div>
              <p className="text-sm text-purple-800">
                You're maintaining a {data.insights.commitPattern.toLowerCase()} commit pattern. Keep it up!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Repository Stats */}
        <Card className="uniques-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-red-600" />
              <CardTitle className="text-gray-900">Repository Stats</CardTitle>
            </div>
            <CardDescription className="text-gray-600">Your repository performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Total Stars</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{data.repositories.stars.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitCommit className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Total Forks</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{data.repositories.forks}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Top Repository</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{data.insights.topRepository}</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.round((data.repositories.active / data.repositories.total) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Repository Activity Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Analysis */}
        <Card className="uniques-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-red-600" />
              <CardTitle className="text-gray-900">Streak Analysis</CardTitle>
            </div>
            <CardDescription className="text-gray-600">Your commitment consistency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">{data.streaks.current}</div>
              <div className="text-sm text-gray-600 mb-4">Current Streak</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(data.streaks.current / data.streaks.longest) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{data.streaks.longest} (Record)</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Longest Streak</span>
                <span className="text-sm font-bold text-gray-900">{data.streaks.longest} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Streak</span>
                <span className="text-sm font-bold text-gray-900">{data.streaks.average} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Days to Record</span>
                <span className="text-sm font-bold text-red-600">
                  {Math.max(0, data.streaks.longest - data.streaks.current + 1)} days
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="uniques-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Detailed Analytics</CardTitle>
              <CardDescription className="text-gray-600">Comprehensive performance breakdown</CardDescription>
            </div>
            <Button className="uniques-button-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">{data.commits.thisWeek}</div>
              <div className="text-sm text-gray-600">This Week</div>
              <div className="text-xs text-green-600 mt-1">+12% vs last week</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">{data.commits.thisMonth}</div>
              <div className="text-sm text-gray-600">This Month</div>
              <div className="text-xs text-blue-600 mt-1">On track for goal</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">2.3</div>
              <div className="text-sm text-gray-600">Daily Average</div>
              <div className="text-xs text-purple-600 mt-1">Optimal range</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">847</div>
              <div className="text-sm text-gray-600">This Quarter</div>
              <div className="text-xs text-orange-600 mt-1">Record high</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
