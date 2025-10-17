import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function TemplateCard({
  title,
  tag,
}: {
  title: string
  tag: string
}) {
  return (
    <Card className="group h-full overflow-hidden border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="aspect-[3/4] w-full rounded-md border bg-muted/40" aria-hidden>
          <img
            src="/resume-template-preview.jpg"
            alt=""
            className="h-full w-full rounded-md object-cover opacity-90 transition group-hover:opacity-100"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{tag}</span>
          <Link href="/preview" className="text-sm underline underline-offset-4">
            Try
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-5">
              <h1 className="text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                Build an ATS‑ready resume with a modern, focused editor
              </h1>
              <p className="text-pretty text-muted-foreground">
                A streamlined resume builder and career workspace for students and professionals. Live preview, clean
                templates, and section‑based editing—all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/preview">Start Building</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#templates">Browse Templates</Link>
                </Button>
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>• Clean, distraction‑free editing</li>
                <li>• ATS‑friendly structure</li>
                <li>• Instant section reordering</li>
                <li>• Export to PDF soon</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <img src="/resume-live-preview-mock.jpg" alt="Resume preview mockup" className="w-full rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <header className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-balance text-2xl font-semibold">ATS‑Friendly Templates</h2>
              <p className="text-muted-foreground">Pick a starting point. Customize everything.</p>
            </div>
            <Button asChild size="sm">
              <Link href="/preview">Open Editor</Link>
            </Button>
          </header>

          <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}>
            <TemplateCard title="Minimal Focus" tag="Minimal" />
            <TemplateCard title="Clean Type" tag="Modern" />
            <TemplateCard title="Compact Grid" tag="Compact" />
            <TemplateCard title="Serif Edge" tag="Elegant" />
            <TemplateCard title="Bold Bar" tag="Statement" />
            <TemplateCard title="Classic Lines" tag="Timeless" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="rounded-xl border bg-card px-6 py-10 text-center">
            <h3 className="text-pretty text-2xl font-semibold">Ready to craft your next step?</h3>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-muted-foreground">
              Start with your details, iterate quickly, and keep everything consistent with a live preview editor.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/preview">Create Your Resume</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
