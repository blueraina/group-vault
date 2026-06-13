import { getCurrentUser, json } from "../../_lib/auth.js"

export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405)
  }

  try {
    const user = await getCurrentUser(request, env)
    return json({
      authenticated: Boolean(user),
      user,
      authConfigured: Boolean(env.GITHUB_CLIENT_ID),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Session lookup failed"
    return json({ error: message }, 500)
  }
}
