import {
  createOauthState,
  githubAuthConfigured,
  json,
  missingEnv,
  requireEnv,
  returnCookie,
  safeReturnTo,
  stateCookie,
} from "../../_lib/auth.js"

function loginUnavailable(request, env) {
  const missing = missingEnv(env, ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "SESSION_SECRET"])
  const message = "GitHub login is not configured"
  const accept = request.headers.get("accept") || ""

  if (accept.includes("text/html")) {
    const detail = missing.length > 0 ? missing.join(", ") : "required environment variables"
    return new Response(
      `<!doctype html>
<meta charset="utf-8">
<title>GitHub 登录未配置</title>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; max-width: 42rem; margin: 4rem auto; padding: 0 1rem;">
  <h1>GitHub 登录暂时不可用</h1>
  <p>站点还没有完成 GitHub OAuth 环境变量配置。</p>
  <p><code>${detail}</code></p>
  <p><a href="/">返回首页</a></p>
</body>`,
      {
        status: 503,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      },
    )
  }

  return json({ error: message, authConfigured: false, missing }, 503)
}

export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405)
  }

  try {
    if (!githubAuthConfigured(env)) return loginUnavailable(request, env)

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
