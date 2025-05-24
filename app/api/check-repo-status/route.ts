import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, branch, token } = await request.json()

    if (!repoUrl || !token) {
      return NextResponse.json({ error: "Repository URL and token are required" }, { status: 400 })
    }

    // Extract owner and repo from URL
    const urlParts = repoUrl.replace("https://github.com/", "").replace(".git", "").split("/")
    const owner = urlParts[0]
    const repo = urlParts[1]

    if (!owner || !repo) {
      return NextResponse.json({ error: "Invalid repository URL format" }, { status: 400 })
    }

    // Check if repository exists and is accessible
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        return NextResponse.json({ error: "Repository not found or not accessible" }, { status: 404 })
      }
      throw new Error(`GitHub API error: ${repoResponse.status}`)
    }

    // For auto-committer, we'll always assume there are changes to commit
    // In a real scenario, you might check working directory status
    return NextResponse.json({
      hasUncommittedChanges: true,
      repoExists: true,
      owner,
      repo,
    })
  } catch (error) {
    console.error("Check repo status error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
