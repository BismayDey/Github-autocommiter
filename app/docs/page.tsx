import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Key, GitBranch, Play, AlertTriangle, CheckCircle, ExternalLink, Code, Shield } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Documentation</h1>
        <p className="text-slate-600">Complete guide to using the GitHub Auto-Committer Bot</p>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <CardTitle>Quick Start Guide</CardTitle>
          </div>
          <CardDescription>Get up and running in minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-1">
                1
              </Badge>
              <div>
                <h4 className="font-medium">Create GitHub Token</h4>
                <p className="text-sm text-slate-600">
                  Go to GitHub Settings → Developer settings → Personal access tokens → Generate new token
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Required permissions: <code className="bg-slate-100 px-1 rounded">repo</code>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-1">
                2
              </Badge>
              <div>
                <h4 className="font-medium">Configure Repository</h4>
                <p className="text-sm text-slate-600">
                  Enter your repository URL (e.g., https://github.com/username/repo)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-1">
                3
              </Badge>
              <div>
                <h4 className="font-medium">Set Preferences</h4>
                <p className="text-sm text-slate-600">Choose branch, commit interval, and message template</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-1">
                4
              </Badge>
              <div>
                <h4 className="font-medium">Start Bot</h4>
                <p className="text-sm text-slate-600">Click "Start Bot" and watch automated commits begin</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GitHub Token Setup */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <CardTitle>GitHub Token Setup</CardTitle>
          </div>
          <CardDescription>Detailed instructions for creating your Personal Access Token</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your token is stored locally in your browser and never sent to our servers.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">Step-by-step instructions:</h4>
            <ol className="space-y-2 text-sm text-slate-600">
              <li>
                1. Go to{" "}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub Settings → Personal access tokens
                </a>
              </li>
              <li>2. Click "Generate new token" → "Generate new token (classic)"</li>
              <li>3. Give your token a descriptive name (e.g., "Auto-Committer Bot")</li>
              <li>4. Set expiration (recommended: 90 days or custom)</li>
              <li>
                5. Select the <code className="bg-slate-100 px-1 rounded">repo</code> scope (Full control of private
                repositories)
              </li>
              <li>6. Click "Generate token"</li>
              <li>7. Copy the token immediately (you won't see it again)</li>
            </ol>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Keep your token secure! Don't share it or commit it to repositories.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Configuration Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5" />
            <CardTitle>Configuration Options</CardTitle>
          </div>
          <CardDescription>Understanding all configuration settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Repository URL</h4>
              <p className="text-sm text-slate-600">Full GitHub repository URL. Supports both HTTPS and SSH formats.</p>
              <code className="text-xs bg-slate-100 p-2 rounded block">https://github.com/username/repository</code>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Branch</h4>
              <p className="text-sm text-slate-600">Target branch for commits. Usually "main" or "master".</p>
              <code className="text-xs bg-slate-100 p-2 rounded block">main</code>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Interval</h4>
              <p className="text-sm text-slate-600">Time between commits in seconds. Minimum 60 seconds recommended.</p>
              <code className="text-xs bg-slate-100 p-2 rounded block">300 (5 minutes)</code>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Commit Message</h4>
              <p className="text-sm text-slate-600">
                Template for commit messages. Timestamps are automatically added.
              </p>
              <code className="text-xs bg-slate-100 p-2 rounded block">Auto-commit: Update files</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <CardTitle>Features & Capabilities</CardTitle>
          </div>
          <CardDescription>What the auto-committer can do</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Automated Commits</span>
              </h4>
              <p className="text-sm text-slate-600">Creates real commits with unique files at specified intervals</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Error Recovery</span>
              </h4>
              <p className="text-sm text-slate-600">Continues running even if individual commits fail</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Real-time Monitoring</span>
              </h4>
              <p className="text-sm text-slate-600">Live status updates, countdown timers, and activity logs</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Local Storage</span>
              </h4>
              <p className="text-sm text-slate-600">Settings and logs persist across browser sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <CardTitle>API Reference</CardTitle>
          </div>
          <CardDescription>Technical details about the bot's operation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Commit Structure</h4>
              <p className="text-sm text-slate-600 mb-2">
                Each automated commit creates a unique file in the{" "}
                <code className="bg-slate-100 px-1 rounded">auto-commits/</code> directory:
              </p>
              <pre className="text-xs bg-slate-100 p-3 rounded overflow-x-auto">
                {`auto-commits/commit-1234567890-abc123.txt

Content includes:
- Timestamp
- Commit ID
- Configuration details
- Bot status
- Statistics`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium">GitHub API Usage</h4>
              <p className="text-sm text-slate-600">The bot uses the following GitHub API endpoints:</p>
              <ul className="text-sm text-slate-600 space-y-1 mt-2">
                <li>
                  • <code className="bg-slate-100 px-1 rounded">GET /user</code> - Token validation
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">GET /repos/:owner/:repo/git/refs/heads/:branch</code> -
                  Branch info
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">POST /repos/:owner/:repo/git/blobs</code> - Create file
                  blobs
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">POST /repos/:owner/:repo/git/trees</code> - Create trees
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">POST /repos/:owner/:repo/git/commits</code> - Create
                  commits
                </li>
                <li>
                  • <code className="bg-slate-100 px-1 rounded">PATCH /repos/:owner/:repo/git/refs/heads/:branch</code>{" "}
                  - Update branch
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Troubleshooting</CardTitle>
          </div>
          <CardDescription>Common issues and solutions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-600">Bot stops after 2 commits</h4>
              <p className="text-sm text-slate-600">
                This was a known issue that has been fixed. The bot now uses robust interval management and continues
                running indefinitely.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-red-600">Invalid token error</h4>
              <p className="text-sm text-slate-600">
                Ensure your token has the correct permissions and hasn't expired. Regenerate if necessary.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-red-600">Repository not found</h4>
              <p className="text-sm text-slate-600">
                Check the repository URL format and ensure your token has access to the repository.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-red-600">Branch not found</h4>
              <p className="text-sm text-slate-600">
                Verify the branch name exists in your repository. Common names are "main" or "master".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle>Frequently Asked Questions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Is my GitHub token secure?</h4>
              <p className="text-sm text-slate-600">
                Yes, your token is stored locally in your browser and never sent to our servers. All GitHub API calls
                are made directly from your browser.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Will this affect my contribution graph?</h4>
              <p className="text-sm text-slate-600">
                Yes, automated commits will appear on your GitHub contribution graph, helping maintain activity streaks.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Can I use this with private repositories?</h4>
              <p className="text-sm text-slate-600">
                Yes, as long as your GitHub token has access to the private repository.
              </p>
            </div>

            <div>
              <h4 className="font-medium">What happens if I close my browser?</h4>
              <p className="text-sm text-slate-600">
                The bot will stop running when you close the browser tab. Your settings are saved and will be restored
                when you return.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Can I run multiple bots for different repositories?</h4>
              <p className="text-sm text-slate-600">
                Currently, the bot supports one repository at a time. You can switch between repositories by changing
                the configuration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ExternalLink className="h-5 w-5" />
            <CardTitle>Support & Resources</CardTitle>
          </div>
          <CardDescription>Additional help and resources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">GitHub Documentation</h4>
              <p className="text-sm text-slate-600">
                <a
                  href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Creating Personal Access Tokens
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">GitHub API</h4>
              <p className="text-sm text-slate-600">
                <a
                  href="https://docs.github.com/en/rest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub REST API Documentation
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
