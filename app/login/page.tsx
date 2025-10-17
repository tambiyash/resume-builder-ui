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
      const result = await authClient.signIn.email({ 
        email, 
        password,
        callbackURL: "/"
      })
      
      // Check if there's an error in the response
      if (result?.error) {
        setError(result.error.message ?? "Login failed")
        setLoading(false)
        return
      }
      
      // Only redirect if login was successful
      if (result?.data) {
        window.location.assign("/")
      }
    } catch (err: any) {
      setError(err?.message ?? "Login failed")
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

  async function loginGoogle() {
    setError(null)
    try {
      await authClient.signIn.social({ provider: "google" })
    } catch (err: any) {
      setError(err?.message ?? "Google sign-in failed")
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
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button variant="outline" onClick={loginGoogle} className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </Button>
            <Button variant="outline" onClick={loginLinkedIn} className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="size-4" aria-hidden>
                <rect fill="#0A66C2" width="72" height="72" rx="8" />
                <path fill="#fff" d="M16.6 27.3h8.6v27.7h-8.6zM21 17.1c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1a5.1 5.1 0 1 1 0-10.2zM30.6 27.3h8.2v3.8h.1c1.1-2.1 3.9-4.4 8-4.4 8.6 0 10.2 5.6 10.2 12.9v15.4H48.5V41.7c0-3-0.1-6.8-4.2-6.8-4.2 0-4.9 3.2-4.9 6.6v13.4h-8.7V27.3z"/>
              </svg>
              <span>Sign in with LinkedIn</span>
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account? <Link href="/signup" className="underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}


