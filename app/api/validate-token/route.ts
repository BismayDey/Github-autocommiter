import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token is required" })
    }

    // Test the token by making a request to GitHub API
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Auto-Committer/1.0",
      },
    })

    if (response.ok) {
      const userData = await response.json()

      // Also check if the token has the required scopes
      const scopes = response.headers.get("x-oauth-scopes") || ""
      const hasRepoScope = scopes.includes("repo") || scopes.includes("public_repo")

      if (!hasRepoScope) {
        return NextResponse.json({
          valid: false,
          error: "Token does not have required 'repo' permissions. Please create a new token with 'repo' scope.",
        })
      }

      return NextResponse.json({
        valid: true,
        user: userData.login,
        name: userData.name,
        scopes: scopes,
      })
    } else {
      const errorData = await response.json().catch(() => ({}))
      let errorMessage = "Invalid token"

      if (response.status === 401) {
        errorMessage = "Invalid or expired token"
      } else if (response.status === 403) {
        errorMessage = "Token does not have sufficient permissions"
      } else {
        errorMessage = errorData.message || `GitHub API error: ${response.status}`
      }

      return NextResponse.json({
        valid: false,
        error: errorMessage,
      })
    }
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json({
      valid: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    })
  }
}
