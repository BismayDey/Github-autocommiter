import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, branch, token, message, files } = await request.json()

    if (!repoUrl || !token || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Repository URL, token, and message are required",
        },
        { status: 400 },
      )
    }

    // Extract owner and repo from URL
    const urlParts = repoUrl.replace("https://github.com/", "").replace(".git", "").split("/")
    const owner = urlParts[0]
    const repo = urlParts[1]

    if (!owner || !repo) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid repository URL format. Use: https://github.com/owner/repo",
        },
        { status: 400 },
      )
    }

    const headers = {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "GitHub-Auto-Committer/1.0",
      "Content-Type": "application/json",
    }

    // First, verify the repository exists and is accessible
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: "Repository not found or not accessible. Please check the URL and token permissions.",
          },
          { status: 404 },
        )
      }
      throw new Error(`Repository verification failed: ${repoResponse.status}`)
    }

    // Get the branch reference to ensure it exists
    const branchRefResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      headers,
    })

    let currentCommitSha: string
    let currentTreeSha: string

    if (branchRefResponse.ok) {
      // Branch exists, get the current commit
      const branchRef = await branchRefResponse.json()
      currentCommitSha = branchRef.object.sha

      // Get the commit details to access the tree
      const commitResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/commits/${currentCommitSha}`,
        { headers },
      )

      if (!commitResponse.ok) {
        throw new Error(`Failed to get commit details: ${commitResponse.status}`)
      }

      const commitData = await commitResponse.json()
      currentTreeSha = commitData.tree.sha
    } else if (branchRefResponse.status === 404) {
      // Branch doesn't exist, we need to create it
      // First, try to get the default branch
      const repoData = await repoResponse.json()
      const defaultBranch = repoData.default_branch || "main"

      if (branch !== defaultBranch) {
        // Try to get the default branch reference
        const defaultBranchResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${defaultBranch}`,
          { headers },
        )

        if (defaultBranchResponse.ok) {
          const defaultBranchRef = await defaultBranchResponse.json()
          currentCommitSha = defaultBranchRef.object.sha

          // Get the commit details
          const commitResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/commits/${currentCommitSha}`,
            { headers },
          )

          if (!commitResponse.ok) {
            throw new Error(`Failed to get default branch commit: ${commitResponse.status}`)
          }

          const commitData = await commitResponse.json()
          currentTreeSha = commitData.tree.sha
        } else {
          // Repository might be empty, create an initial commit
          return NextResponse.json(
            {
              success: false,
              error: `Branch '${branch}' not found and repository appears to be empty. Please create an initial commit first.`,
            },
            { status: 404 },
          )
        }
      } else {
        // Repository is empty
        return NextResponse.json(
          {
            success: false,
            error: "Repository appears to be empty. Please create an initial commit first.",
          },
          { status: 404 },
        )
      }
    } else {
      throw new Error(`Failed to check branch: ${branchRefResponse.status}`)
    }

    // Validate that we have the required data
    if (!currentCommitSha || !currentTreeSha) {
      throw new Error("Failed to get current commit or tree SHA")
    }

    // Create blobs for each file
    const treeItems = []
    if (files && Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        if (!file.path || !file.content) {
          console.warn("Skipping invalid file:", file)
          continue
        }

        try {
          const blobResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              content: file.content,
              encoding: "utf-8",
            }),
          })

          if (!blobResponse.ok) {
            const errorData = await blobResponse.json().catch(() => ({}))
            throw new Error(`Failed to create blob for ${file.path}: ${errorData.message || blobResponse.status}`)
          }

          const blobData = await blobResponse.json()
          if (!blobData.sha) {
            throw new Error(`Invalid blob response for ${file.path}`)
          }

          treeItems.push({
            path: file.path,
            mode: "100644",
            type: "blob",
            sha: blobData.sha,
          })
        } catch (error) {
          console.error(`Error creating blob for ${file.path}:`, error)
          throw error
        }
      }
    }

    if (treeItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid files provided for commit",
        },
        { status: 400 },
      )
    }

    // Create a new tree
    const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        base_tree: currentTreeSha,
        tree: treeItems,
      }),
    })

    if (!treeResponse.ok) {
      const errorData = await treeResponse.json().catch(() => ({}))
      throw new Error(`Failed to create tree: ${errorData.message || treeResponse.status}`)
    }

    const treeData = await treeResponse.json()
    if (!treeData.sha) {
      throw new Error("Invalid tree response")
    }

    // Create a new commit
    const newCommitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message,
        tree: treeData.sha,
        parents: [currentCommitSha],
      }),
    })

    if (!newCommitResponse.ok) {
      const errorData = await newCommitResponse.json().catch(() => ({}))
      throw new Error(`Failed to create commit: ${errorData.message || newCommitResponse.status}`)
    }

    const newCommitData = await newCommitResponse.json()
    if (!newCommitData.sha) {
      throw new Error("Invalid commit response")
    }

    // Update or create the branch reference with retry logic for fast-forward issues
    let updateSuccess = false
    let retryCount = 0
    const maxRetries = 3

    while (!updateSuccess && retryCount < maxRetries) {
      try {
        // Check if branch exists
        const currentRefResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
          { headers },
        )

        if (currentRefResponse.ok) {
          // Branch exists, update it
          const updateRefResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
            {
              method: "PATCH",
              headers,
              body: JSON.stringify({
                sha: newCommitData.sha,
                force: false,
              }),
            },
          )

          if (updateRefResponse.ok) {
            updateSuccess = true
          } else {
            const errorData = await updateRefResponse.json().catch(() => ({}))

            if (errorData.message && errorData.message.includes("fast forward")) {
              retryCount++
              if (retryCount >= maxRetries) {
                throw new Error(`Failed to update branch after ${maxRetries} retries: ${errorData.message}`)
              }
              // Wait before retrying
              await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount))
              continue
            } else {
              throw new Error(`Failed to update branch reference: ${errorData.message || updateRefResponse.status}`)
            }
          }
        } else if (currentRefResponse.status === 404) {
          // Branch doesn't exist, create it
          const createRefResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              ref: `refs/heads/${branch}`,
              sha: newCommitData.sha,
            }),
          })

          if (createRefResponse.ok) {
            updateSuccess = true
          } else {
            const errorData = await createRefResponse.json().catch(() => ({}))
            throw new Error(`Failed to create branch reference: ${errorData.message || createRefResponse.status}`)
          }
        } else {
          throw new Error(`Failed to check branch reference: ${currentRefResponse.status}`)
        }
      } catch (error) {
        retryCount++
        if (retryCount >= maxRetries) {
          throw error
        }
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount))
      }
    }

    if (!updateSuccess) {
      throw new Error("Failed to update branch reference after multiple retries")
    }

    return NextResponse.json({
      success: true,
      sha: newCommitData.sha,
      message: `Commit created successfully${retryCount > 0 ? ` (after ${retryCount} retries)` : ""}`,
      url: `https://github.com/${owner}/${repo}/commit/${newCommitData.sha}`,
    })
  } catch (error) {
    console.error("Create commit error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
