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
  return <h3 className="text-sm font-medium tracking-wide text-muted-foreground">{children}</h3>
}

function ResumePreview({ data }: { data: ResumeData }) {
  // Simple, distinct visual style from Wozber while keeping clear structure
  return (
    <div id="resume-preview" className="rounded-lg border bg-card p-6">
      <div className="grid grid-cols-[6px_1fr] gap-4">
        <div className="rounded-sm bg-primary" aria-hidden />
        <div>
          <h1 className="text-2xl font-semibold leading-tight">{data.personal.fullName}</h1>
          <p className="text-sm text-muted-foreground">{data.personal.title}</p>
          
          {/* Contact Details */}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {data.personal.email && (
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3.5"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>{data.personal.email}</span>
              </div>
            )}
            {data.personal.phone && (
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3.5"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{data.personal.phone}</span>
              </div>
            )}
            {data.personal.location && (
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3.5"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{data.personal.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="grid gap-6">
        <section>
          <SectionLabel>Summary</SectionLabel>
          <p className="mt-2 text-sm leading-relaxed">{data.personal.summary}</p>
        </section>

        <section>
          <SectionLabel>Experience</SectionLabel>
          <div className="mt-2 grid gap-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">
                    {exp.role} · {exp.company}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {exp.start} – {exp.end}
                  </p>
                </div>
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Education</SectionLabel>
          <ul className="mt-2 grid gap-2 text-sm">
            {data.education.map((ed, i) => (
              <li key={i} className="flex items-baseline justify-between gap-2">
                <span className="font-medium">
                  {ed.degree}, {ed.school}
                </span>
                <span className="text-xs text-muted-foreground">
                  {ed.start} – {ed.end}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-2">
          <SectionLabel>Skills</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, i) => (
              <span key={i} className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                {s}
              </span>
            ))}
          </div>
        </section>

        {data.languages.length > 0 && (
          <section className="grid gap-2">
            <SectionLabel>Languages</SectionLabel>
            <p className="text-sm">{data.languages.join(", ")}</p>
          </section>
        )}

        {data.certificates.length > 0 && (
          <section className="grid gap-2">
            <SectionLabel>Certificates</SectionLabel>
            <ul className="list-disc pl-5 text-sm">
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
        <CardTitle className="text-base">Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm text-muted-foreground">
        <p>Keep section titles simple: Experience, Education, Skills.</p>
        <p>Use action verbs and quantify outcomes where possible.</p>
        <p>Prioritize readability with concise bullet points.</p>
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

  // Zustand selectors - efficient and split by section
  const personal = usePersonalInfo()
  const experience = useExperience()
  const education = useEducation()
  const skills = useSkills()
  const languages = useLanguages()
  const certificates = useCertificates()

  // Actions
  const { setPersonalField } = usePersonalActions()
  const { updateExperience } = useExperienceActions()
  const { updateEducation } = useEducationActions()
  const { setSkills: updateSkills } = useSkillsActions()
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

  const skillsString = useMemo(() => skills.join(", "), [skills])
  
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
      await generateOptimizedResumePDF('resume-preview-modal', fileName)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
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
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Top actions bar */}
        <div className="mb-6 flex items-center justify-end gap-2">
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
                ATS Score
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
                Download PDF
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Live Preview */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[72px]">
            <ResumePreview data={resumeData} />
          </div>
        </aside>

        {/* Center: Editor */}
        <section className="lg:col-span-5">
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
                  <AccordionTrigger>Experience</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-6">
                      {experience.map((exp, idx) => (
                        <div key={idx} className="rounded-md border p-3">
                          <div className="grid gap-2 md:grid-cols-2">
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
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="education">
                  <AccordionTrigger>Education</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      {education.map((ed, idx) => (
                        <div key={idx} className="grid gap-2 md:grid-cols-2">
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
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="skills">
                  <AccordionTrigger>Skills</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-1.5">
                      <label className="text-sm">Comma‑separated</label>
                      <Input
                        value={skillsString}
                        onChange={(e) =>
                          updateSkills(
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
        <aside className="lg:col-span-3">
          <div className="grid gap-4">
            {/* CV Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Elevate Your Old Resume with AI</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="grid gap-2">
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".doc,.docx,.txt,.pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("cv-upload")?.click()}
                    className="flex items-center gap-2"
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
                          className="size-4 animate-spin"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        <span>Analyzing...</span>
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
                          className="size-4"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Choose File</span>
                      </>
                    )}
                  </Button>
                  {uploadedFile && (
                    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4 text-muted-foreground"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span className="flex-1 truncate text-xs">{uploadedFile.name}</span>
                      <button
                        onClick={() => {
                          setUploadedFile(null)
                          setCvSummary(null)
                          setUploadError(null)
                          // Reset the file input
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
                    <p className="text-xs text-destructive">{uploadError}</p>
                  )}
                  {cvSummary && !uploadError && (
                    <div className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-2">
                      <p className="text-xs leading-relaxed text-green-700 dark:text-green-400">{cvSummary}</p>
                    </div>
                  )}
                  {!uploadError && !uploadedFile && !isAnalyzing && (
                    <p className="text-xs text-muted-foreground">
                      Supports .doc, .docx, .txt, .pdf files (max 10MB)
                    </p>
                  )}
                </div>
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
        <div id="resume-preview-modal" className="rounded-lg bg-white p-6">
          <div className="grid grid-cols-[6px_1fr] gap-4">
            <div className="rounded-sm bg-primary" aria-hidden />
            <div>
              <h1 className="text-2xl font-semibold leading-tight">{resumeData.personal.fullName}</h1>
              <p className="text-sm text-muted-foreground">{resumeData.personal.title}</p>
              
              {/* Contact Details */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {resumeData.personal.email && (
                  <div className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3.5"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>{resumeData.personal.email}</span>
                  </div>
                )}
                {resumeData.personal.phone && (
                  <div className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3.5"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>{resumeData.personal.phone}</span>
                  </div>
                )}
                {resumeData.personal.location && (
                  <div className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3.5"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{resumeData.personal.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-6">
            <section>
              <SectionLabel>Summary</SectionLabel>
              <p className="mt-2 text-sm leading-relaxed">{resumeData.personal.summary}</p>
            </section>

            <section>
              <SectionLabel>Experience</SectionLabel>
              <div className="mt-2 grid gap-4">
                {resumeData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium">
                        {exp.role} · {exp.company}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {exp.start} – {exp.end}
                      </p>
                    </div>
                    <ul className="mt-1 list-disc pl-5 text-sm">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>Education</SectionLabel>
              <ul className="mt-2 grid gap-2 text-sm">
                {resumeData.education.map((ed, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-2">
                    <span className="font-medium">
                      {ed.degree}, {ed.school}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {ed.start} – {ed.end}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid gap-2">
              <SectionLabel>Skills</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.skills.map((s, i) => (
                  <span key={i} className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </section>

            {resumeData.languages.length > 0 && (
              <section className="grid gap-2">
                <SectionLabel>Languages</SectionLabel>
                <p className="text-sm">{resumeData.languages.join(", ")}</p>
              </section>
            )}

            {resumeData.certificates.length > 0 && (
              <section className="grid gap-2">
                <SectionLabel>Certificates</SectionLabel>
                <ul className="list-disc pl-5 text-sm">
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
