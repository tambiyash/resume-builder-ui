import { cookies } from "next/headers"
import { NextResponse } from "next/server"

type LinkedInIdToken = {
  iss: string
  aud: string
  iat: number
  exp: number
  sub: string
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
  email?: string
  email_verified?: boolean
  locale?: string
}

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const clientId = process.env.LINKEDIN_CLIENT_ID!
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET!

  const body = new URLSearchParams()
  body.set("grant_type", "authorization_code")
  body.set("code", code)
  body.set("redirect_uri", redirectUri)
  body.set("client_id", clientId)
  body.set("client_secret", clientSecret)

  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed: ${res.status} ${text}`)
  }

  return (await res.json()) as { access_token: string; id_token?: string; expires_in: number }
}

async function fetchUserInfo(accessToken: string) {
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`userinfo failed: ${res.status} ${text}`)
  }
  return (await res.json()) as Partial<LinkedInIdToken>
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI
  const expectedState = (await cookies()).get("li_oauth_state")?.value

  if (!redirectUri) {
    return new NextResponse("Missing LINKEDIN_REDIRECT_URI", { status: 500 })
  }

  if (!code || !state) {
    return new NextResponse("Missing code/state", { status: 400 })
  }

  if (!expectedState || state !== expectedState) {
    return new NextResponse("Invalid OAuth state", { status: 400 })
  }

  try {
    const { access_token } = await exchangeCodeForTokens(code, redirectUri)
    const profile = await fetchUserInfo(access_token)

    console.log(profile, "Profile Details")

    // Map to our resume shape (partial)
    const mapped = {
      personal: {
        fullName: profile.name ?? [profile.given_name, profile.family_name].filter(Boolean).join(" ") ?? "",
        title: "",
        email: profile.email ?? "",
        phone: "",
        location: profile.locale ?? "",
        summary: "",
      },
    }

    // Redirect back to editor with data in URL (encoded). For production, prefer session storage.
    const redirect = new URL("/preview", request.url)
    redirect.searchParams.set("import", Buffer.from(JSON.stringify(mapped)).toString("base64url"))

    const res = NextResponse.redirect(redirect.toString())
    res.cookies.set("li_oauth_state", "", { path: "/", maxAge: 0 })
    return res
  } catch (err: any) {
    return new NextResponse(err?.message ?? "Auth failure", { status: 500 })
  }
}


