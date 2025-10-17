import { NextResponse } from "next/server"

function generateRandomState(length = 32): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const values = new Uint32Array(length)
  crypto.getRandomValues(values)
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length]
  }
  return result
}

export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return new NextResponse("LinkedIn OAuth is not configured.", { status: 500 })
  }

  const state = generateRandomState(32)

  const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization")
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("scope", "openid profile email")
  authUrl.searchParams.set("state", state)

  const response = NextResponse.redirect(authUrl.toString())
  response.cookies.set("li_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 10 * 60,
  })
  return response
}


