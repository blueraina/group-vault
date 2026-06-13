import { getCurrentUser, githubAuthConfigured, json } from "../../_lib/auth.js"

export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405)
  }

  try {
    const authConfigured = githubAuthConfigured(env)
    const user = authConfigured ? await getCurrentUser(request, env) : null
    return json({
      authenticated: Boolean(user),
      user,
      authConfigured,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Session lookup failed"
    return json({
      authenticated: false,
      user: null,
      authConfigured: githubAuthConfigured(env),
      error: message,
    })
  }
}
