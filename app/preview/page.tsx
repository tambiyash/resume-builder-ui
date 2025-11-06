"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import {
  usePersonalInfo,
  useExperience,
  useEducation,
  useSkills,
  useLanguages,
  useCertificates,
  usePersonalActions,
  useExperienceActions,
  useEducationActions,
  useSkillsActions,
  useLanguagesActions,
  useCertificatesActions,
  useImportActions,
  type ResumeData,
} from "@/lib/store/resume-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { ATSScoreModal } from "@/components/ats-score-modal"
import { ResumePreviewModal } from "@/components/resume-preview-modal"
import { generateOptimizedResumePDF } from "@/lib/pdf-generator"


function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold uppercase tracking-wide text-foreground border-b border-foreground pb-1">{children}</h3>
}

function ResumePreview({ data }: { data: ResumeData }) {
  // Readable preview layout - PDF will use compact ATS-optimized formatting
  return (
    <div id="resume-preview" className="rounded-lg border bg-white p-6 text-black">
      {/* Header - Centered */}
      <div className="text-center border-b-2 border-black pb-4 mb-5">
        <h1 className="text-3xl font-bold leading-tight uppercase tracking-wide">{data.personal.fullName}</h1>
        <p className="text-lg font-medium mt-2 mb-3">{data.personal.title}</p>
        
        {/* Contact Details - Horizontal layout */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
          {data.personal.email && (
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{data.personal.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content sections */}
      <div className="grid gap-5">
        {/* Summary */}
        {data.personal.summary && (
          <section>
            <SectionLabel>Professional Summary</SectionLabel>
            <p className="mt-2 text-sm leading-relaxed">{data.personal.summary}</p>
          </section>
        )}

        {/* Experience */}
        <section>
          <SectionLabel>Work Experience</SectionLabel>
          <div className="mt-3 grid gap-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-base font-bold leading-tight">{exp.company}</p>
                    <p className="text-sm font-medium italic mt-0.5">{exp.role}</p>
                  </div>
                  <p className="text-xs font-medium whitespace-nowrap text-muted-foreground">
                    {exp.start} – {exp.end}
                  </p>
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed space-y-1">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <SectionLabel>Education</SectionLabel>
          <div className="mt-3 grid gap-3">
            {data.education.map((ed, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-base font-bold leading-tight">{ed.school}</p>
                  <p className="text-sm mt-0.5">{ed.degree}</p>
                </div>
                <p className="text-xs font-medium whitespace-nowrap text-muted-foreground">
                  {ed.start} – {ed.end}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        {data.skills.filter(cat => cat.skills.length > 0).length > 0 && (
          <section>
            <SectionLabel>Skills</SectionLabel>
            <div className="mt-2 space-y-1">
              {data.skills
                .filter(cat => cat.skills.length > 0)
                .map((category, i) => (
                  <p key={i} className="text-sm leading-relaxed">
                    <span className="font-bold">{category.name}:</span> {category.skills.join(", ")}
                  </p>
                ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section>
            <SectionLabel>Languages</SectionLabel>
            <p className="mt-2 text-sm leading-relaxed">{data.languages.join(" • ")}</p>
          </section>
        )}

        {/* Certificates/Achievements */}
        {data.certificates.length > 0 && (
          <section>
            <SectionLabel>Achievement</SectionLabel>
            <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed space-y-1">
              {data.certificates.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

function SidebarTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ATS Optimization Tips</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground">
        <p><strong>Action Verbs:</strong> Start every bullet with Led, Developed, Managed, Optimized, etc.</p>
        <p><strong>Quantify Results:</strong> Include numbers and metrics (e.g., "increased by 25%").</p>
        <p><strong>Concise Summary:</strong> Keep it 25-30 words, 2 sentences, based on your current role.</p>
        <p><strong>One Page:</strong> Aim to fit all content on a single page for maximum impact.</p>
      </CardContent>
    </Card>
  )
}

export default function PreviewPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [cvSummary, setCvSummary] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [improveInstructions, setImproveInstructions] = useState('')
  const [isImproving, setIsImproving] = useState(false)
  const [improveError, setImproveError] = useState<string | null>(null)
  const [improveSuccess, setImproveSuccess] = useState<string | null>(null)

  // Zustand selectors - efficient and split by section
  const personal = usePersonalInfo()
  const experience = useExperience()
  const education = useEducation()
  const skills = useSkills()
  const languages = useLanguages()
  const certificates = useCertificates()

  // Actions
  const { setPersonalField } = usePersonalActions()
  const { updateExperience, addExperience, removeExperience } = useExperienceActions()
  const { updateEducation, addEducation, removeEducation } = useEducationActions()
  const { updateSkillCategory, addSkillCategory, removeSkillCategory } = useSkillsActions()
  const { setLanguages: updateLanguages } = useLanguagesActions()
  const { setCertificates: updateCertificates } = useCertificatesActions()
  const { importResumeData } = useImportActions()

  const maybeUseSession = authClient?.useSession?.()

  // Auth protection - TEMPORARILY DISABLED FOR DB ISSUES
  useEffect(() => {
    // Bypass auth check - allow all users to access without authentication
    setIsLoading(false)
    
    /* COMMENTED OUT - ORIGINAL AUTH CHECK
    if (maybeUseSession) {
      if (!maybeUseSession?.data?.user) {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }
    */
  }, [maybeUseSession, router])

  // If redirected back from LinkedIn, accept imported data from query param.
  useEffect(() => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    const encoded = url.searchParams.get("import")
    if (encoded) {
      try {
        const parsed = JSON.parse(atob(encoded.replaceAll("-", "+").replaceAll("_", "/"))) as Partial<ResumeData>
        importResumeData(parsed)
        url.searchParams.delete("import")
        window.history.replaceState({}, "", url.toString())
      } catch {
        // ignore malformed payloads
      }
    }
  }, [importResumeData])

  // No longer needed - skills are now categorized
  
  // Aggregate data for preview component
  const resumeData: ResumeData = useMemo(
    () => ({
      personal,
      experience,
      education,
      skills,
      languages,
      certificates,
    }),
    [personal, experience, education, skills, languages, certificates]
  )

  // Handle opening preview modal
  const handleDownloadClick = () => {
    setShowPreviewModal(true)
  }

  // Handle actual PDF download after preview
  const handleConfirmDownload = async () => {
    setIsDownloading(true)
    try {
      const fileName = `${personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      await generateOptimizedResumePDF(resumeData, fileName)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  // Handle improve resume
  const handleImproveResume = async () => {
    if (!improveInstructions.trim()) {
      setImproveError('Please enter your improvement instructions')
      return
    }

    setImproveError(null)
    setImproveSuccess(null)
    setIsImproving(true)

    try {
      const response = await fetch('/api/improve-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          instructions: improveInstructions,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to improve resume')
      }

      // Import the improved data into Zustand store
      if (result.data) {
        importResumeData(result.data)
        setImproveSuccess('Resume improved successfully!')
        setImproveInstructions('')
      }
    } catch (err: any) {
      setImproveError(err.message || 'Failed to improve resume')
    } finally {
      setIsImproving(false)
    }
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setCvSummary(null)

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setUploadError("File size must be less than 10MB")
      return
    }

    // Validate file type
    const validTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/pdf'
    ]
    if (!validTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload .doc, .docx, .txt, or .pdf")
      return
    }

    setUploadedFile(file)
    setIsAnalyzing(true)

    // Send file to API for parsing
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse CV')
      }

      // Import the parsed data into Zustand store
      if (result.data) {
        importResumeData(result.data)
        setCvSummary('CV data successfully imported! Your resume has been updated.')
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse CV')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[100svh]">
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Top actions bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {/* CV Upload Section */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="cv-upload"
              accept=".doc,.docx,.txt,.pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("cv-upload")?.click()}
              disabled={isAnalyzing}
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
                  Analyzing CV...
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload Resume
                </>
              )}
            </Button>
            {uploadedFile && (
              <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3.5 text-muted-foreground"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-xs max-w-[200px] truncate">{uploadedFile.name}</span>
                <button
                  onClick={() => {
                    setUploadedFile(null)
                    setCvSummary(null)
                    setUploadError(null)
                    const fileInput = document.getElementById('cv-upload') as HTMLInputElement
                    if (fileInput) fileInput.value = ''
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
            {uploadError && (
              <span className="text-xs text-destructive">{uploadError}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <ATSScoreModal 
              resumeData={resumeData}
              onImproveResume={importResumeData}
              trigger={
                <Button variant="outline" size="sm">
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  Review ATS Score
                </Button>
              }
            />
            <Button size="sm" onClick={handleDownloadClick} disabled={isDownloading}>
              {isDownloading ? (
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
                  Downloading...
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Preview & Download
                </>
              )}
            </Button>
          </div>
        </div>

        {/* CV Upload Success/Error Messages */}
        {(cvSummary || uploadError) && (
          <div className="mb-4">
            {cvSummary && !uploadError && (
              <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3">
                <p className="text-sm leading-relaxed text-green-700 dark:text-green-400">{cvSummary}</p>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Live Preview */}
        <aside className="lg:col-span-4 xl:col-span-4">
          <div className="lg:sticky lg:top-[72px]">
            <ResumePreview data={resumeData} />
          </div>
        </aside>

        {/* Center: Editor */}
        <section className="lg:col-span-5 xl:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="personal">
                  <AccordionTrigger>Personal Details</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-3">
                      <div className="grid gap-1.5">
                        <label className="text-sm">Full name</label>
                        <Input
                          value={personal.fullName}
                          onChange={(e) => setPersonalField("fullName", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm">Title</label>
                        <Input
                          value={personal.title}
                          onChange={(e) => setPersonalField("title", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5 md:grid-cols-2">
                        <div className="grid gap-1.5">
                          <label className="text-sm">Email</label>
                          <Input
                            value={personal.email}
                            onChange={(e) => setPersonalField("email", e.target.value)}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-sm">Phone</label>
                          <Input
                            value={personal.phone}
                            onChange={(e) => setPersonalField("phone", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm">Location</label>
                        <Input
                          value={personal.location}
                          onChange={(e) => setPersonalField("location", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm">Summary</label>
                        <Textarea
                          value={personal.summary}
                          rows={5}
                          onChange={(e) => setPersonalField("summary", e.target.value)}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="experience">
                  <AccordionTrigger>Experience ({experience.length})</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-6">
                      {experience.map((exp, idx) => (
                        <div key={idx} className="rounded-md border p-3 relative">
                          {/* Action buttons */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                addExperience({
                                  company: exp.company,
                                  role: exp.role,
                                  start: exp.start,
                                  end: exp.end,
                                  bullets: [...exp.bullets]
                                })
                              }}
                              title="Duplicate"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                            </Button>
                            {experience.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this experience?')) {
                                    removeExperience(idx)
                                  }
                                }}
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-2 md:grid-cols-2 pr-16">
                            <div className="grid gap-1.5">
                              <label className="text-sm">Role</label>
                              <Input
                                value={exp.role}
                                onChange={(e) => updateExperience(idx, { role: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <label className="text-sm">Company</label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(idx, { company: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <label className="text-sm">Start</label>
                              <Input
                                value={exp.start}
                                onChange={(e) => updateExperience(idx, { start: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <label className="text-sm">End</label>
                              <Input
                                value={exp.end}
                                onChange={(e) => updateExperience(idx, { end: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="mt-3 grid gap-2">
                            <label className="text-sm">Bullets (one per line)</label>
                            <Textarea
                              rows={4}
                              value={exp.bullets.join("\n")}
                              onChange={(e) => updateExperience(idx, { bullets: e.target.value.split("\n").filter(Boolean) })}
                            />
                          </div>
                        </div>
                      ))}
                      
                      {/* Add new experience button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          addExperience({
                            company: "",
                            role: "",
                            start: "",
                            end: "Present",
                            bullets: [""]
                          })
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 size-4">
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                        Add Experience
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="education">
                  <AccordionTrigger>Education ({education.length})</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      {education.map((ed, idx) => (
                        <div key={idx} className="rounded-md border p-3 relative">
                          {/* Action buttons */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                addEducation({
                                  school: ed.school,
                                  degree: ed.degree,
                                  start: ed.start,
                                  end: ed.end
                                })
                              }}
                              title="Duplicate"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                            </Button>
                            {education.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this education entry?')) {
                                    removeEducation(idx)
                                  }
                                }}
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-2 md:grid-cols-2 pr-16">
                            <div className="grid gap-1.5">
                              <label className="text-sm">School</label>
                              <Input
                                value={ed.school}
                                onChange={(e) => updateEducation(idx, { school: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <label className="text-sm">Degree</label>
                              <Input
                                value={ed.degree}
                                onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <label className="text-sm">Start</label>
                              <Input
                                value={ed.start}
                                onChange={(e) => updateEducation(idx, { start: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <label className="text-sm">End</label>
                              <Input
                                value={ed.end}
                                onChange={(e) => updateEducation(idx, { end: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add new education button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          addEducation({
                            school: "",
                            degree: "",
                            start: "",
                            end: ""
                          })
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 size-4">
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                        Add Education
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="skills">
                  <AccordionTrigger>Skills ({skills.filter(cat => cat.skills.length > 0).length})</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-6">
                      {skills.map((category, idx) => (
                        <div key={idx} className="rounded-md border p-3 relative">
                          {/* Action buttons */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                addSkillCategory({
                                  name: category.name,
                                  skills: [...category.skills]
                                })
                              }}
                              title="Duplicate"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                            </Button>
                            {skills.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete the "${category.name}" skill category?`)) {
                                    removeSkillCategory(idx)
                                  }
                                }}
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-3 pr-16">
                            {/* Category Name */}
                            <div className="grid gap-1.5">
                              <label className="text-sm font-medium">Category Name</label>
                              <Input
                                value={category.name}
                                onChange={(e) =>
                                  updateSkillCategory(idx, { name: e.target.value })
                                }
                                placeholder="e.g., Frameworks, Programming Languages, Tools"
                              />
                            </div>

                            {/* Skills */}
                            <div className="grid gap-1.5">
                              <label className="text-sm font-medium">Skills (comma-separated)</label>
                              <Input
                                value={category.skills.join(", ")}
                                onChange={(e) =>
                                  updateSkillCategory(idx, {
                                    skills: e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean)
                                  })
                                }
                                placeholder="e.g., React, Angular, Vue.js"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add new skill category button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          addSkillCategory({
                            name: "",
                            skills: []
                          })
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 size-4">
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                        Add Skill Category
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="languages">
                  <AccordionTrigger>Languages</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-1.5">
                      <label className="text-sm">Comma‑separated</label>
                      <Input
                        value={languages.join(", ")}
                        onChange={(e) =>
                          updateLanguages(
                            e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="certificates">
                  <AccordionTrigger>Certificates</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-1.5">
                      <label className="text-sm">Comma‑separated</label>
                      <Input
                        value={certificates.join(", ")}
                        onChange={(e) =>
                          updateCertificates(
                            e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Right: Tips / Meta */}
        <aside className="lg:col-span-3 xl:col-span-3">
          <div className="grid gap-4">
            {/* AI Improve Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI-Powered Improvements</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid gap-2">
                  <label className="text-sm">What would you like to improve?</label>
                  <Textarea
                    placeholder='Example: Add "Led a team of 5 developers" to my recent experience, and make my summary more impactful'
                    value={improveInstructions}
                    onChange={(e) => setImproveInstructions(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>Tip:</strong> Text in "double quotes" will be added exactly as written. Other text will be enhanced for professional tone.
                  </p>
                </div>
                <Button
                  onClick={handleImproveResume}
                  disabled={isImproving || !improveInstructions.trim()}
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
                      <span>Improving...</span>
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
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      <span>Improve Resume</span>
                    </>
                  )}
                </Button>
                {improveError && (
                  <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2">
                    <p className="text-xs leading-relaxed text-destructive">{improveError}</p>
                  </div>
                )}
                {improveSuccess && (
                  <div className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-2">
                    <p className="text-xs leading-relaxed text-green-700 dark:text-green-400">{improveSuccess}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <SidebarTips />
          </div>
        </aside>
        </div>
      </div>

      {/* Preview Modal */}
      <ResumePreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        resumeData={resumeData}
        onConfirmDownload={handleConfirmDownload}
      >
        <div id="resume-preview-modal" className="bg-white text-black">
          {/* Header - Compact and centered */}
          <div className="text-center border-b-2 border-black pb-2 mb-4">
            <h1 className="text-2xl font-bold leading-tight uppercase tracking-wide">{resumeData.personal.fullName}</h1>
            <p className="text-sm font-medium mt-1 mb-2">{resumeData.personal.title}</p>
            
            {/* Contact Details - Horizontal compact layout */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
              {resumeData.personal.email && (
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>{resumeData.personal.email}</span>
                </div>
              )}
              {resumeData.personal.phone && (
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{resumeData.personal.phone}</span>
                </div>
              )}
              {resumeData.personal.location && (
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{resumeData.personal.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content - Compact sections */}
          <div className="grid gap-4">
            {/* Summary */}
            {resumeData.personal.summary && (
              <section>
                <SectionLabel>Professional Summary</SectionLabel>
                <p className="mt-1.5 text-xs leading-snug">{resumeData.personal.summary}</p>
              </section>
            )}

            {/* Experience */}
            <section>
              <SectionLabel>Work Experience</SectionLabel>
              <div className="mt-2 grid gap-3">
                {resumeData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-bold leading-tight">{exp.company}</p>
                        <p className="text-xs font-medium italic">{exp.role}</p>
                      </div>
                      <p className="text-[11px] font-medium whitespace-nowrap">
                        {exp.start} – {exp.end}
                      </p>
                    </div>
                    <ul className="mt-1.5 list-disc pl-5 text-xs leading-snug space-y-1">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <SectionLabel>Education</SectionLabel>
              <div className="mt-2 grid gap-2">
                {resumeData.education.map((ed, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-bold leading-tight">{ed.school}</p>
                      <p className="text-xs">{ed.degree}</p>
                    </div>
                    <p className="text-[11px] font-medium whitespace-nowrap">
                      {ed.start} – {ed.end}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            {resumeData.skills.filter(cat => cat.skills.length > 0).length > 0 && (
              <section>
                <SectionLabel>Skills</SectionLabel>
                <div className="mt-1.5 space-y-0.5">
                  {resumeData.skills
                    .filter(cat => cat.skills.length > 0)
                    .map((category, i) => (
                      <p key={i} className="text-xs leading-snug">
                        <span className="font-bold">{category.name}:</span> {category.skills.join(", ")}
                      </p>
                    ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {resumeData.languages.length > 0 && (
              <section>
                <SectionLabel>Languages</SectionLabel>
                <p className="mt-1.5 text-xs leading-snug">{resumeData.languages.join(" • ")}</p>
              </section>
            )}

            {/* Certificates/Achievements */}
            {resumeData.certificates.length > 0 && (
              <section>
                <SectionLabel>Achievement</SectionLabel>
                <ul className="mt-1.5 list-disc pl-5 text-xs leading-snug space-y-1">
                  {resumeData.certificates.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </ResumePreviewModal>
    </div>
  )
}
