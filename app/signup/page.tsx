"use client"

import Link from "next/link"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authClient.signUp.email({ email, password })
      window.location.assign("/login")
    } catch (err: any) {
      setError(err?.message ?? "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto grid min-h-[100svh] max-w-md place-items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Sign up</CardTitle>
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
            <Button disabled={loading}>{loading ? "Creating account..." : "Create account"}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}


