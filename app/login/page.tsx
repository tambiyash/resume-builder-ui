"use client"

import Link from "next/link"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authClient.signIn.email({ email, password })
      window.location.assign("/")
    } catch (err: any) {
      setError(err?.message ?? "Login failed")
    } finally {
      setLoading(false)
    }
  }

  async function loginLinkedIn() {
    setError(null)
    try {
      await authClient.signIn.social({ provider: "linkedin" })
    } catch (err: any) {
      setError(err?.message ?? "LinkedIn sign-in failed")
    }
  }

  return (
    <main className="mx-auto grid min-h-[100svh] max-w-md place-items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Log in</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form className="grid gap-3" onSubmit={onSubmit}>
            <div className="grid gap-1.5">
              <label className="text-sm">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button disabled={loading}>{loading ? "Logging in..." : "Log in"}</Button>
          </form>
          <Button variant="outline" onClick={loginLinkedIn} className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="size-4" aria-hidden>
              <rect fill="#0A66C2" width="72" height="72" rx="8" />
              <path fill="#fff" d="M16.6 27.3h8.6v27.7h-8.6zM21 17.1c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1a5.1 5.1 0 1 1 0-10.2zM30.6 27.3h8.2v3.8h.1c1.1-2.1 3.9-4.4 8-4.4 8.6 0 10.2 5.6 10.2 12.9v15.4H48.5V41.7c0-3-0.1-6.8-4.2-6.8-4.2 0-4.9 3.2-4.9 6.6v13.4h-8.7V27.3z"/>
            </svg>
            <span>Sign in with LinkedIn</span>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account? <Link href="/signup" className="underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}


