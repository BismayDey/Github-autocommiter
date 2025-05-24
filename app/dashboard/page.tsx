"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  GitBranch,
  GitCommit,
  Play,
  Square,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  ExternalLink,
  Trash2,
  Download,
  Activity,
  FileText,
  Code,
  Sparkles,
  Zap,
  Brain,
  Info,
  Database,
  Cpu,
  BarChart3,
  Plus,
  Save,
} from "lucide-react";

interface CommitLog {
  id: string;
  message: string;
  timestamp: string;
  sha: string;
  status: "success" | "error";
  url?: string;
  type: string;
  repository?: string;
}

interface BotStats {
  totalCommits: number;
  successfulCommits: number;
  failedCommits: number;
  uptime: number;
  nextCommitIn: number;
  repositoriesManaged: number;
  averageCommitTime: number;
}

interface Repository {
  id: string;
  url: string;
  name: string;
  branch: string;
  isActive: boolean;
  lastCommit?: string;
  commitCount: number;
}

interface BotConfig {
  repoUrl: string;
  branch: string;
  commitMessage: string;
  interval: number;
  githubToken: string;
  commitType: "simple" | "readme" | "version" | "code" | "custom";
  customFilePath: string;
  customFileContent: string;
  scheduleType: "interval" | "cron" | "smart";
  cronExpression: string;
  smartScheduling: boolean;
  batchSize: number;
  repositories: Repository[];
}

interface CommitTemplate {
  id: string;
  name: string;
  message: string;
  type: string;
  content: string;
}

const DEFAULT_CONFIG: BotConfig = {
  repoUrl: "",
  branch: "main",
  commitMessage: "Auto-commit: Update files",
  interval: 300,
  githubToken: "",
  commitType: "simple",
  customFilePath: "auto-commits/activity.md",
  customFileContent: "",
  scheduleType: "interval",
  cronExpression: "0 */6 * * *",
  smartScheduling: false,
  batchSize: 1,
  repositories: [],
};

const commitTypes = [
  {
    id: "simple",
    icon: GitCommit,
    title: "Simple Commits",
    description: "Basic file commits with timestamps",
    color: "text-red-500",
  },
  {
    id: "readme",
    icon: FileText,
    title: "README Updates",
    description: "Dynamic README with stats and badges",
    color: "text-red-500",
  },
  {
    id: "version",
    icon: Code,
    title: "Version Bumps",
    description: "Automatic version increments",
    color: "text-red-500",
  },
  {
    id: "code",
    icon: Brain,
    title: "Code Changes",
    description: "Smart code modifications",
    color: "text-red-500",
  },
  {
    id: "custom",
    icon: Sparkles,
    title: "Custom Files",
    description: "User-defined file content",
    color: "text-red-500",
  },
];

const defaultTemplates: CommitTemplate[] = [
  {
    id: "1",
    name: "Feature Update",
    message: "feat: {feature} - {timestamp}",
    type: "readme",
    content: "Added new feature: {feature}",
  },
  {
    id: "2",
    name: "Bug Fix",
    message: "fix: {issue} - {timestamp}",
    type: "code",
    content: "Fixed issue: {issue}",
  },
  {
    id: "3",
    name: "Documentation",
    message: "docs: update documentation - {timestamp}",
    type: "readme",
    content: "Updated documentation with latest changes",
  },
];

