"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Bug, Zap, Shield, Plus, ArrowUp, GitCommit, Loader2, FileCode, User, Mail, Calendar, Hash } from "lucide-react"
import { useI18n } from "@/lib/i18n"

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

export default function ChangelogPage() {
  const { t } = useI18n()
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [repository, setRepository] = useState<string>("")

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        // Try to get repository from environment or use query parameter
        const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "anbuinfosec/anbuai"
        const response = await fetch(`/api/changelog?repo=${encodeURIComponent(repo)}`)
        if (response.ok) {
          const data = await response.json()
          setChangelog(data.changelog)
          setRepository(data.repository || repo)
        } else {
          const errorData = await response.json()
          setError(errorData.message || "Failed to load changelog")
        }
      } catch (err) {
        setError("Failed to fetch changelog")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchChangelog()
  }, [])

  const getCommitType = (message: string): { type: string; icon: any; color: string } => {
    const lower = message.toLowerCase()
    if (lower.includes("feat") || lower.includes("add") || lower.includes("new")) {
      return { type: "Feature", icon: Plus, color: "text-green-500" }
    }
    if (lower.includes("fix") || lower.includes("bug")) {
      return { type: "Fix", icon: Bug, color: "text-red-500" }
    }
    if (lower.includes("improve") || lower.includes("enhance") || lower.includes("update")) {
      return { type: "Improvement", icon: ArrowUp, color: "text-blue-500" }
    }
    if (lower.includes("refactor") || lower.includes("clean")) {
      return { type: "Refactor", icon: Zap, color: "text-yellow-500" }
    }
    if (lower.includes("security") || lower.includes("secure")) {
      return { type: "Security", icon: Shield, color: "text-purple-500" }
    }
    return { type: "Change", icon: GitCommit, color: "text-gray-500" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading changelog...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 md:py-12 max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              GitHub Repository
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Changelog</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {repository ? (
                <>
                  Commits from{" "}
                  <a 
                    href={`https://github.com/${repository}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono"
                  >
                    {repository}
                  </a>
                </>
              ) : (
                "Auto-generated from GitHub commits"
              )}
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            {changelog.map((entry, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border-2 border-primary">
                      <GitCommit className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {entry.commits.length} commit{entry.commits.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {entry.commits.map((commit, commitIndex) => {
                      const commitType = getCommitType(commit.message)
                      const Icon = commitType.icon

                      return (
                        <div
                          key={commitIndex}
                          className="flex flex-col gap-3 p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors group"
                        >
                          <div className="flex gap-4">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary ${commitType.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                  {commit.message}
                                </h3>
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {commitType.type}
                                </Badge>
                              </div>
                              
                              {/* Commit body if exists */}
                              {commit.body && (
                                <p className="text-xs text-muted-foreground mb-3 whitespace-pre-wrap">
                                  {commit.body}
                                </p>
                              )}
                              
                              {/* Commit metadata */}
                              <div className="flex flex-wrap gap-3 text-xs mb-3">
                                <div className="flex items-center gap-1">
                                  <Hash className="h-3 w-3 text-muted-foreground" />
                                  <span className="font-mono bg-secondary px-2 py-0.5 rounded">
                                    {commit.hash.substring(0, 7)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  <span>{commit.author}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{commit.authorEmail}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(commit.date).toLocaleString()}</span>
                                </div>
                              </div>
                              
                              {/* File changes stats */}
                              <div className="flex flex-wrap gap-3 mb-3">
                                <Badge variant="outline" className="text-xs">
                                  <FileCode className="h-3 w-3 mr-1" />
                                  {commit.filesChanged} file{commit.filesChanged !== 1 ? "s" : ""}
                                </Badge>
                                {commit.additions > 0 && (
                                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                                    +{commit.additions}
                                  </Badge>
                                )}
                                {commit.deletions > 0 && (
                                  <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-500/20">
                                    -{commit.deletions}
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Files changed list */}
                              {commit.files.length > 0 && (
                                <details className="group/files">
                                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                                    View changed files ({commit.files.length})
                                  </summary>
                                  <div className="mt-2 space-y-1 pl-4 border-l-2 border-border">
                                    {commit.files.map((file, fileIndex) => (
                                      <div key={fileIndex} className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
                                        {file}
                                      </div>
                                    ))}
                                  </div>
                                </details>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {changelog.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <GitCommit className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Commits Found</h3>
                <p className="text-sm text-muted-foreground">
                  Initialize a git repository to see commit history
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
