"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  Clock,
  Flame,
  Target,
  Settings,
  Play,
  Square,
  Info,
  Zap,
  BarChart3,
  GitCommit,
  Trophy,
  Plus,
  Trash2,
} from "lucide-react"

interface DailyCommitConfig {
  enabled: boolean
  times: string[]
  timezone: string
  weekends: boolean
  holidays: boolean
  streakMode: boolean
  intelligentTiming: boolean
  commitTypes: string[]
  repositories: string[]
}

interface StreakData {
  current: number
  longest: number
  total: number
  lastCommit: string
  nextTarget: number
}

interface CommitSchedule {
  id: string
  time: string
  repository: string
  type: string
  status: "pending" | "completed" | "failed"
  nextRun: string
}

const DEFAULT_CONFIG: DailyCommitConfig = {
  enabled: false,
  times: ["09:00", "15:00", "21:00"],
  timezone: "UTC",
  weekends: true,
  holidays: false,
  streakMode: true,
  intelligentTiming: true,
  commitTypes: ["readme", "version", "code"],
  repositories: [],
}

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
]

const commitTypes = [
  { id: "readme", name: "README Updates", icon: "📝" },
  { id: "version", name: "Version Bumps", icon: "🔢" },
  { id: "code", name: "Code Changes", icon: "💻" },
  { id: "docs", name: "Documentation", icon: "📚" },
  { id: "tests", name: "Test Updates", icon: "🧪" },
  { id: "config", name: "Configuration", icon: "⚙️" },
]

