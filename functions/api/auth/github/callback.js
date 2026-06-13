import {
  clearOauthCookies,
  createSession,
  getOauthReturnTo,
  getOauthState,
  json,
  requireEnv,
  safeReturnTo,
  sessionCookie,
} from "../../../_lib/auth.js"

async function exchangeCode(env, code, redirectUri) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "group-vault-comments",
    },
    body: JSON.stringify({
      client_id: requireEnv(env, "GITHUB_CLIENT_ID"),
      client_secret: requireEnv(env, "GITHUB_CLIENT_SECRET"),
      code,
      redirect_uri: redirectUri,
    }),
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.error || !data.access_token) {
    throw new Error(data.error_description || data.error || "GitHub token exchange failed")
  }

  return data.access_token
}

async function fetchGithubUser(token) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "User-Agent": "group-vault-comments",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.login || data.id == null) {
    throw new Error(data.message || "GitHub user lookup failed")
  }

  return data
}

function redirectWithCookies(location, cookies) {
  const headers = new Headers({
    Location: location,
    "cache-control": "no-store",
  })
  cookies.forEach((cookie) => headers.append("Set-Cookie", cookie))
  return new Response(null, { status: 302, headers })
}

export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405)
  }

  const url = new URL(request.url)
  const returnTo = safeReturnTo(request, getOauthReturnTo(request))
  const clearCookies = clearOauthCookies(request)

  try {
    const expectedState = getOauthState(request)
    const actualState = url.searchParams.get("state") || ""
    const code = url.searchParams.get("code") || ""

    if (url.searchParams.get("error")) {
      throw new Error(
        url.searchParams.get("error_description") ||
          url.searchParams.get("error") ||
          "GitHub login failed",
      )
    }
    if (!expectedState || !actualState || expectedState !== actualState) {
      throw new Error("GitHub login state did not match")
    }
    if (!code) {
      throw new Error("GitHub login code is missing")
    }

    const redirectUri = new URL("/api/auth/github/callback", url.origin).toString()
    const token = await exchangeCode(env, code, redirectUri)
    const githubUser = await fetchGithubUser(token)
    const session = await createSession(env, githubUser)

    return redirectWithCookies(returnTo, [...clearCookies, sessionCookie(request, session.token)])
  } catch (error) {
    const message = encodeURIComponent(
      error instanceof Error ? error.message : "GitHub login failed",
    )
    return redirectWithCookies(
      returnTo + (returnTo.includes("?") ? "&" : "?") + "auth_error=" + message,
      clearCookies,
    )
  }
}
