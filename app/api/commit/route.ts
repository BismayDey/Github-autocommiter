import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, branch, message, token } = await request.json()

    if (!repoUrl || !token) {
      return NextResponse.json({ error: "Repository URL and GitHub token are required" }, { status: 400 })
    }

    // Extract owner and repo from URL
    const urlParts = repoUrl.replace("https://github.com/", "").split("/")
    const owner = urlParts[0]
    const repo = urlParts[1]

    // Get the current commit SHA
    const branchResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!branchResponse.ok) {
      throw new Error("Failed to get branch information")
    }

    const branchData = await branchResponse.json()
    const currentSha = branchData.commit.sha

    // Create a new commit (this is a simplified example)
    // In a real implementation, you would:
    // 1. Get the current tree
    // 2. Create blobs for changed files
    // 3. Create a new tree with the changes
    // 4. Create a new commit
    // 5. Update the branch reference

    const commitData = {
      message: message || "Auto-commit: Update files",
      tree: currentSha, // This should be the tree SHA, not commit SHA
      parents: [currentSha],
    }

    const commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commitData),
    })

    if (!commitResponse.ok) {
      const errorData = await commitResponse.json()
      throw new Error(errorData.message || "Failed to create commit")
    }

    const commit = await commitResponse.json()

    return NextResponse.json({
      success: true,
      commitSha: commit.sha,
      message: "Commit created successfully",
    })
  } catch (error) {
    console.error("Commit error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
