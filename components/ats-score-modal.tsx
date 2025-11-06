"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ResumeData } from "@/lib/store/resume-store"

type ATSAnalysis = {
  score: number
  summary: string
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  keywordMatch: {
    matched: string[]
    missing: string[]
  }
}

type ATSScoreModalProps = {
  resumeData: ResumeData
  trigger?: React.ReactNode
  onImproveResume?: (improvedData: ResumeData) => void
}

export function ATSScoreModal({ resumeData, trigger, onImproveResume }: ATSScoreModalProps) {
  const [open, setOpen] = useState(false)
  const [inputMode, setInputMode] = useState<"url" | "description">("url")
  const [jobUrl, setJobUrl] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null)
  const [isImproving, setIsImproving] = useState(false)
  const [improveSuccess, setImproveSuccess] = useState(false)

  const handleAnalyze = async () => {
    setError(null)
    setIsAnalyzing(true)
    setAnalysis(null)

    try {
      const response = await fetch("/api/calculate-ats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          jobUrl: inputMode === "url" ? jobUrl : undefined,
          jobDescription: inputMode === "description" ? jobDescription : undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze resume")
      }

      setAnalysis(result.analysis)
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setAnalysis(null)
    setError(null)
    setJobUrl("")
    setJobDescription("")
    setImproveSuccess(false)
  }

  const handleImproveResume = async () => {
    setIsImproving(true)
    setError(null)
    setImproveSuccess(false)

    try {
      const response = await fetch("/api/improve-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          jobUrl: inputMode === "url" ? jobUrl : undefined,
          jobDescription: inputMode === "description" ? jobDescription : undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to improve resume")
      }

      // Call the parent callback with improved data
      if (onImproveResume && result.data) {
        onImproveResume(result.data)
        setImproveSuccess(true)
        
        // Show success message for 2 seconds then close
        setTimeout(() => {
          setOpen(false)
          handleReset()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to improve resume")
    } finally {
      setIsImproving(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30"
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30"
    return "bg-red-100 dark:bg-red-900/30"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Calculate ATS Score
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto min-w-[800px]">
        <DialogHeader>
          <DialogTitle>ATS Score Calculator</DialogTitle>
          <DialogDescription>
            Analyze your resume against a job posting to get an ATS compatibility score
          </DialogDescription>
        </DialogHeader>

        {!analysis ? (
          <div className="grid gap-4 py-4">
            {/* Input Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={inputMode === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("url")}
                className="flex-1"
              >
                Job URL
              </Button>
              <Button
                variant={inputMode === "description" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("description")}
                className="flex-1"
              >
                Job Description
              </Button>
            </div>

            {/* Input Fields */}
            {inputMode === "url" ? (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Job Posting URL</label>
                <Input
                  type="url"
                  placeholder="https://example.com/job-posting"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the URL of the job posting you want to analyze against
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Paste the full job description including requirements and qualifications
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={
                isAnalyzing ||
                (inputMode === "url" && !jobUrl) ||
                (inputMode === "description" && !jobDescription)
              }
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 size-4 animate-spin"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            {/* Score Display */}
            <div className="flex items-center justify-center">
              <div
                className={`flex size-32 items-center justify-center rounded-full ${getScoreBackground(
                  analysis.score
                )}`}
              >
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}
                  </div>
                  <div className="text-xs text-muted-foreground">ATS Score</div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid gap-2">
              <h3 className="text-sm font-semibold">Summary</h3>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="grid gap-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 text-green-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Strengths
                </h3>
                <ul className="grid gap-1.5 text-sm">
                  {analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaps */}
            {analysis.gaps.length > 0 && (
              <div className="grid gap-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 text-yellow-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  Gaps to Address
                </h3>
                <ul className="grid gap-1.5 text-sm">
                  {analysis.gaps.map((gap, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="grid gap-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 text-blue-600"
                  >
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                  Recommendations
                </h3>
                <ul className="grid gap-1.5 text-sm">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keyword Match */}
            {(analysis.keywordMatch.matched.length > 0 ||
              analysis.keywordMatch.missing.length > 0) && (
              <div className="grid gap-3">
                <h3 className="text-sm font-semibold">Keyword Analysis</h3>
                {analysis.keywordMatch.matched.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-green-600">Matched Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.keywordMatch.matched.map((keyword, i) => (
                        <span
                          key={i}
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.keywordMatch.missing.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-red-600">Missing Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.keywordMatch.missing.map((keyword, i) => (
                        <span
                          key={i}
                          className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Success Message */}
            {improveSuccess && (
              <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3">
                <p className="text-sm text-green-700 dark:text-green-400">
                  ✓ Resume optimized successfully! Your data has been updated.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid gap-2">
              {onImproveResume && !improveSuccess && (
                <Button
                  onClick={handleImproveResume}
                  disabled={isImproving}
                  className="w-full"
                >
                  {isImproving ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 size-4 animate-spin"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Optimizing Resume...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 size-4"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      Improve Resume for This Job
                    </>
                  )}
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" className="w-full">
                Analyze Another Job
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

