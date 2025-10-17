"use client"

import type React from "react"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

type Experience = {
  company: string
  role: string
  start: string
  end: string
  bullets: string[]
}

type Education = {
  school: string
  degree: string
  start: string
  end: string
}

type ResumeData = {
  personal: {
    fullName: string
    title: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experience: Experience[]
  education: Education[]
  skills: string[]
  languages: string[]
  certificates: string[]
}

const initialData: ResumeData = {
  personal: {
    fullName: "Jordan Lee",
    title: "Product Designer",
    email: "jordan@example.com",
    phone: "+1 555 0123",
    location: "San Francisco, CA",
    summary:
      "Human-centered designer with 6+ years crafting clear, accessible interfaces across web and mobile. I translate research into product strategy and deliver pragmatic, system‑minded solutions.",
  },
  experience: [
    {
      company: "Acme Corp",
      role: "Senior Product Designer",
      start: "2022",
      end: "Present",
      bullets: [
        "Led redesign of checkout, improving conversion by 12%",
        "Built design tokens and components enabling faster iteration",
      ],
    },
    {
      company: "Northwind",
      role: "Product Designer",
      start: "2019",
      end: "2022",
      bullets: ["Shipped onboarding flows", "Ran usability testing across 3 product areas"],
    },
  ],
  education: [{ school: "State University", degree: "B.S. in HCI", start: "2014", end: "2018" }],
  skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
  languages: ["English", "Spanish"],
  certificates: ["NN/g UX Certification"],
}

function TopBar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-medium">
            Resume Studio
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Untitled Resume</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border px-3 py-1 text-xs">
            ATS Score: <span className="font-medium">—</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back</Link>
          </Button>
          <Button size="sm">Download</Button>
        </div>
      </div>
    </header>
  )
}

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
  const [data, setData] = useState<ResumeData>(initialData)

  const skillsString = useMemo(() => data.skills.join(", "), [data.skills])

  return (
    <div className="min-h-[100svh]">
      <TopBar />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-12">
        {/* Left: Live Preview */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[72px]">
            <ResumePreview data={data} />
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
                          value={data.personal.fullName}
                          onChange={(e) =>
                            setData((d) => ({ ...d, personal: { ...d.personal, fullName: e.target.value } }))
                          }
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm">Title</label>
                        <Input
                          value={data.personal.title}
                          onChange={(e) =>
                            setData((d) => ({ ...d, personal: { ...d.personal, title: e.target.value } }))
                          }
                        />
                      </div>
                      <div className="grid gap-1.5 md:grid-cols-2">
                        <div className="grid gap-1.5">
                          <label className="text-sm">Email</label>
                          <Input
                            value={data.personal.email}
                            onChange={(e) =>
                              setData((d) => ({ ...d, personal: { ...d.personal, email: e.target.value } }))
                            }
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <label className="text-sm">Phone</label>
                          <Input
                            value={data.personal.phone}
                            onChange={(e) =>
                              setData((d) => ({ ...d, personal: { ...d.personal, phone: e.target.value } }))
                            }
                          />
                        </div>
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm">Location</label>
                        <Input
                          value={data.personal.location}
                          onChange={(e) =>
                            setData((d) => ({ ...d, personal: { ...d.personal, location: e.target.value } }))
                          }
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <label className="text-sm">Summary</label>
                        <Textarea
                          value={data.personal.summary}
                          rows={5}
                          onChange={(e) =>
                            setData((d) => ({ ...d, personal: { ...d.personal, summary: e.target.value } }))
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="experience">
                  <AccordionTrigger>Experience</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-6">
                      {data.experience.map((exp, idx) => (
                        <div key={idx} className="rounded-md border p-3">
                          <div className="grid gap-2 md:grid-cols-2">
                            <div className="grid gap-1.5">
                              <label className="text-sm">Role</label>
                              <Input
                                value={exp.role}
                                onChange={(e) => {
                                  const next = [...data.experience]
                                  next[idx] = { ...exp, role: e.target.value }
                                  setData((d) => ({ ...d, experience: next }))
                                }}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <label className="text-sm">Company</label>
                              <Input
                                value={exp.company}
                                onChange={(e) => {
                                  const next = [...data.experience]
                                  next[idx] = { ...exp, company: e.target.value }
                                  setData((d) => ({ ...d, experience: next }))
                                }}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <label className="text-sm">Start</label>
                              <Input
                                value={exp.start}
                                onChange={(e) => {
                                  const next = [...data.experience]
                                  next[idx] = { ...exp, start: e.target.value }
                                  setData((d) => ({ ...d, experience: next }))
                                }}
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <label className="text-sm">End</label>
                              <Input
                                value={exp.end}
                                onChange={(e) => {
                                  const next = [...data.experience]
                                  next[idx] = { ...exp, end: e.target.value }
                                  setData((d) => ({ ...d, experience: next }))
                                }}
                              />
                            </div>
                          </div>
                          <div className="mt-3 grid gap-2">
                            <label className="text-sm">Bullets (one per line)</label>
                            <Textarea
                              rows={4}
                              value={exp.bullets.join("\n")}
                              onChange={(e) => {
                                const next = [...data.experience]
                                next[idx] = { ...exp, bullets: e.target.value.split("\n").filter(Boolean) }
                                setData((d) => ({ ...d, experience: next }))
                              }}
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
                      {data.education.map((ed, idx) => (
                        <div key={idx} className="grid gap-2 md:grid-cols-2">
                          <div className="grid gap-1.5">
                            <label className="text-sm">School</label>
                            <Input
                              value={ed.school}
                              onChange={(e) => {
                                const next = [...data.education]
                                next[idx] = { ...ed, school: e.target.value }
                                setData((d) => ({ ...d, education: next }))
                              }}
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <label className="text-sm">Degree</label>
                            <Input
                              value={ed.degree}
                              onChange={(e) => {
                                const next = [...data.education]
                                next[idx] = { ...ed, degree: e.target.value }
                                setData((d) => ({ ...d, education: next }))
                              }}
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <label className="text-sm">Start</label>
                            <Input
                              value={ed.start}
                              onChange={(e) => {
                                const next = [...data.education]
                                next[idx] = { ...ed, start: e.target.value }
                                setData((d) => ({ ...d, education: next }))
                              }}
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <label className="text-sm">End</label>
                            <Input
                              value={ed.end}
                              onChange={(e) => {
                                const next = [...data.education]
                                next[idx] = { ...ed, end: e.target.value }
                                setData((d) => ({ ...d, education: next }))
                              }}
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
                          setData((d) => ({
                            ...d,
                            skills: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }))
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
                        value={data.languages.join(", ")}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            languages: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }))
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
                        value={data.certificates.join(", ")}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            certificates: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }))
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
                      [data.personal.summary, ...data.experience.flatMap((e) => e.bullets)]
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
  )
}
