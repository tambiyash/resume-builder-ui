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


function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-medium tracking-wide text-muted-foreground">{children}</h3>
}

function ResumePreview({ data }: { data: ResumeData }) {
  // Simple, distinct visual style from Wozber while keeping clear structure
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="grid grid-cols-[6px_1fr] gap-4">
        <div className="rounded-sm bg-primary" aria-hidden />
        <div>
          <h1 className="text-2xl font-semibold leading-tight">{data.personal.fullName}</h1>
          <p className="text-sm text-muted-foreground">{data.personal.title}</p>
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

  // Auth protection
  useEffect(() => {
    if (maybeUseSession) {
      if (!maybeUseSession?.data?.user) {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }
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
          <div className="rounded-full border px-3 py-1 text-xs">
            ATS Score: <span className="font-medium">—</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back</Link>
          </Button>
          <Button size="sm">Download</Button>
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
            <SidebarTips />
            {/* LinkedIn Import */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Import from LinkedIn</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button asChild variant="outline">
                  <Link href="/api/auth/linkedin/start" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="size-4" aria-hidden>
                      <rect fill="#0A66C2" width="72" height="72" rx="8" />
                      <path fill="#fff" d="M16.6 27.3h8.6v27.7h-8.6zM21 17.1c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1a5.1 5.1 0 1 1 0-10.2zM30.6 27.3h8.2v3.8h.1c1.1-2.1 3.9-4.4 8-4.4 8.6 0 10.2 5.6 10.2 12.9v15.4H48.5V41.7c0-3-0.1-6.8-4.2-6.8-4.2 0-4.9 3.2-4.9 6.6v13.4h-8.7V27.3z"/>
                    </svg>
                    <span>Sign in with LinkedIn</span>
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">We’ll import basic profile info only.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Document</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pages</span>
                  <span>1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Words</span>
                  <span>
                    {
                      [personal.summary, ...experience.flatMap((e) => e.bullets)]
                        .join(" ")
                        .split(/\s+/)
                        .filter(Boolean).length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
        </div>
      </div>
    </div>
  )
}
