import {
  createOauthState,
  json,
  requireEnv,
  returnCookie,
  safeReturnTo,
  stateCookie,
} from "../../_lib/auth.js"

export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405)
  }

  try {
    const clientId = requireEnv(env, "GITHUB_CLIENT_ID")
    const url = new URL(request.url)
    const state = createOauthState()
    const returnTo = safeReturnTo(
      request,
      url.searchParams.get("returnTo") || request.headers.get("referer"),
    )
    const redirectUri = new URL("/api/auth/github/callback", url.origin).toString()
    const authorize = new URL("https://github.com/login/oauth/authorize")

    authorize.searchParams.set("client_id", clientId)
    authorize.searchParams.set("redirect_uri", redirectUri)
    authorize.searchParams.set("scope", "read:user")
    authorize.searchParams.set("state", state)
    authorize.searchParams.set("allow_signup", "true")

    const headers = new Headers({
      Location: authorize.toString(),
      "cache-control": "no-store",
    })
    headers.append("Set-Cookie", stateCookie(request, state))
    headers.append("Set-Cookie", returnCookie(request, returnTo))

    return new Response(null, { status: 302, headers })
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub login is unavailable"
    return json({ error: message }, 500)
  }
}
