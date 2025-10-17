"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const maybeUseSession = authClient?.useSession?.();

  useEffect(() => {
    if (maybeUseSession) {
      setIsAuthenticated(!!maybeUseSession?.data?.user)
      return
    }
  }, [maybeUseSession])

  async function handleSignOut() {
    try {
      await authClient.signOut()
      window.location.assign("/login")
    } catch (err) {
      console.error("Sign out failed:", err)
    }
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [menuOpen])

  return (
    <nav className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-medium">Resume Studio</Link>

        {!isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        ) : (
          <div className="relative" ref={menuRef}>
              <Button variant="outline" size="icon" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={menuOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 z-20 mt-2 w-40 rounded-md border bg-popover p-1 text-sm shadow-md">
                <Link href="/profile" className="block rounded px-2 py-1.5 hover:bg-accent" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link href="/settings" className="block rounded px-2 py-1.5 hover:bg-accent" onClick={() => setMenuOpen(false)}>
                  Settings
                </Link>
                <div className="my-1 border-t" />
                <button
                  onClick={handleSignOut}
                  className="block w-full rounded px-2 py-1.5 text-left hover:bg-accent"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}


