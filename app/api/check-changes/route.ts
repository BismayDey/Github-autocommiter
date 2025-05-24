import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, branch, token, lastCommitSha } = await request.json()

    if (!repoUrl || !token) {
      return NextResponse.json({ error: "Repository URL and GitHub token are required" }, { status: 400 })
    }

    // Extract owner and repo from URL
    const urlParts = repoUrl.replace("https://github.com/", "").split("/")
    const owner = urlParts[0]
    const repo = urlParts[1]

    // Get the latest commits
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (!commitsResponse.ok) {
      throw new Error("Failed to fetch commits")
    }

    const commits = await commitsResponse.json()
    const latestCommit = commits[0]

    // Check if there are new commits
    const hasChanges = lastCommitSha !== latestCommit.sha

    return NextResponse.json({
      hasChanges,
      latestCommitSha: latestCommit.sha,
      latestCommitMessage: latestCommit.commit.message,
      latestCommitDate: latestCommit.commit.committer.date,
    })
  } catch (error) {
    console.error("Check changes error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