export default function DashboardPage() {
  const { toast } = useToast();

  // Core state
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [showToken, setShowToken] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "error" | "paused">(
    "idle"
  );
  const [commitLogs, setCommitLogs] = useState<CommitLog[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [stats, setStats] = useState<BotStats>({
    totalCommits: 0,
    successfulCommits: 0,
    failedCommits: 0,
    uptime: 0,
    nextCommitIn: 0,
    repositoriesManaged: 0,
    averageCommitTime: 2.3,
  });

  // Advanced features state
  const [templates, setTemplates] =
    useState<CommitTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<CommitTemplate>>({});

  // Refs for robust interval management
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const uptimeRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isRunningRef = useRef(false);
  const commitCountRef = useRef(0);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(
        "github-auto-committer-settings"
      );
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setConfig({
          ...DEFAULT_CONFIG,
          ...settings,
          repositories: settings.repositories || [],
        });
      }

      const savedLogs = localStorage.getItem("github-auto-committer-logs");
      if (savedLogs) {
        const logs = JSON.parse(savedLogs);
        setCommitLogs(Array.isArray(logs) ? logs : []);
      }

      const savedStats = localStorage.getItem("github-auto-committer-stats");
      if (savedStats) {
        const statsData = JSON.parse(savedStats);
        setStats((prev) => ({ ...prev, ...statsData }));
      }

      const savedTemplates = localStorage.getItem(
        "github-auto-committer-templates"
      );
      if (savedTemplates) {
        const templatesData = JSON.parse(savedTemplates);
        setTemplates(templatesData);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast({
        title: "Error",
        description: "Failed to load saved settings",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Generate content based on commit type
  const generateCommitContent = useCallback(
    (type: string, commitNumber: number, repository?: string) => {
      const timestamp = new Date().toISOString();
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      const randomId = Math.random().toString(36).substring(7);
      const repoName =
        repository || config.repoUrl.split("/").pop() || "My Project";

      switch (type) {
        case "readme":
          return {
            path: "README.md",
            content: `# ${repoName}

![Last Updated](https://img.shields.io/badge/last%20updated-${date.replace(
              /-/g,
              "--"
            )}-red)
![Commits](https://img.shields.io/badge/commits-${stats.totalCommits + 1}-red)
![Status](https://img.shields.io/badge/status-active-red)
![Repositories](https://img.shields.io/badge/repositories-${
              config.repositories.length
            }-red)

## 🔥 DARK PROJECT STATS
- **Total Commits**: ${stats.totalCommits + 1}
- **Success Rate**: ${
              stats.totalCommits > 0
                ? Math.round(
                    (stats.successfulCommits / stats.totalCommits) * 100
                  )
                : 100
            }%
- **Repositories Managed**: ${config.repositories.length}
- **Last Updated**: ${date} at ${time}
- **Auto-Commit ID**: \`${randomId}\`
- **Average Commit Time**: ${stats.averageCommitTime}s

## 🚀 RECENT DARK ACTIVITY
This project is actively maintained with automated updates across multiple repositories.

### Latest Dark Changes
- ✅ Automated commit #${commitNumber}
- 📊 Statistics updated across ${config.repositories.length} repositories
- 🔄 Repository synchronized: ${repoName}
- 📝 Documentation refreshed with dark power
- 🤖 Smart scheduling optimized for domination

## 🤖 AUTOMATION STATUS
- **Bot Status**: ${isRunningRef.current ? "🔴 ACTIVE" : "⚫ INACTIVE"}
- **Schedule Type**: ${config.scheduleType}
- **Next Update**: ${config.interval} seconds
- **Batch Processing**: ${config.batchSize} repositories
- **Smart Scheduling**: ${config.smartScheduling ? "Enabled" : "Disabled"}

## 🔧 DARK FEATURES
- Multi-repository management
- Smart scheduling with AI optimization
- Custom commit templates
- Batch processing capabilities
- Real-time analytics and monitoring

---
*This README is automatically updated by GitHub Auto Committer*
*Generated on: ${timestamp}*
*Repository: ${repoName}*`,
          };

        case "version":
          const version = `2.${Math.floor(commitNumber / 10)}.${
            commitNumber % 10
          }`;
          return {
            path: "package.json",
            content: JSON.stringify(
              {
                name: repoName.toLowerCase().replace(/\s+/g, "-"),
                version: version,
                description:
                  "Auto-updated project with advanced version management",
                lastUpdated: timestamp,
                buildNumber: commitNumber,
                releaseDate: date,
                repository: repository || config.repoUrl,
                scripts: {
                  start: "node index.js",
                  build: "npm run compile",
                  test: "jest",
                  deploy: "npm run build && npm run start",
                },
                autoCommitter: {
                  enabled: true,
                  lastCommit: timestamp,
                  commitId: randomId,
                  version: "2.0.0",
                  features: [
                    "multi-repo",
                    "smart-scheduling",
                    "batch-processing",
                  ],
                },
                analytics: {
                  totalCommits: stats.totalCommits + 1,
                  successRate:
                    stats.totalCommits > 0
                      ? Math.round(
                          (stats.successfulCommits / stats.totalCommits) * 100
                        )
                      : 100,
                  averageCommitTime: stats.averageCommitTime,
                  repositoriesManaged: config.repositories.length,
                },
              },
              null,
              2
            ),
          };

        case "code":
          return {
            path: "src/config.js",
            content: `// Auto-generated configuration file
// Last updated: ${timestamp}
// Repository: ${repoName}

const CONFIG = {
  // Build information
  BUILD_INFO: {
    timestamp: "${timestamp}",
    buildNumber: ${commitNumber},
    version: "2.${Math.floor(commitNumber / 10)}.${commitNumber % 10}",
    environment: "production",
    commitId: "${randomId}",
    lastUpdated: "${date}",
    repository: "${repoName}",
  },

  // Application settings
  APP_SETTINGS: {
    name: "${repoName}",
    debug: false,
    autoUpdate: true,
    lastSync: "${timestamp}",
    multiRepo: ${config.repositories.length > 1},
    batchSize: ${config.batchSize},
  },

  // Performance metrics
  METRICS: {
    totalCommits: ${stats.totalCommits + 1},
    successRate: ${
      stats.totalCommits > 0
        ? Math.round((stats.successfulCommits / stats.totalCommits) * 100)
        : 100
    },
    uptime: ${Math.floor((Date.now() - startTimeRef.current) / 1000)},
    lastCheck: "${timestamp}",
    averageCommitTime: ${stats.averageCommitTime},
    repositoriesManaged: ${config.repositories.length},
  },

  // Feature flags
  FEATURES: {
    autoCommit: ${isRunningRef.current},
    smartScheduling: ${config.smartScheduling},
    batchProcessing: ${config.batchSize > 1},
    multiRepository: ${config.repositories.length > 1},
    monitoring: true,
    analytics: true,
    notifications: true,
    templates: true,
  },

  // Advanced configuration
  ADVANCED: {
    scheduleType: "${config.scheduleType}",
    cronExpression: "${config.cronExpression}",
    commitType: "${config.commitType}",
    interval: ${config.interval},
    lastCommitTime: "${timestamp}",
  },
};

// Export configuration
module.exports = CONFIG;

// Auto-generated on: ${date} at ${time}
// Commit #${commitNumber} | ID: ${randomId}
// Repository: ${repoName}
// Multi-repo support: ${
              config.repositories.length > 1 ? "Enabled" : "Disabled"
            }`,
          };

        case "custom":
          const template = templates.find((t) => t.id === selectedTemplate);
          const content = template?.content || config.customFileContent;

          return {
            path: config.customFilePath,
            content: content
              ? content
                  .replace(/\{timestamp\}/g, timestamp)
                  .replace(/\{date\}/g, date)
                  .replace(/\{time\}/g, time)
                  .replace(/\{commitNumber\}/g, commitNumber.toString())
                  .replace(/\{randomId\}/g, randomId)
                  .replace(/\{repository\}/g, repoName)
                  .replace(
                    /\{totalCommits\}/g,
                    (stats.totalCommits + 1).toString()
                  )
                  .replace(
                    /\{successRate\}/g,
                    (stats.totalCommits > 0
                      ? Math.round(
                          (stats.successfulCommits / stats.totalCommits) * 100
                        )
                      : 100
                    ).toString()
                  )
              : `# Custom Activity Log - ${repoName}

## Commit #${commitNumber}
- **Timestamp**: ${timestamp}
- **Date**: ${date}
- **Time**: ${time}
- **ID**: ${randomId}
- **Repository**: ${repoName}
- **Total Commits**: ${stats.totalCommits + 1}
- **Success Rate**: ${
                  stats.totalCommits > 0
                    ? Math.round(
                        (stats.successfulCommits / stats.totalCommits) * 100
                      )
                    : 100
                }%

## Advanced Features Active
- Multi-repository management: ${config.repositories.length > 1 ? "✅" : "❌"}
- Smart scheduling: ${config.smartScheduling ? "✅" : "❌"}
- Batch processing: ${config.batchSize > 1 ? "✅" : "❌"}
- Custom templates: ${templates.length > 0 ? "✅" : "❌"}

This is a custom file generated by GitHub Auto Committer with advanced features.`,
          };

        default:
          return {
            path: `auto-commits/commit-${Date.now()}.txt`,
            content: `Auto-commit Log Entry #${commitNumber}
===========================================
Timestamp: ${timestamp}
Commit ID: ${randomId}
Message: ${config.commitMessage}
Branch: ${config.branch}
Repository: ${repoName}
Interval: ${config.interval} seconds
Schedule Type: ${config.scheduleType}
Bot Status: ${isRunningRef.current ? "Running" : "Stopped"}
Total Commits: ${stats.totalCommits + 1}
Repositories Managed: ${config.repositories.length}
Batch Size: ${config.batchSize}
Smart Scheduling: ${config.smartScheduling ? "Enabled" : "Disabled"}

Advanced Features:
- Multi-repository support
- Smart scheduling optimization
- Custom commit templates
- Batch processing capabilities
- Real-time analytics

Generated at: ${date} at ${time}
End of auto-commit log entry`,
          };
      }
    },
    [config, stats, isRunningRef, startTimeRef, templates, selectedTemplate]
  );

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem(
        "github-auto-committer-settings",
        JSON.stringify(config)
      );
      localStorage.setItem(
        "github-auto-committer-templates",
        JSON.stringify(templates)
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [config, templates]);

  // Save logs to localStorage
  const saveLogs = useCallback((logs: CommitLog[]) => {
    try {
      localStorage.setItem(
        "github-auto-committer-logs",
        JSON.stringify(logs.slice(0, 100))
      );
    } catch (error) {
      console.error("Failed to save logs:", error);
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback((statsData: BotStats) => {
    try {
      localStorage.setItem(
        "github-auto-committer-stats",
        JSON.stringify(statsData)
      );
    } catch (error) {
      console.error("Failed to save stats:", error);
    }
  }, []);

  // Add log entry
  const addLog = useCallback(
    (log: Omit<CommitLog, "id">) => {
      const newLog: CommitLog = {
        ...log,
        id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      };
      setCommitLogs((prev) => {
        const updated = [newLog, ...prev.slice(0, 99)];
        saveLogs(updated);
        return updated;
      });
    },
    [saveLogs]
  );

  // Update stats
  const updateStats = useCallback(
    (success: boolean) => {
      setStats((prev) => {
        const updated = {
          ...prev,
          totalCommits: prev.totalCommits + 1,
          successfulCommits: success
            ? prev.successfulCommits + 1
            : prev.successfulCommits,
          failedCommits: success ? prev.failedCommits : prev.failedCommits + 1,
          repositoriesManaged: config.repositories.length,
        };
        saveStats(updated);
        return updated;
      });
    },
    [saveStats, config.repositories.length]
  );

  // Countdown timer
  const startCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    let timeLeft = config.interval;
    setStats((prev) => ({ ...prev, nextCommitIn: timeLeft }));

    countdownRef.current = setInterval(() => {
      timeLeft -= 1;
      setStats((prev) => ({ ...prev, nextCommitIn: Math.max(0, timeLeft) }));

      if (timeLeft <= 0 && countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    }, 1000);
  }, [config.interval]);

  // Validate GitHub token
  const validateToken = async (token: string): Promise<boolean> => {
    if (!token.trim()) {
      setIsTokenValid(false);
      return false;
    }

    try {
      const response = await fetch("/api/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      setIsTokenValid(data.valid);
      if (!data.valid) {
        setErrorMessage(data.error || "Invalid GitHub token");
        toast({
          title: "Invalid Token",
          description: data.error || "GitHub token validation failed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Token Valid",
          description: `Authenticated as ${data.user}`,
        });
      }
      return data.valid;
    } catch (error) {
      setIsTokenValid(false);
      setErrorMessage("Failed to validate token");
      toast({
        title: "Validation Error",
        description: "Failed to validate GitHub token",
        variant: "destructive",
      });
      return false;
    }
  };

  // Main commit function with robust error handling
  const performCommit = useCallback(
    async (repository?: string): Promise<boolean> => {
      if (
        !config.githubToken ||
        (!config.repoUrl && !repository) ||
        !isRunningRef.current
      ) {
        return false;
      }

      setIsCommitting(true);
      setErrorMessage("");

      try {
        const timestamp = new Date().toISOString();
        commitCountRef.current += 1;

        const targetRepo = repository || config.repoUrl;
        const fileContent = generateCommitContent(
          config.commitType,
          commitCountRef.current,
          targetRepo
        );

        // Validate file content before sending
        if (!fileContent.path || !fileContent.content) {
          throw new Error("Invalid file content generated");
        }

        const response = await fetch("/api/create-commit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            repoUrl: targetRepo,
            branch: config.branch,
            token: config.githubToken,
            message: `${config.commitMessage} - ${timestamp}`,
            files: [fileContent],
          }),
        });

        const commitData = await response.json();

        if (commitData.success) {
          const retryInfo = commitData.message.includes("retry")
            ? " (with retries)"
            : "";
          const commitTypeInfo = commitTypes.find(
            (t) => t.id === config.commitType
          );

          addLog({
            message: `✅ ${commitTypeInfo?.title || "Commit"} #${
              commitCountRef.current
            } created successfully${retryInfo}`,
            timestamp: new Date().toLocaleString(),
            sha: commitData.sha,
            status: "success",
            url: commitData.url,
            type: config.commitType,
            repository: targetRepo.split("/").pop(),
          });
          updateStats(true);
          setErrorMessage("");

          toast({
            title: "Commit Successful",
            description: `${
              commitTypeInfo?.title
            } commit ${commitData.sha.substring(0, 7)} created${retryInfo}`,
          });

          return true;
        } else {
          throw new Error(commitData.error || "Failed to create commit");
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        if (
          !errorMsg.includes("fast forward") ||
          errorMsg.includes("after") ||
          errorMsg.includes("retries")
        ) {
          addLog({
            message: `❌ Commit #${commitCountRef.current} failed: ${errorMsg}`,
            timestamp: new Date().toLocaleString(),
            sha: "",
            status: "error",
            type: config.commitType,
            repository: repository?.split("/").pop(),
          });
          updateStats(false);

          toast({
            title: "Commit Failed",
            description: errorMsg,
            variant: "destructive",
          });
        }

        setErrorMessage(errorMsg);
        console.error("Commit error:", error);
        return false;
      } finally {
        setIsCommitting(false);
      }
    },
    [config, addLog, updateStats, generateCommitContent, toast]
  );

  // Batch commit function for multiple repositories
  const performBatchCommit = useCallback(async (): Promise<void> => {
    if (config.repositories.length === 0) {
      await performCommit();
      return;
    }

    const activeRepos = config.repositories.filter((repo) => repo.isActive);
    const batchSize = Math.min(config.batchSize, activeRepos.length);

    for (let i = 0; i < batchSize; i++) {
      const repo = activeRepos[i];
      if (repo) {
        await performCommit(repo.url);
        // Small delay between commits to avoid rate limiting
        if (i < batchSize - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }, [config.repositories, config.batchSize, performCommit]);

  // Start the auto-committer with robust state management
  const handleStart = async () => {
    if (
      !config.githubToken ||
      (!config.repoUrl && config.repositories.length === 0)
    ) {
      const message = "Please provide GitHub token and at least one repository";
      setErrorMessage(message);
      toast({
        title: "Configuration Required",
        description: message,
        variant: "destructive",
      });
      return;
    }

    // Validate token first
    const tokenValid = await validateToken(config.githubToken);
    if (!tokenValid) {
      return;
    }

    // Save settings
    saveSettings();

    // Reset counters and set running state
    commitCountRef.current = 0;
    setIsRunning(true);
    isRunningRef.current = true;
    setStatus("running");
    setErrorMessage("");
    startTimeRef.current = Date.now();

    // Clear any existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (uptimeRef.current) clearInterval(uptimeRef.current);

    const commitTypeInfo = commitTypes.find((t) => t.id === config.commitType);

    addLog({
      message: `🚀 AutoCommitter started with ${
        commitTypeInfo?.title || "Simple"
      } commits (${
        config.repositories.length > 0
          ? `${config.repositories.length} repositories`
          : "single repository"
      })`,
      timestamp: new Date().toLocaleString(),
      sha: "",
      status: "success",
      type: config.commitType,
    });

    toast({
      title: "Bot Started",
      description: `AutoCommitter is now running with ${commitTypeInfo?.title} every ${config.interval} seconds`,
    });

    // Perform initial commit
    await performBatchCommit();

    // Start the main interval with proper error handling
    intervalRef.current = setInterval(async () => {
      if (isRunningRef.current) {
        try {
          await performBatchCommit();
          startCountdown();
        } catch (error) {
          console.error("Interval commit error:", error);
        }
      }
    }, config.interval * 1000);

    // Start countdown
    startCountdown();

    // Start uptime counter
    uptimeRef.current = setInterval(() => {
      if (isRunningRef.current) {
        setStats((prev) => ({
          ...prev,
          uptime: Math.floor((Date.now() - startTimeRef.current) / 1000),
        }));
      }
    }, 1000);
  };

  // Stop the auto-committer
  const handleStop = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    setStatus("idle");

    // Clear all intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (uptimeRef.current) {
      clearInterval(uptimeRef.current);
      uptimeRef.current = null;
    }

    setStats((prev) => ({ ...prev, nextCommitIn: 0 }));

    addLog({
      message: "⏹️ AutoCommitter stopped",
      timestamp: new Date().toLocaleString(),
      sha: "",
      status: "success",
      type: config.commitType,
    });

    toast({
      title: "Bot Stopped",
      description: "AutoCommitter has been stopped",
    });
  };

  // Manual commit
  const handleManualCommit = async () => {
    if (
      !config.githubToken ||
      (!config.repoUrl && config.repositories.length === 0)
    ) {
      const message = "Please provide GitHub token and at least one repository";
      setErrorMessage(message);
      toast({
        title: "Configuration Required",
        description: message,
        variant: "destructive",
      });
      return;
    }

    await performBatchCommit();
  };

  // Add repository
  const addRepository = () => {
    if (!config.repoUrl) {
      toast({
        title: "Repository Required",
        description: "Please enter a repository URL",
        variant: "destructive",
      });
      return;
    }

    const newRepo: Repository = {
      id: Date.now().toString(),
      url: config.repoUrl,
      name: config.repoUrl.split("/").pop() || "Unknown",
      branch: config.branch,
      isActive: true,
      commitCount: 0,
    };

    setConfig((prev) => ({
      ...prev,
      repositories: [...prev.repositories, newRepo],
    }));

    toast({
      title: "Repository Added",
      description: `Added ${newRepo.name} to managed repositories`,
    });
  };

  // Remove repository
  const removeRepository = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      repositories: prev.repositories.filter((repo) => repo.id !== id),
    }));

    toast({
      title: "Repository Removed",
      description: "Repository removed from management",
    });
  };

  // Toggle repository active status
  const toggleRepository = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      repositories: prev.repositories.map((repo) =>
        repo.id === id ? { ...repo, isActive: !repo.isActive } : repo
      ),
    }));
  };

  // Save template
  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.message) {
      toast({
        title: "Template Required",
        description: "Please provide template name and message",
        variant: "destructive",
      });
      return;
    }

    const template: CommitTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      message: newTemplate.message || "",
      type: newTemplate.type || "custom",
      content: newTemplate.content || "",
    };

    setTemplates((prev) => [...prev, template]);
    setNewTemplate({});
    setIsEditingTemplate(false);

    toast({
      title: "Template Saved",
      description: `Template "${template.name}" saved successfully`,
    });
  };

  // Clear logs
  const clearLogs = () => {
    setCommitLogs([]);
    localStorage.removeItem("github-auto-committer-logs");
    localStorage.removeItem("github-auto-committer-stats");
    setStats({
      totalCommits: 0,
      successfulCommits: 0,
      failedCommits: 0,
      uptime: 0,
      nextCommitIn: 0,
      repositoriesManaged: 0,
      averageCommitTime: 2.3,
    });
    commitCountRef.current = 0;

    toast({
      title: "Logs Cleared",
      description: "All logs and statistics have been cleared",
    });
  };

  // Export logs
  const exportLogs = () => {
    const data = {
      logs: commitLogs,
      stats,
      config: { ...config, githubToken: "***" },
      templates,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autocommitter-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "All data has been exported successfully",
    });
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Update config helper
  const updateConfig = (updates: Partial<BotConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (uptimeRef.current) clearInterval(uptimeRef.current);
    };
  }, []);

  // Save settings when config changes
  useEffect(() => {
    saveSettings();
  }, [saveSettings]);

  const successRate =
    stats.totalCommits > 0
      ? Math.round((stats.successfulCommits / stats.totalCommits) * 100)
      : 0;
  const selectedCommitType = commitTypes.find(
    (t) => t.id === config.commitType
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto container-padding py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <img
              src="/images/devil-logo.png"
              alt="GitHub Auto Committer"
              className="w-20 h-20"
            />
          </div>
          <Badge className="bg-red-500 text-white px-8 py-3 text-xl font-black">
            <Zap className="h-6 w-6 mr-3" />
            DARK DASHBOARD
          </Badge>
          <h1 className="text-5xl font-black text-white">
            AUTOMATION CONTROL CENTER
          </h1>
          <p className="text-white text-xl max-w-4xl mx-auto font-bold">
            Command your GitHub automation empire with advanced features and
            intelligent repository management
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert className="bg-red-500 text-white border-2 border-red-500">
            <AlertCircle className="h-6 w-6" />
            <AlertDescription className="text-white text-lg font-bold">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Important Setup Info */}
        <Alert className="bg-white text-black border-2 border-red-500">
          <Info className="h-6 w-6 text-red-500" />
          <AlertDescription className="text-black text-lg font-bold">
            <strong className="text-red-500">DARK TIP:</strong> Use
            multi-repository management to automate commits across all your
            projects simultaneously. Enable smart scheduling for optimal commit
            timing and maximum domination.
          </AlertDescription>
        </Alert>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <Card className="bg-white text-black border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Activity className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-lg font-black text-black">Total Commits</p>
                  <p className="text-3xl font-black text-red-500">
                    {stats.totalCommits}
                  </p>
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
                  <p className="text-3xl font-black text-red-500">
                    {successRate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white text-black border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-lg font-black text-black">Uptime</p>
                  <p className="text-3xl font-black text-red-500">
                    {formatTime(stats.uptime)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white text-black border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <GitCommit className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-lg font-black text-black">Next Commit</p>
                  <p className="text-3xl font-black text-red-500">
                    {stats.nextCommitIn > 0
                      ? formatTime(stats.nextCommitIn)
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white text-black border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-lg font-black text-black">Repositories</p>
                  <p className="text-3xl font-black text-red-500">
                    {config.repositories.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white text-black border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Cpu className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-lg font-black text-black">Avg Time</p>
                  <p className="text-3xl font-black text-red-500">
                    {stats.averageCommitTime}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GitHub Token Setup */}
        <Card className="bg-white text-black border-2 border-red-500">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Key className="h-8 w-8 text-red-500" />
              <CardTitle className="text-black text-2xl font-black">
                GITHUB AUTHENTICATION
              </CardTitle>
            </div>
            <CardDescription className="text-black text-lg font-bold">
              Enter your GitHub Personal Access Token to enable advanced
              automation features.
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-red-500 hover:text-red-600 ml-2 font-bold"
              >
                Create one here
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label
                htmlFor="github-token"
                className="text-black text-lg font-black"
              >
                GitHub Personal Access Token
              </Label>
              <div className="relative">
                <Input
                  id="github-token"
                  type={showToken ? "text" : "password"}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={config.githubToken}
                  onChange={(e) =>
                    updateConfig({ githubToken: e.target.value })
                  }
                  className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent text-red-500 hover:text-red-600"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                </Button>
              </div>
              {isTokenValid && (
                <p className="text-lg text-red-500 flex items-center font-bold">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  Token is valid and ready for advanced features
                </p>
              )}
            </div>
            <Alert className="bg-black text-white border-2 border-red-500">
              <AlertDescription className="text-white text-lg font-bold">
                Required permissions:{" "}
                <strong className="text-red-500">repo</strong> (Full control of
                repositories) for multi-repository management
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Quick Setup Wizard */}
        <Card className="bg-white text-black border-2 border-red-500">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-red-500" />
              <CardTitle className="text-black text-2xl font-black">
                QUICK SETUP WIZARD
              </CardTitle>
            </div>
            <CardDescription className="text-black text-lg font-bold">
              Follow these steps to quickly configure your automation bot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ol className="list-decimal list-inside space-y-3 text-lg font-bold">
              <li>
                <span className="text-red-500">Step 1:</span> Create a GitHub
                Personal Access Token with 'repo' permissions{" "}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-500 hover:text-red-600 ml-2 font-bold"
                >
                  Create one here
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </li>
              <li>
                <span className="text-red-500">Step 2:</span> Enter your token
                in the authentication section below
              </li>
              <li>
                <span className="text-red-500">Step 3:</span> Add repositories
                to manage (or use single repository mode)
              </li>
              <li>
                <span className="text-red-500">Step 4:</span> Choose your
                preferred commit type and scheduling
              </li>
              <li>
                <span className="text-red-500">Step 5:</span> Configure
                templates and advanced options as needed
              </li>
              <li>
                <span className="text-red-500">Step 6:</span> Click "Start
                Automation" to begin intelligent auto-committing
              </li>
            </ol>
          </CardContent>
        </Card>

        <Tabs defaultValue="repositories" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white border-2 border-red-500">
            <TabsTrigger
              value="repositories"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-black font-black text-lg"
            >
              Repositories
            </TabsTrigger>
            <TabsTrigger
              value="automation"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-black font-black text-lg"
            >
              Automation
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-black font-black text-lg"
            >
              Templates
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-black font-black text-lg"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-black font-black text-lg"
            >
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repositories" className="space-y-8">
            {/* Multi-Repository Management */}
            <Card className="bg-white text-black border-2 border-red-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Database className="h-8 w-8 text-red-500" />
                    <CardTitle className="text-black text-2xl font-black">
                      REPOSITORY MANAGEMENT
                    </CardTitle>
                  </div>
                  <Badge className="bg-red-500 text-white font-black text-lg px-4 py-2">
                    {config.repositories.length} repositories
                  </Badge>
                </div>
                <CardDescription className="text-black text-lg font-bold">
                  Manage multiple repositories from a single dashboard with
                  batch processing capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Add Repository */}
                <div className="space-y-6 p-6 bg-black rounded-xl border-2 border-red-500">
                  <h4 className="font-black text-white text-xl">
                    Add New Repository
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="repo-url"
                        className="text-white text-lg font-black"
                      >
                        Repository URL
                      </Label>
                      <Input
                        id="repo-url"
                        placeholder="https://github.com/username/repository"
                        value={config.repoUrl}
                        onChange={(e) =>
                          updateConfig({ repoUrl: e.target.value })
                        }
                        className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="branch"
                        className="text-white text-lg font-black"
                      >
                        Branch
                      </Label>
                      <Input
                        id="branch"
                        placeholder="main"
                        value={config.branch}
                        onChange={(e) =>
                          updateConfig({ branch: e.target.value })
                        }
                        className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white text-lg font-black">
                        Action
                      </Label>
                      <Button
                        onClick={addRepository}
                        disabled={!config.repoUrl}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-black text-lg"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Repository
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Repository List */}
                <div className="space-y-6">
                  <h4 className="font-black text-black text-xl">
                    Managed Repositories
                  </h4>
                  {config.repositories.length > 0 ? (
                    <div className="space-y-4">
                      {config.repositories.map((repo) => (
                        <div
                          key={repo.id}
                          className="flex items-center justify-between p-6 bg-black rounded-xl border-2 border-red-500"
                        >
                          <div className="flex items-center space-x-6">
                            <Switch
                              checked={repo.isActive}
                              onCheckedChange={() => toggleRepository(repo.id)}
                            />
                            <div>
                              <p className="font-black text-white text-lg">
                                {repo.name}
                              </p>
                              <p className="text-white font-bold">{repo.url}</p>
                              <p className="text-red-500 font-bold">
                                Branch: {repo.branch} • Commits:{" "}
                                {repo.commitCount}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge
                              className={
                                repo.isActive
                                  ? "bg-red-500 text-white"
                                  : "bg-white text-black border-2 border-red-500"
                              }
                            >
                              {repo.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              onClick={() => removeRepository(repo.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-white"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-black">
                      <Database className="h-16 w-16 mx-auto mb-6 text-red-500" />
                      <p className="text-xl font-black">
                        No repositories added yet
                      </p>
                      <p className="text-lg font-bold">
                        Add your first repository to get started with multi-repo
                        automation
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-8">
            {/* Automation Configuration */}
            <Card className="bg-white text-black border-2 border-red-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Settings className="h-8 w-8 text-red-500" />
                  <CardTitle className="text-black text-2xl font-black">
                    AUTOMATION CONFIGURATION
                  </CardTitle>
                </div>
                <CardDescription className="text-black text-lg font-bold">
                  Configure advanced automation settings and scheduling options
                  for maximum domination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Commit Type Selection */}
                <div className="space-y-6">
                  <h4 className="font-black text-black text-xl">Commit Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {commitTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = config.commitType === type.id;
                      return (
                        <div
                          key={type.id}
                          className={`p-6 rounded-xl cursor-pointer border-2 transition-all duration-300 ${
                            isSelected
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-white text-black border-red-500 hover:bg-red-500 hover:text-white"
                          }`}
                          onClick={() =>
                            updateConfig({ commitType: type.id as any })
                          }
                        >
                          <div className="text-center space-y-3">
                            <div className="w-16 h-16 mx-auto rounded-xl bg-black flex items-center justify-center">
                              <Icon className="h-8 w-8 text-red-500" />
                            </div>
                            <h4 className="font-black text-lg">{type.title}</h4>
                            <p className="text-sm font-bold">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scheduling Options */}
                <div className="space-y-6">
                  <h4 className="font-black text-black text-xl">Scheduling</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label className="text-black text-lg font-black">
                        Schedule Type
                      </Label>
                      <Select
                        value={config.scheduleType}
                        onValueChange={(value: any) =>
                          updateConfig({ scheduleType: value })
                        }
                        className="bg-white border-4 border-red-500 text-black font-bold text-lg rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                      >
                        <SelectTrigger className="bg-white border-4 border-red-500 text-black font-bold text-lg rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-red-500">
                          <SelectItem value="interval">
                            Fixed Interval
                          </SelectItem>
                          <SelectItem value="cron">Cron Expression</SelectItem>
                          <SelectItem value="smart">
                            Smart Scheduling
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {config.scheduleType === "interval" && (
                      <div className="space-y-3">
                        <Label
                          htmlFor="interval"
                          className="text-black text-lg font-black"
                        >
                          Interval (seconds)
                        </Label>
                        <Input
                          id="interval"
                          type="number"
                          min="60"
                          value={config.interval}
                          onChange={(e) =>
                            updateConfig({
                              interval: Math.max(
                                60,
                                Number.parseInt(e.target.value) || 60
                              ),
                            })
                          }
                          className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    )}
                    {config.scheduleType === "cron" && (
                      <div className="space-y-3">
                        <Label
                          htmlFor="cron"
                          className="text-black text-lg font-black"
                        >
                          Cron Expression
                        </Label>
                        <Input
                          id="cron"
                          placeholder="0 */6 * * *"
                          value={config.cronExpression}
                          onChange={(e) =>
                            updateConfig({ cronExpression: e.target.value })
                          }
                          className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <Label
                        htmlFor="batch-size"
                        className="text-black text-lg font-black"
                      >
                        Batch Size
                      </Label>
                      <Input
                        id="batch-size"
                        type="number"
                        min="1"
                        max="10"
                        value={config.batchSize}
                        onChange={(e) =>
                          updateConfig({
                            batchSize: Math.max(
                              1,
                              Math.min(10, Number.parseInt(e.target.value) || 1)
                            ),
                          })
                        }
                        className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-6">
                  <h4 className="font-black text-black text-xl">
                    Advanced Options
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-black text-lg font-black">
                          Smart Scheduling
                        </Label>
                        <p className="text-black font-bold">
                          AI-optimized commit timing based on repository
                          activity
                        </p>
                      </div>
                      <Switch
                        checked={config.smartScheduling}
                        onCheckedChange={(checked) =>
                          updateConfig({ smartScheduling: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Commit Message Template */}
                <div className="space-y-3">
                  <Label
                    htmlFor="commit-message"
                    className="text-black text-lg font-black"
                  >
                    Commit Message Template
                  </Label>
                  <Textarea
                    id="commit-message"
                    placeholder="Auto-commit: Update files"
                    value={config.commitMessage}
                    onChange={(e) =>
                      updateConfig({ commitMessage: e.target.value })
                    }
                    rows={3}
                    className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500 min-h-[120px]"
                  />
                  <p className="text-black font-bold">
                    Available variables: {"{timestamp}"}, {"{date}"}, {"{time}"}
                    , {"{repository}"}, {"{commitNumber}"}
                  </p>
                </div>

                {config.commitType === "custom" && (
                  <>
                    <div className="space-y-3">
                      <Label
                        htmlFor="custom-path"
                        className="text-black text-lg font-black"
                      >
                        Custom File Path
                      </Label>
                      <Input
                        id="custom-path"
                        placeholder="auto-commits/activity.md"
                        value={config.customFilePath}
                        onChange={(e) =>
                          updateConfig({ customFilePath: e.target.value })
                        }
                        className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="custom-content"
                        className="text-black text-lg font-black"
                      >
                        Custom File Content
                      </Label>
                      <Textarea
                        id="custom-content"
                        placeholder="Use variables like {timestamp}, {repository}, etc."
                        value={config.customFileContent}
                        onChange={(e) =>
                          updateConfig({ customFileContent: e.target.value })
                        }
                        rows={6}
                        className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500 min-h-[120px]"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-8">
            {/* Commit Templates */}
            <Card className="bg-white text-black border-2 border-red-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <CardTitle className="text-black text-2xl font-black">
                      COMMIT TEMPLATES
                    </CardTitle>
                  </div>
                  <Button
                    onClick={() => setIsEditingTemplate(true)}
                    className="bg-red-500 hover:bg-red-600 text-white font-black"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    New Template
                  </Button>
                </div>
                <CardDescription className="text-black text-lg font-bold">
                  Create and manage reusable commit templates for different
                  scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Template Editor */}
                {isEditingTemplate && (
                  <div className="space-y-6 p-6 bg-black rounded-xl border-2 border-red-500">
                    <h4 className="font-black text-white text-xl">
                      Create New Template
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-white text-lg font-black">
                          Template Name
                        </Label>
                        <Input
                          placeholder="Feature Update"
                          value={newTemplate.name || ""}
                          onChange={(e) =>
                            setNewTemplate({
                              ...newTemplate,
                              name: e.target.value,
                            })
                          }
                          className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-white text-lg font-black">
                          Commit Type
                        </Label>
                        <Select
                          value={newTemplate.type || "custom"}
                          onValueChange={(value) =>
                            setNewTemplate({ ...newTemplate, type: value })
                          }
                          className="bg-white border-4 border-red-500 text-black font-bold text-lg rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                        >
                          <SelectTrigger className="bg-white border-4 border-red-500 text-black font-bold text-lg rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-2 border-red-500">
                            {commitTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white text-lg font-black">
                        Commit Message
                      </Label>
                      <Input
                        placeholder="feat: {feature} - {timestamp}"
                        value={newTemplate.message || ""}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            message: e.target.value,
                          })
                        }
                        className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white text-lg font-black">
                        Content Template
                      </Label>
                      <Textarea
                        placeholder="Template content with variables..."
                        value={newTemplate.content || ""}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            content: e.target.value,
                          })
                        }
                        rows={4}
                        className="bg-white border-4 border-red-500 text-black font-bold text-lg p-4 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-500 min-h-[120px]"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        onClick={saveTemplate}
                        className="bg-red-500 hover:bg-red-600 text-white font-black"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        Save Template
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditingTemplate(false);
                          setNewTemplate({});
                        }}
                        variant="outline"
                        className="border-2 border-white text-white hover:bg-white hover:text-black font-black"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Template List */}
                <div className="space-y-6">
                  <h4 className="font-black text-black text-xl">
                    Available Templates
                  </h4>
                  {templates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? "border-red-500 bg-red-500 text-white"
                              : "border-red-500 bg-white text-black hover:bg-red-500 hover:text-white"
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-black text-lg">
                              {template.name}
                            </h5>
                            <Badge className="bg-black text-white font-bold">
                              {commitTypes.find((t) => t.id === template.type)
                                ?.title || template.type}
                            </Badge>
                          </div>
                          <p className="font-bold mb-3">{template.message}</p>
                          <p className="text-sm font-bold truncate">
                            {template.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-black">
                      <FileText className="h-16 w-16 mx-auto mb-6 text-red-500" />
                      <p className="text-xl font-black">
                        No templates created yet
                      </p>
                      <p className="text-lg font-bold">
                        Create your first template to get started
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            {/* Analytics Dashboard */}
            <Card className="bg-white text-black border-2 border-red-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-red-500" />
                  <CardTitle className="text-black text-2xl font-black">
                    ANALYTICS & INSIGHTS
                  </CardTitle>
                </div>
                <CardDescription className="text-black text-lg font-bold">
                  Detailed performance metrics and automation insights for total
                  domination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-black p-6 rounded-xl border-2 border-red-500">
                    <h4 className="font-black text-white mb-4 text-lg">
                      Performance
                    </h4>
                    <div className="space-y-3 text-lg">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Success Rate:
                        </span>
                        <span className="text-red-500 font-black">
                          {successRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Total Commits:
                        </span>
                        <span className="text-white font-black">
                          {stats.totalCommits}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Failed Commits:
                        </span>
                        <span className="text-red-500 font-black">
                          {stats.failedCommits}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Avg Time:</span>
                        <span className="text-red-500 font-black">
                          {stats.averageCommitTime}s
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black p-6 rounded-xl border-2 border-red-500">
                    <h4 className="font-black text-white mb-4 text-lg">
                      Repository Stats
                    </h4>
                    <div className="space-y-3 text-lg">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Total Repos:
                        </span>
                        <span className="text-white font-black">
                          {config.repositories.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Active Repos:
                        </span>
                        <span className="text-red-500 font-black">
                          {config.repositories.filter((r) => r.isActive).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Batch Size:
                        </span>
                        <span className="text-red-500 font-black">
                          {config.batchSize}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Templates:</span>
                        <span className="text-red-500 font-black">
                          {templates.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black p-6 rounded-xl border-2 border-red-500">
                    <h4 className="font-black text-white mb-4 text-lg">
                      Automation
                    </h4>
                    <div className="space-y-3 text-lg">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Schedule Type:
                        </span>
                        <span className="text-white font-black capitalize">
                          {config.scheduleType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Smart Scheduling:
                        </span>
                        <span
                          className={
                            config.smartScheduling
                              ? "text-red-500 font-black"
                              : "text-white font-black"
                          }
                        >
                          {config.smartScheduling ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Commit Type:
                        </span>
                        <span className="text-red-500 font-black">
                          {selectedCommitType?.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Interval:</span>
                        <span className="text-red-500 font-black">
                          {config.interval}s
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black p-6 rounded-xl border-2 border-red-500">
                    <h4 className="font-black text-white mb-4 text-lg">
                      Status
                    </h4>
                    <div className="space-y-3 text-lg">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Bot Status:
                        </span>
                        <span
                          className={
                            status === "running"
                              ? "text-red-500 font-black"
                              : "text-white font-black"
                          }
                        >
                          {status === "running" ? "🔴 Active" : "⚫ Inactive"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Uptime:</span>
                        <span className="text-white font-black">
                          {formatTime(stats.uptime)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Next Commit:
                        </span>
                        <span className="text-white font-black">
                          {stats.nextCommitIn > 0
                            ? formatTime(stats.nextCommitIn)
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white font-bold">
                          Token Valid:
                        </span>
                        <span
                          className={
                            isTokenValid
                              ? "text-red-500 font-black"
                              : "text-red-500 font-black"
                          }
                        >
                          {isTokenValid ? "✅ Yes" : "❌ No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Chart */}
                <div className="bg-black p-6 rounded-xl border-2 border-red-500">
                  <h4 className="font-black text-white mb-6 text-xl">
                    Recent Activity
                  </h4>
                  <div className="space-y-4">
                    {commitLogs.slice(0, 5).map((log) => {
                      const logCommitType = commitTypes.find(
                        (t) => t.id === log.type
                      );
                      const LogIcon = logCommitType?.icon || GitCommit;
                      return (
                        <div
                          key={log.id}
                          className="flex items-center space-x-4 text-lg"
                        >
                          {log.status === "success" ? (
                            <CheckCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                          )}
                          <LogIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
                          <span className="text-white flex-1 truncate font-bold">
                            {log.message}
                          </span>
                          <span className="text-red-500 text-sm font-bold">
                            {log.timestamp}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-8">
            {/* Advanced Settings */}
            <Card className="bg-white text-black border-2 border-red-500">
              <CardHeader>
                <CardTitle className="text-black text-2xl font-black">
                  ADVANCED SETTINGS
                </CardTitle>
                <CardDescription className="text-black text-lg font-bold">
                  Fine-tune your automation behavior and access experimental
                  features for ultimate control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Bot Controls */}
                <div className="space-y-6">
                  <h4 className="font-black text-black text-xl">
                    Bot Controls
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <Button
                      onClick={handleStart}
                      disabled={
                        isRunning ||
                        !config.githubToken ||
                        (!config.repoUrl && config.repositories.length === 0) ||
                        isCommitting
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-black text-xl py-6"
                    >
                      <Play className="h-6 w-6 mr-3" />
                      {isCommitting ? "Starting..." : "Start Automation"}
                    </Button>
                    <Button
                      onClick={handleStop}
                      disabled={!isRunning}
                      variant="outline"
                      className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black text-xl py-6"
                    >
                      <Square className="h-6 w-6 mr-3" />
                      Stop Automation
                    </Button>
                  </div>

                  <Separator className="bg-red-500 h-1" />

                  <Button
                    onClick={handleManualCommit}
                    variant="secondary"
                    className="w-full bg-black text-white hover:bg-red-500 font-black text-xl py-6 border-2 border-red-500"
                    disabled={
                      !config.githubToken ||
                      (!config.repoUrl && config.repositories.length === 0) ||
                      isCommitting
                    }
                  >
                    <GitCommit className="h-6 w-6 mr-3" />
                    {isCommitting ? "Committing..." : "Manual Commit Now"}
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={exportLogs}
                      variant="outline"
                      disabled={commitLogs.length === 0}
                      className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      onClick={clearLogs}
                      variant="outline"
                      disabled={commitLogs.length === 0}
                      className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black"
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Clear Logs
                    </Button>
                  </div>
                </div>

                {/* Status Display */}
                <Card className="bg-black border-2 border-red-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-8 w-8 text-red-500" />
                        <CardTitle className="text-white text-xl font-black">
                          Current Status
                        </CardTitle>
                      </div>
                      <Badge
                        className={
                          status === "running"
                            ? "bg-red-500 text-white font-black"
                            : status === "error"
                            ? "bg-red-500 text-white font-black"
                            : "bg-white text-black font-black"
                        }
                      >
                        {status === "running"
                          ? "Running"
                          : status === "error"
                          ? "Error"
                          : "Idle"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-6 w-6 text-red-500" />
                          <span className="text-white font-bold text-lg">
                            Last commit:{" "}
                            {commitLogs.length > 0
                              ? commitLogs[0].timestamp
                              : "Never"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <GitBranch className="h-6 w-6 text-red-500" />
                          <span className="text-white font-bold text-lg">
                            Branch: {config.branch}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          {selectedCommitType && (
                            <>
                              <selectedCommitType.icon className="h-6 w-6 text-red-500" />
                              <span className="text-white font-bold text-lg">
                                {selectedCommitType.title}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {status === "running" && stats.nextCommitIn > 0 && (
                        <div className="space-y-3">
                          <div className="flex justify-between text-lg">
                            <span className="text-white font-bold">
                              Next commit in:
                            </span>
                            <span className="text-red-500 font-black font-mono">
                              {formatTime(stats.nextCommitIn)}
                            </span>
                          </div>
                          <Progress
                            value={
                              ((config.interval - stats.nextCommitIn) /
                                config.interval) *
                              100
                            }
                            className="h-4 bg-white border-2 border-red-500"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Setup Guide */}
                <div className="bg-black p-6 rounded-xl border-2 border-red-500 space-y-4">
                  <h4 className="font-black text-lg text-white">
                    Quick Setup Guide
                  </h4>
                  <ol className="text-white space-y-2 font-bold">
                    <li>
                      1. Create a GitHub Personal Access Token with 'repo'
                      permissions
                    </li>
                    <li>2. Enter your token in the authentication section</li>
                    <li>
                      3. Add repositories to manage (or use single repository
                      mode)
                    </li>
                    <li>4. Choose your preferred commit type and scheduling</li>
                    <li>
                      5. Configure templates and advanced options as needed
                    </li>
                    <li>
                      6. Click "Start Automation" to begin intelligent
                      auto-committing
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card className="bg-white text-black border-2 border-red-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-black text-2xl font-black">
                  RECENT ACTIVITY
                </CardTitle>
                <CardDescription className="text-black text-lg font-bold">
                  Latest commits and automation activity
                </CardDescription>
              </div>
              <Badge className="bg-red-500 text-white font-black text-lg px-4 py-2">
                {commitLogs.length} logs
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {commitLogs.length > 0 ? (
                commitLogs.map((log) => {
                  const logCommitType = commitTypes.find(
                    (t) => t.id === log.type
                  );
                  const LogIcon = logCommitType?.icon || GitCommit;
                  return (
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
                          <LogIcon className="h-5 w-5 text-red-500" />
                          <p className="font-black text-lg break-words">
                            {log.message}
                          </p>
                          {log.repository && (
                            <Badge className="bg-white text-black font-bold">
                              {log.repository}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-bold">{log.timestamp}</p>
                        {log.sha && (
                          <div className="flex items-center space-x-3 mt-2">
                            <p className="text-sm font-mono font-bold">
                              SHA: {log.sha.substring(0, 7)}
                            </p>
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
                  );
                })
              ) : (
                <div className="flex items-center space-x-4 p-8 bg-black rounded-xl border-2 border-red-500">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-white font-black text-lg">
                      No commits yet
                    </p>
                    <p className="text-white font-bold">
                      Start the automation to begin intelligent auto-committing
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
