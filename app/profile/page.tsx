"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { LoginForm } from "@/components/auth/login-form"
import {
  User,
  Mail,
  Calendar,
  Activity,
  GitCommit,
  CheckCircle,
  AlertCircle,
  Database,
  Clock,
  BarChart3,
  Settings,
  Crown,
  Zap,
  Download,
  Trash2,
  Save,
  ExternalLink,
} from "lucide-react"
import { getUserCommitLogs, clearUserCommitLogs, getUserTemplates, deleteTemplate } from "@/lib/firestore-service"

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile } = useAuth()
  const { toast } = useToast()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [commitLogs, setCommitLogs] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName)
      loadUserData()
    }
  }, [userProfile])

  const loadUserData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [logs, userTemplates] = await Promise.all([getUserCommitLogs(user.uid), getUserTemplates(user.uid)])
      setCommitLogs(logs)
      setTemplates(userTemplates)
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!userProfile) return

    try {
      await updateUserProfile({ displayName })
      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClearLogs = async () => {
    if (!user) return

    try {
      await clearUserCommitLogs(user.uid)
      await updateUserProfile({
        totalCommits: 0,
        successfulCommits: 0,
        failedCommits: 0,
      })
      setCommitLogs([])
      toast({
        title: "Logs Cleared",
        description: "All commit logs have been cleared.",
      })
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId)
      setTemplates(templates.filter((t) => t.id !== templateId))
      toast({
        title: "Template Deleted",
        description: "Template has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportData = () => {
    const data = {
      profile: userProfile,
      commitLogs,
      templates,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `github-autocommitter-profile-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Data Exported",
      description: "Your profile data has been exported successfully.",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto container-padding py-12">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <img src="/images/devil-logo.png" alt="GitHub Auto Committer" className="w-20 h-20" />
            </div>
            <h1 className="text-5xl font-black text-white">PROFILE ACCESS</h1>
            <p className="text-white text-xl max-w-2xl mx-auto font-bold">
              Sign in to access your profile, analytics, and saved configurations
            </p>
            <Button
              onClick={() => setShowLoginForm(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-black text-xl px-8 py-4"
            >
              <User className="h-6 w-6 mr-3" />
              SIGN IN TO ACCESS PROFILE
            </Button>
          </div>
        </div>
        {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
      </div>
    )
  }

  const successRate = userProfile?.totalCommits
    ? Math.round((userProfile.successfulCommits / userProfile.totalCommits) * 100)
    : 0

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto container-padding py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <img src="/images/devil-logo.png" alt="GitHub Auto Committer" className="w-20 h-20" />
          </div>
          <Badge className="bg-red-500 text-white px-8 py-3 text-xl font-black">
            <User className="h-6 w-6 mr-3" />
            USER PROFILE
          </Badge>
          <h1 className="text-5xl font-black text-white">DARK PROFILE DASHBOARD</h1>
          <p className="text-white text-xl max-w-4xl mx-auto font-bold">
            Manage your account, view analytics, and track your GitHub automation empire
          </p>
        </div>

        {/* Profile Overview */}
        <Card className="bg-white text-black border-2 border-red-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-black text-2xl font-black">{userProfile?.displayName}</CardTitle>
                  <CardDescription className="text-black text-lg font-bold flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {userProfile?.email}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-red-500 text-white font-black text-lg px-4 py-2">
                  <Crown className="h-4 w-4 mr-2" />
                  {userProfile?.subscription.toUpperCase()}
                </Badge>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-black text-lg font-black">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleSaveProfile} className="bg-red-500 hover:bg-red-600 text-white font-black">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="text-black font-bold">Member Since</p>
                    <p className="text-black font-black">
                      {new Date(userProfile?.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="text-black font-bold">Last Login</p>
                    <p className="text-black font-black">
                      {new Date(userProfile?.lastLogin || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Database className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="text-black font-bold">Repositories</p>
                    <p className="text-black font-black">{userProfile?.repositoriesManaged || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-white text-black border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Activity className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-lg font-black text-black">Total Commits</p>
                  <p className="text-3xl font-black text-red-500">{userProfile?.totalCommits || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white text-black border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-lg font-black text-black">Success Rate</p>
                  <p className="text-3xl font-black text-red-500">{successRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white text-black border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-lg font-black text-black">Failed Commits</p>
                  <p className="text-3xl font-black text-red-500">{userProfile?.failedCommits || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white text-black border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-lg font-black text-black">Avg Time</p>
                  <p className="text-3xl font-black text-red-500">{userProfile?.averageCommitTime || 0}s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-red-500">
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-black font-black text-lg"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-black font-black text-lg"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-black font-black text-lg"
            >
              Templates
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-black font-black text-lg"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-8">
            <Card className="bg-white text-black border-2 border-red-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-red-500" />
                  <CardTitle className="text-black text-2xl font-black">DETAILED ANALYTICS</CardTitle>
                </div>
                <CardDescription className="text-black text-lg font-bold">
                  Comprehensive insights into your GitHub automation performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-black p-6 rounded-xl border-2 border-red-500">
                    <h4 className="font-black text-white mb-4 text-lg">Performance Metrics</h4>
                    <div className="space-y-3 text-lg">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Success Rate:</span>
                        <span className="text-red-500 font-black">{successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Total Commits:</span>
                        <span className="text-white font-black">{userProfile?.totalCommits || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Failed Commits:</span>
                        <span className="text-red-500 font-black">{userProfile?.failedCommits || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Avg Time:</span>
                        <span className="text-red-500 font-black">{userProfile?.averageCommitTime || 0}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black p-6 rounded-xl border-2 border-red-500">
                    <h4 className="font-black text-white mb-4 text-lg">Repository Stats</h4>
                    <div className="space-y-3 text-lg">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Managed Repos:</span>
                        <span className="text-white font-black">{userProfile?.repositoriesManaged || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Templates:</span>
                        <span className="text-red-500 font-black">{templates.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Activity Logs:</span>
                        <span className="text-red-500 font-black">{commitLogs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Subscription:</span>
                        <span className="text-red-500 font-black">{userProfile?.subscription.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black p-6 rounded-xl border-2 border-red-500">
                    <h4 className="font-black text-white mb-4 text-lg">Account Info</h4>
                    <div className="space-y-3 text-lg">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Member Since:</span>
                        <span className="text-white font-black">
                          {new Date(userProfile?.createdAt || "").toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Last Login:</span>
                        <span className="text-red-500 font-black">
                          {new Date(userProfile?.lastLogin || "").toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Status:</span>
                        <span className="text-red-500 font-black">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-8">
            <Card className="bg-white text-black border-2 border-red-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-black text-2xl font-black">RECENT ACTIVITY</CardTitle>
                    <CardDescription className="text-black text-lg font-bold">
                      Your latest commit logs and automation activity
                    </CardDescription>
                  </div>
                  <Badge className="bg-red-500 text-white font-black text-lg px-4 py-2">{commitLogs.length} logs</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {commitLogs.length > 0 ? (
                    commitLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`flex items-start space-x-4 p-4 rounded-xl border-2 ${
                          log.status === "success"
                            ? "bg-black text-white border-red-500"
                            : "bg-red-500 text-white border-red-500"
                        }`}
                      >
                        {log.status === "success" ? (
                          <CheckCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-white mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <GitCommit className="h-5 w-5 text-red-500" />
                            <p className="font-black text-lg break-words">{log.message}</p>
                            {log.repository && (
                              <Badge className="bg-white text-black font-bold">{log.repository}</Badge>
                            )}
                          </div>
                          <p className="text-sm font-bold">{log.timestamp}</p>
                          {log.sha && (
                            <div className="flex items-center space-x-3 mt-2">
                              <p className="text-sm font-mono font-bold">SHA: {log.sha.substring(0, 7)}</p>
                              {log.url && (
                                <a
                                  href={log.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-red-500 hover:text-red-300 flex items-center font-bold"
                                >
                                  View on GitHub
                                  <ExternalLink className="h-4 w-4 ml-1" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center space-x-4 p-8 bg-black rounded-xl border-2 border-red-500">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="text-white font-black text-lg">No activity yet</p>
                        <p className="text-white font-bold">Start using the automation to see your activity here</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-8">
            <Card className="bg-white text-black border-2 border-red-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-black text-2xl font-black">YOUR TEMPLATES</CardTitle>
                    <CardDescription className="text-black text-lg font-bold">
                      Manage your custom commit templates
                    </CardDescription>
                  </div>
                  <Badge className="bg-red-500 text-white font-black text-lg px-4 py-2">
                    {templates.length} templates
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.length > 0 ? (
                    templates.map((template) => (
                      <div key={template.id} className="p-6 rounded-xl border-2 border-red-500 bg-black text-white">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-black text-lg text-white">{template.name}</h5>
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-white text-black font-bold">{template.type}</Badge>
                            <Button
                              onClick={() => handleDeleteTemplate(template.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-bold mb-3 text-white">{template.message}</p>
                        <p className="text-sm font-bold text-gray-300">{template.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-black">
                      <Settings className="h-16 w-16 mx-auto mb-6 text-red-500" />
                      <p className="text-xl font-black">No templates created yet</p>
                      <p className="text-lg font-bold">Create templates in the dashboard to see them here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <Card className="bg-white text-black border-2 border-red-500">
              <CardHeader>
                <CardTitle className="text-black text-2xl font-black">ACCOUNT SETTINGS</CardTitle>
                <CardDescription className="text-black text-lg font-bold">
                  Manage your account data and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    onClick={exportData}
                    className="bg-red-500 hover:bg-red-600 text-white font-black text-lg py-4"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Export All Data
                  </Button>
                  <Button
                    onClick={handleClearLogs}
                    variant="outline"
                    className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black text-lg py-4"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Clear Activity Logs
                  </Button>
                </div>

                <Separator className="bg-red-500 h-1" />

                <Alert className="bg-black text-white border-2 border-red-500">
                  <AlertDescription className="text-white text-lg font-bold">
                    <strong className="text-red-500">Data Privacy:</strong> Your data is securely stored and encrypted.
                    You can export or delete your data at any time. We never share your personal information or GitHub
                    tokens.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
