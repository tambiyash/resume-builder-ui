"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const session = authClient?.useSession?.()

  // Auth protection and data loading
  useEffect(() => {
    if (session) {
      if (!session?.data?.user) {
        router.push("/login")
      } else {
        setName(session.data.user.name || "")
        setEmail(session.data.user.email || "")
        setIsLoading(false)
      }
    }
  }, [session, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const result = await authClient.updateUser({
        name: name,
      })

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to update profile")
      } else {
        setSuccessMessage("Profile updated successfully!")
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading || !session?.data) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const user = session.data.user
  const accounts = session.data.session?.accounts || []

  // Determine authentication method
  const hasEmailPassword = user.email && !accounts.length
  const socialAccounts = accounts.filter((acc: any) => acc.providerId)

  return (
    <main className="mx-auto min-h-[100svh] max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your personal details and account information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Profile Picture / Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user.name || "No name set"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Separator />

            {/* Update Profile Form */}
            <form onSubmit={handleUpdateProfile} className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              {successMessage && (
                <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3">
                  <p className="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3">
                  <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
              )}

              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Information about your account and authentication</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-xs text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Email Verified</p>
                  <div className="flex items-center gap-2">
                    {user.emailVerified ? (
                      <>
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
                        <span className="text-xs text-green-600">Verified</span>
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
                          className="size-4 text-yellow-600"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>
                        <span className="text-xs text-yellow-600">Not verified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Methods Card */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Methods</CardTitle>
            <CardDescription>How you sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {hasEmailPassword && (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5 text-primary"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Email & Password</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </span>
              </div>
            )}

            {socialAccounts.map((account: any, index: number) => {
              const providerName = account.providerId || "Unknown"
              const providerIcon = getProviderIcon(providerName)
              
              return (
                <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    {providerIcon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{providerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {account.accountId || user.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Connected
                  </span>
                </div>
              )
            })}

            {!hasEmailPassword && socialAccounts.length === 0 && (
              <p className="text-sm text-muted-foreground">No authentication methods found</p>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Account deletion is currently disabled
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

// Helper function to get provider icons
function getProviderIcon(provider: string) {
  switch (provider.toLowerCase()) {
    case "google":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-5"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )
    case "linkedin":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="size-5">
          <rect fill="#0A66C2" width="72" height="72" rx="8" />
          <path
            fill="#fff"
            d="M16.6 27.3h8.6v27.7h-8.6zM21 17.1c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1a5.1 5.1 0 1 1 0-10.2zM30.6 27.3h8.2v3.8h.1c1.1-2.1 3.9-4.4 8-4.4 8.6 0 10.2 5.6 10.2 12.9v15.4H48.5V41.7c0-3-0.1-6.8-4.2-6.8-4.2 0-4.9 3.2-4.9 6.6v13.4h-8.7V27.3z"
          />
        </svg>
      )
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5 text-primary"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
  }
}

