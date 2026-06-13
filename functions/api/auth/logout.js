import { clearSessionCookie, deleteCurrentSession, json } from "../../_lib/auth.js"

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405)
  }

  try {
    await deleteCurrentSession(request, env)
    return json({ ok: true }, 200, {
      "Set-Cookie": clearSessionCookie(request),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logout failed"
    return json({ error: message }, 500)
  }
}
