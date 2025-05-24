"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Key, ExternalLink } from "lucide-react"

interface GitHubTokenSetupProps {
  onTokenSave: (token: string) => void
}

export function GitHubTokenSetup({ onTokenSave }: GitHubTokenSetupProps) {
  const [token, setToken] = useState("")
  const [showToken, setShowToken] = useState(false)

  const handleSave = () => {
    if (token.trim()) {
      onTokenSave(token.trim())
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <CardTitle>GitHub Token Setup</CardTitle>
        </div>
        <CardDescription>Enter your GitHub Personal Access Token to enable auto-committing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            You need a GitHub Personal Access Token with repository access.{" "}
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Create one here
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="github-token">GitHub Personal Access Token</Label>
          <div className="relative">
            <Input
              id="github-token"
              type={showToken ? "text" : "password"}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Required permissions:</p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• repo (Full control of private repositories)</li>
            <li>• workflow (Update GitHub Action workflows)</li>
          </ul>
        </div>

        <Button onClick={handleSave} disabled={!token.trim()} className="w-full">
          Save Token
        </Button>
      </CardContent>
    </Card>
  )
}