export default function DailyCommitterPage() {
  const { toast } = useToast()
  const [config, setConfig] = useState<DailyCommitConfig>(DEFAULT_CONFIG)
  const [streakData, setStreakData] = useState<StreakData>({
    current: 47,
    longest: 89,
    total: 342,
    lastCommit: "2024-01-15T14:30:00Z",
    nextTarget: 50,
  })
  const [schedules, setSchedules] = useState<CommitSchedule[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [newTime, setNewTime] = useState("")

  // Load configuration
  useEffect(() => {
    try {
      const saved = localStorage.getItem("daily-committer-config")
      if (saved) {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(saved) })
      }

      const savedStreak = localStorage.getItem("daily-committer-streak")
      if (savedStreak) {
        setStreakData(JSON.parse(savedStreak))
      }

      const savedSchedules = localStorage.getItem("daily-committer-schedules")
      if (savedSchedules) {
        setSchedules(JSON.parse(savedSchedules))
      }
    } catch (error) {
      console.error("Failed to load configuration:", error)
    }
  }, [])

  // Save configuration
  const saveConfig = useCallback(() => {
    try {
      localStorage.setItem("daily-committer-config", JSON.stringify(config))
      localStorage.setItem("daily-committer-streak", JSON.stringify(streakData))
      localStorage.setItem("daily-committer-schedules", JSON.stringify(schedules))
    } catch (error) {
      console.error("Failed to save configuration:", error)
    }
  }, [config, streakData, schedules])

  // Update configuration
  const updateConfig = (updates: Partial<DailyCommitConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  // Add commit time
  const addCommitTime = () => {
    if (!newTime) {
      toast({
        title: "Time Required",
        description: "Please select a time for the daily commit",
        variant: "destructive",
      })
      return
    }

    if (config.times.includes(newTime)) {
      toast({
        title: "Time Already Added",
        description: "This time is already in your schedule",
        variant: "destructive",
      })
      return
    }

    updateConfig({ times: [...config.times, newTime].sort() })
    setNewTime("")
    toast({
      title: "Time Added",
      description: `Daily commit scheduled for ${newTime}`,
    })
  }

  // Remove commit time
  const removeCommitTime = (time: string) => {
    updateConfig({ times: config.times.filter((t) => t !== time) })
    toast({
      title: "Time Removed",
      description: `Removed ${time} from daily schedule`,
    })
  }

  // Start daily committer
  const startDailyCommitter = () => {
    if (config.times.length === 0) {
      toast({
        title: "No Schedule Set",
        description: "Please add at least one commit time",
        variant: "destructive",
      })
      return
    }

    setIsRunning(true)
    updateConfig({ enabled: true })

    // Generate sample schedules
    const newSchedules: CommitSchedule[] = config.times.map((time, index) => ({
      id: `schedule-${index}`,
      time,
      repository: "main-repo",
      type: config.commitTypes[index % config.commitTypes.length],
      status: "pending",
      nextRun: new Date().toISOString(),
    }))

    setSchedules(newSchedules)

    toast({
      title: "Daily Committer Started",
      description: `Scheduled ${config.times.length} daily commits`,
    })
  }

  // Stop daily committer
  const stopDailyCommitter = () => {
    setIsRunning(false)
    updateConfig({ enabled: false })
    toast({
      title: "Daily Committer Stopped",
      description: "All scheduled commits have been paused",
    })
  }

  // Calculate streak status
  const getStreakStatus = () => {
    const daysSinceLastCommit = Math.floor(
      (Date.now() - new Date(streakData.lastCommit).getTime()) / (1000 * 60 * 60 * 24),
    )

    if (daysSinceLastCommit === 0) return { status: "active", message: "Streak active today!" }
    if (daysSinceLastCommit === 1) return { status: "warning", message: "Commit today to maintain streak" }
    return { status: "danger", message: "Streak broken - start a new one!" }
  }

  const streakStatus = getStreakStatus()

  // Save on config change
  useEffect(() => {
    saveConfig()
  }, [saveConfig])

  return (
    <div className="container mx-auto container-padding py-12 space-y-12 crimson-theme">
      {/* Header */}
      <div className="text-center space-y-6">
        <Badge className="crimson-button-primary px-8 py-3 text-lg font-bold">
          <Calendar className="h-5 w-5 mr-3" />
          Daily Committer
        </Badge>
        <h1 className="text-5xl heading-primary">Daily Commit Automation</h1>
        <p className="text-body text-xl max-w-3xl mx-auto">
          Maintain perfect GitHub streaks with intelligent daily commit scheduling and advanced automation features
        </p>
      </div>

      {/* Streak Overview */}
      <div className="clean-grid grid-cols-1 md:grid-cols-4">
        <Card className="crimson-card card-shadow">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Flame className="h-12 w-12 streak-fire" />
            </div>
            <div className="text-4xl heading-secondary mb-2">{streakData.current}</div>
            <div className="text-body text-lg">Current Streak</div>
            <div
              className={`text-sm mt-4 px-4 py-2 rounded-full font-semibold ${
                streakStatus.status === "active"
                  ? "bg-white text-crimson-bold crimson-border"
                  : streakStatus.status === "warning"
                    ? "bg-white black-text black-border"
                    : "status-error"
              }`}
            >
              {streakStatus.message}
            </div>
          </CardContent>
        </Card>

        <Card className="crimson-card card-shadow">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-crimson-bold" />
            </div>
            <div className="text-4xl heading-secondary mb-2">{streakData.longest}</div>
            <div className="text-body text-lg">Longest Streak</div>
            <div className="text-sm black-text mt-4 font-semibold">Personal Record</div>
          </CardContent>
        </Card>

        <Card className="crimson-card card-shadow">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <GitCommit className="h-12 w-12 text-crimson-bold" />
            </div>
            <div className="text-4xl heading-secondary mb-2">{streakData.total}</div>
            <div className="text-body text-lg">Total Commits</div>
            <div className="text-sm black-text mt-4 font-semibold">All Time</div>
          </CardContent>
        </Card>

        <Card className="crimson-card card-shadow">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Target className="h-12 w-12 text-crimson-bold" />
            </div>
            <div className="text-4xl heading-secondary mb-2">{streakData.nextTarget}</div>
            <div className="text-body text-lg">Next Target</div>
            <div className="text-sm black-text mt-4 font-semibold">
              {streakData.nextTarget - streakData.current} days to go
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <div className="clean-grid grid-cols-1 lg:grid-cols-2">
        {/* Schedule Configuration */}
        <Card className="crimson-card card-shadow">
          <CardHeader>
            <div className="clean-flex">
              <Clock className="h-6 w-6 text-crimson-bold" />
              <CardTitle className="heading-secondary text-2xl">Daily Schedule</CardTitle>
            </div>
            <CardDescription className="text-body text-lg">
              Configure when your daily commits should be made for optimal impact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Add New Time */}
            <div className="space-y-4">
              <Label className="black-text text-lg font-semibold">Add Commit Time</Label>
              <div className="clean-flex">
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="crimson-input flex-1"
                />
                <Button onClick={addCommitTime} className="crimson-button-primary">
                  <Plus className="h-5 w-5 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Current Times */}
            <div className="space-y-4">
              <Label className="black-text text-lg font-semibold">Scheduled Times</Label>
              {config.times.length > 0 ? (
                <div className="space-y-3">
                  {config.times.map((time) => (
                    <div key={time} className="clean-flex justify-between p-4 bg-white rounded-xl">
                      <div className="clean-flex">
                        <Clock className="h-5 w-5 text-crimson-bold" />
                        <span className="heading-secondary text-lg">{time}</span>
                        <Badge className="status-active text-sm">{config.timezone}</Badge>
                      </div>
                      <Button
                        onClick={() => removeCommitTime(time)}
                        variant="ghost"
                        size="sm"
                        className="text-crimson-bold hover:bg-white"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-body">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-crimson-bold" />
                  <p className="text-xl font-semibold">No commit times scheduled</p>
                  <p className="text-lg">Add your first commit time above</p>
                </div>
              )}
            </div>

            {/* Timezone */}
            <div className="space-y-4">
              <Label className="black-text text-lg font-semibold">Timezone</Label>
              <Select value={config.timezone} onValueChange={(value) => updateConfig({ timezone: value })}>
                <SelectTrigger className="crimson-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card className="crimson-card card-shadow">
          <CardHeader>
            <div className="clean-flex">
              <Settings className="h-6 w-6 text-crimson-bold" />
              <CardTitle className="heading-secondary text-2xl">Advanced Settings</CardTitle>
            </div>
            <CardDescription className="text-body text-lg">
              Fine-tune your daily commit behavior and automation preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Options */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="black-text text-lg font-semibold">Weekend Commits</Label>
                  <p className="text-body">Continue commits on weekends for consistency</p>
                </div>
                <Switch checked={config.weekends} onCheckedChange={(checked) => updateConfig({ weekends: checked })} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="black-text text-lg font-semibold">Holiday Commits</Label>
                  <p className="text-body">Maintain commits on public holidays</p>
                </div>
                <Switch checked={config.holidays} onCheckedChange={(checked) => updateConfig({ holidays: checked })} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="black-text text-lg font-semibold">Streak Mode</Label>
                  <p className="text-body">Prioritize maintaining contribution streaks</p>
                </div>
                <Switch
                  checked={config.streakMode}
                  onCheckedChange={(checked) => updateConfig({ streakMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="black-text text-lg font-semibold">Intelligent Timing</Label>
                  <p className="text-body">AI-optimized commit timing for maximum impact</p>
                </div>
                <Switch
                  checked={config.intelligentTiming}
                  onCheckedChange={(checked) => updateConfig({ intelligentTiming: checked })}
                />
              </div>
            </div>

            {/* Commit Types */}
            <div className="space-y-4">
              <Label className="black-text text-lg font-semibold">Commit Types</Label>
              <div className="clean-grid grid-cols-2">
                {commitTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`commit-type-card text-center ${config.commitTypes.includes(type.id) ? "selected" : ""}`}
                    onClick={() => {
                      const types = config.commitTypes.includes(type.id)
                        ? config.commitTypes.filter((t) => t !== type.id)
                        : [...config.commitTypes, type.id]
                      updateConfig({ commitTypes: types })
                    }}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm heading-secondary">{type.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card className="crimson-card card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="clean-flex">
              <Zap className="h-6 w-6 text-crimson-bold" />
              <CardTitle className="heading-secondary text-2xl">Control Panel</CardTitle>
            </div>
            <Badge className={isRunning ? "status-active" : "status-inactive"}>
              {isRunning ? "Active" : "Inactive"}
            </Badge>
          </div>
          <CardDescription className="text-body text-lg">
            Start or stop your daily commit automation with advanced controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Status */}
          <Alert className={`${isRunning ? "notification-success" : "notification-warning"} p-6`}>
            <Info className="h-6 w-6" />
            <AlertDescription className="text-lg font-semibold">
              {isRunning
                ? `Daily committer is active with ${config.times.length} scheduled times`
                : "Daily committer is currently inactive"}
            </AlertDescription>
          </Alert>

          {/* Controls */}
          <div className="clean-grid grid-cols-2">
            <Button
              onClick={startDailyCommitter}
              disabled={isRunning || config.times.length === 0}
              className="crimson-button-primary btn-large"
            >
              <Play className="h-5 w-5 mr-3" />
              Start Daily Committer
            </Button>
            <Button
              onClick={stopDailyCommitter}
              disabled={!isRunning}
              variant="outline"
              className="crimson-button-secondary btn-large"
            >
              <Square className="h-5 w-5 mr-3" />
              Stop Daily Committer
            </Button>
          </div>

          {/* Next Commits */}
          {schedules.length > 0 && (
            <div className="space-y-6">
              <h4 className="heading-secondary text-xl">Upcoming Commits</h4>
              <div className="space-y-4">
                {schedules.slice(0, 3).map((schedule) => (
                  <div key={schedule.id} className="clean-flex justify-between p-4 bg-white rounded-xl">
                    <div className="clean-flex">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          schedule.status === "completed"
                            ? "bg-crimson-bold"
                            : schedule.status === "failed"
                              ? "bg-black"
                              : "bg-crimson-bold"
                        }`}
                      />
                      <div>
                        <p className="heading-secondary text-lg">{schedule.time}</p>
                        <p className="text-body">{schedule.type} commit</p>
                      </div>
                    </div>
                    <Badge className="status-active text-sm">{schedule.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Preview */}
      <Card className="crimson-card card-shadow">
        <CardHeader>
          <div className="clean-flex">
            <BarChart3 className="h-6 w-6 text-crimson-bold" />
            <CardTitle className="heading-secondary text-2xl">Streak Analytics</CardTitle>
          </div>
          <CardDescription className="text-body text-lg">
            Track your progress and optimize your commit strategy with advanced insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="clean-grid grid-cols-1 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl heading-secondary mb-2">94%</div>
              <div className="text-body text-lg">Success Rate</div>
              <div className="text-crimson-bold text-sm mt-2 font-semibold">↑ 12% this month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl heading-secondary mb-2">2.3</div>
              <div className="text-body text-lg">Avg Daily Commits</div>
              <div className="text-crimson-bold text-sm mt-2 font-semibold">Optimal range</div>
            </div>
            <div className="text-center">
              <div className="text-3xl heading-secondary mb-2">15:30</div>
              <div className="text-body text-lg">Best Time</div>
              <div className="text-crimson-bold text-sm mt-2 font-semibold">AI recommended</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
