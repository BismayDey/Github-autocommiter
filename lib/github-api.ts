export interface GitHubConfig {
  token: string
  repoUrl: string
  branch: string
}

export interface CommitOptions {
  message: string
  files?: { path: string; content: string }[]
}

export class GitHubAPI {
  private config: GitHubConfig

  constructor(config: GitHubConfig) {
    this.config = config
  }

  private getRepoInfo() {
    const urlParts = this.config.repoUrl.replace("https://github.com/", "").split("/")
    return {
      owner: urlParts[0],
      repo: urlParts[1],
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        Authorization: `token ${this.config.token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `GitHub API error: ${response.status}`)
    }

    return response.json()
  }

  async getBranch() {
    const { owner, repo } = this.getRepoInfo()
    return this.makeRequest(`/repos/${owner}/${repo}/branches/${this.config.branch}`)
  }

  async getLatestCommit() {
    const { owner, repo } = this.getRepoInfo()
    const commits = await this.makeRequest(`/repos/${owner}/${repo}/commits?sha=${this.config.branch}&per_page=1`)
    return commits[0]
  }

  async createCommit(options: CommitOptions) {
    const { owner, repo } = this.getRepoInfo()

    // Get the current branch
    const branch = await this.getBranch()
    const currentCommitSha = branch.commit.sha

    // Get the current tree
    const currentCommit = await this.makeRequest(`/repos/${owner}/${repo}/git/commits/${currentCommitSha}`)
    const currentTreeSha = currentCommit.tree.sha

    let newTreeSha = currentTreeSha

    // If files are provided, create a new tree
    if (options.files && options.files.length > 0) {
      // Create blobs for each file
      const tree = []
      for (const file of options.files) {
        const blob = await this.makeRequest(`/repos/${owner}/${repo}/git/blobs`, {
          method: "POST",
          body: JSON.stringify({
            content: file.content,
            encoding: "utf-8",
          }),
        })

        tree.push({
          path: file.path,
          mode: "100644",
          type: "blob",
          sha: blob.sha,
        })
      }

      // Create new tree
      const newTree = await this.makeRequest(`/repos/${owner}/${repo}/git/trees`, {
        method: "POST",
        body: JSON.stringify({
          base_tree: currentTreeSha,
          tree,
        }),
      })

      newTreeSha = newTree.sha
    }

    // Create the commit
    const commit = await this.makeRequest(`/repos/${owner}/${repo}/git/commits`, {
      method: "POST",
      body: JSON.stringify({
        message: options.message,
        tree: newTreeSha,
        parents: [currentCommitSha],
      }),
    })

    // Update the branch reference
    await this.makeRequest(`/repos/${owner}/${repo}/git/refs/heads/${this.config.branch}`, {
      method: "PATCH",
      body: JSON.stringify({
        sha: commit.sha,
      }),
    })

    return commit
  }

  async hasNewCommits(lastKnownSha?: string) {
    const latestCommit = await this.getLatestCommit()
    return {
      hasNew: lastKnownSha !== latestCommit.sha,
      latestCommit,
    }
  }
}
