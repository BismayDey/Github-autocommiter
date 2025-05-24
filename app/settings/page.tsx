"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Settings, Save, RotateCcw, Download, Upload } from "lucide-react"

interface AppSettings {
  notifications: boolean
  autoSave: boolean
  theme: "light" | "dark" | "system"
  defaultInterval: number
  defaultBranch: string
  defaultCommitMessage: string
  maxLogs: number
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  autoSave: true,
  theme: "system",
  defaultInterval: 300,
  defaultBranch: "main",
  defaultCommitMessage: "Auto-commit: Update files",
  maxLogs: 100,
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [hasChanges, setHasChanges] = useState(false)

  // Load settings on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("github-auto-committer-app-settings")
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    }
  }, [toast])

  // Save settings
  const saveSettings = () => {
    try {
      localStorage.setItem("github-auto-committer-app-settings", JSON.stringify(settings))
      setHasChanges(false)
      toast({
        title: "Settings Saved",
        description: "Your preferences have been saved successfully",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    }
  }

  // Reset to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    setHasChanges(true)
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to defaults",
    })
  }

  // Export settings
  const exportSettings = () => {
    const data = {
      settings,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `auto-committer-settings-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Settings Exported",
      description: "Settings have been downloaded as JSON file",
    })
  }

  // Import settings
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings })
          setHasChanges(true)
          toast({
            title: "Settings Imported",
            description: "Settings have been imported successfully",
          })
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import settings file",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset input
    event.target.value = ""
  }

  // Update setting helper
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Configure your auto-committer preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <CardTitle>General Settings</CardTitle>
          </div>
          <CardDescription>Configure general application preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-slate-500">Show toast notifications for commits and errors</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting("notifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save Settings</Label>
              <p className="text-sm text-slate-500">Automatically save configuration changes</p>
            </div>
            <Switch checked={settings.autoSave} onCheckedChange={(checked) => updateSetting("autoSave", checked)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-logs">Maximum Log Entries</Label>
            <Input
              id="max-logs"
              type="number"
              min="10"
              max="1000"
              value={settings.maxLogs}
              onChange={(e) => updateSetting("maxLogs", Number(e.target.value) || 100)}
            />
            <p className="text-sm text-slate-500">Number of log entries to keep in history</p>
          </div>
        </CardContent>
      </Card>

      {/* Default Values */}
      <Card>
        <CardHeader>
          <CardTitle>Default Values</CardTitle>
          <CardDescription>Set default values for new configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default-interval">Default Interval (seconds)</Label>
              <Input
                id="default-interval"
                type="number"
                min="60"
                value={settings.defaultInterval}
                onChange={(e) => updateSetting("defaultInterval", Number(e.target.value) || 300)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-branch">Default Branch</Label>
              <Input
                id="default-branch"
                value={settings.defaultBranch}
                onChange={(e) => updateSetting("defaultBranch", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-commit-message">Default Commit Message</Label>
            <Textarea
              id="default-commit-message"
              value={settings.defaultCommitMessage}
              onChange={(e) => updateSetting("defaultCommitMessage", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Manage your settings and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={saveSettings} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            <Button onClick={resetSettings} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={exportSettings} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
            <div>
              <input type="file" accept=".json" onChange={importSettings} className="hidden" id="import-settings" />
              <Button asChild variant="outline">
                <label htmlFor="import-settings" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Settings
                </label>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Data Management</h4>
            <p className="text-sm text-slate-500">
              All settings and logs are stored locally in your browser. No data is sent to external servers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
