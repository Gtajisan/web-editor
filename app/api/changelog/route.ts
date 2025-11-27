import { NextResponse } from "next/server"

interface GitCommit {
  hash: string
  date: string
  author: string
  authorEmail: string
  message: string
  body: string
  files: string[]
  additions: number
  deletions: number
  filesChanged: number
}

interface ChangelogEntry {
  date: string
  commits: GitCommit[]
}

interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  author: {
    login: string
    avatar_url: string
  } | null
  stats?: {
    additions: number
    deletions: number
    total: number
  }
  files?: Array<{
    filename: string
    status: string
    additions: number
    deletions: number
    changes: number
  }>
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const repo = searchParams.get("repo") || process.env.GITHUB_REPO
    const token = process.env.GITHUB_TOKEN

    if (!repo) {
      return NextResponse.json({
        error: "Repository not specified",
        message: "Please provide repo parameter (e.g., ?repo=owner/repo) or set GITHUB_REPO environment variable",
        changelog: [],
      }, { status: 400 })
    }

    // Validate repo format
    if (!repo.includes("/")) {
      return NextResponse.json({
        error: "Invalid repository format",
        message: "Repository should be in format: owner/repo",
        changelog: [],
      }, { status: 400 })
    }

    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Anbu-AI-Changelog",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Fetch commits from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=50`,
      { headers, next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({
        error: "Failed to fetch from GitHub",
        message: errorData.message || `GitHub API returned ${response.status}`,
        changelog: [],
        rateLimitRemaining: response.headers.get("x-ratelimit-remaining"),
      }, { status: response.status })
    }

    const commitsData: GitHubCommit[] = await response.json()

    if (!Array.isArray(commitsData) || commitsData.length === 0) {
      return NextResponse.json({
        changelog: [],
        message: "No commits found",
      })
    }

    // Fetch detailed commit data with file changes
    const commits: GitCommit[] = await Promise.all(
      commitsData.map(async (commit) => {
        // Fetch detailed commit to get file changes
        let files: string[] = []
        let additions = 0
        let deletions = 0
        let filesChanged = 0

        try {
          const detailResponse = await fetch(
            `https://api.github.com/repos/${repo}/commits/${commit.sha}`,
            { headers, next: { revalidate: 3600 } } // Cache for 1 hour
          )

          if (detailResponse.ok) {
            const detailData = await detailResponse.json()
            
            if (detailData.files) {
              files = detailData.files.map((f: any) => f.filename)
              filesChanged = detailData.files.length
              additions = detailData.stats?.additions || 0
              deletions = detailData.stats?.deletions || 0
            }
          }
        } catch {
          // Continue without detailed stats if fetch fails
        }

        // Split commit message into subject and body
        const messageParts = commit.commit.message.split("\n\n")
        const message = messageParts[0]
        const body = messageParts.slice(1).join("\n\n").trim()

        return {
          hash: commit.sha,
          date: commit.commit.author.date,
          author: commit.commit.author.name,
          authorEmail: commit.commit.author.email,
          message,
          body,
          files,
          additions,
          deletions,
          filesChanged,
        }
      })
    )

    // Group commits by date
    const groupedByDate: { [key: string]: GitCommit[] } = {}
    
    commits.forEach((commit) => {
      const date = new Date(commit.date).toISOString().split("T")[0]
      if (!groupedByDate[date]) {
        groupedByDate[date] = []
      }
      groupedByDate[date].push(commit)
    })

    // Convert to array and sort by date (newest first)
    const changelog: ChangelogEntry[] = Object.entries(groupedByDate)
      .map(([date, commits]) => ({
        date,
        commits,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({
      changelog,
      totalCommits: commits.length,
      timestamp: new Date().toISOString(),
      repository: repo,
      rateLimitRemaining: response.headers.get("x-ratelimit-remaining"),
    })
  } catch (error) {
    console.error("Changelog error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch changelog",
        message: error instanceof Error ? error.message : "Unknown error",
        changelog: [],
      },
      { status: 500 }
    )
  }
}
