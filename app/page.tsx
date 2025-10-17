import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function TemplateCard({
  title,
  tag,
  isPremium = false,
}: {
  title: string
  tag: string
  isPremium?: boolean
}) {
  return (
    <Card className={cn(
      "group h-full overflow-hidden border-border/80",
      isPremium && "relative opacity-75"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {isPremium && (
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-3"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              Premium
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className={cn(
          "aspect-[3/4] w-full rounded-md border bg-muted/40 relative",
          isPremium && "after:absolute after:inset-0 after:bg-background/60 after:backdrop-blur-[2px]"
        )} aria-hidden>
          <img
            src="/resume-template-preview.jpg"
            alt=""
            className={cn(
              "h-full w-full rounded-md object-cover opacity-90 transition group-hover:opacity-100",
              isPremium && "blur-[1px]"
            )}
          />
          {isPremium && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-8 text-yellow-600"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-sm font-medium text-foreground">Premium Only</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{tag}</span>
          {isPremium ? (
            <button
              disabled
              className="cursor-not-allowed text-sm text-muted-foreground line-through"
            >
              Locked
            </button>
          ) : (
            <Link href="/preview" className="text-sm underline underline-offset-4">
              Try
            </Link>
          )}
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
          </header>

          <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}>
            <TemplateCard title="Minimal Focus" tag="Minimal" />
            <TemplateCard title="Clean Type" tag="Modern" isPremium={true} />
            <TemplateCard title="Compact Grid" tag="Compact" isPremium={true} />
            <TemplateCard title="Serif Edge" tag="Elegant" isPremium={true} />
            <TemplateCard title="Bold Bar" tag="Statement" isPremium={true} />
            <TemplateCard title="Classic Lines" tag="Timeless" isPremium={true} />
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
