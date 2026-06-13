import { database, json, requireMethod } from "../_lib/auth.js"

const cacheHeaders = {
  "cache-control": "public, max-age=300",
}

export async function onRequest({ request, env }) {
  const methodError = requireMethod(request, ["GET"])
  if (methodError) return methodError

  try {
    const db = database(env)
    const row = await db.prepare("SELECT COUNT(*) AS count FROM registered_users").first()
    const registeredUsers = Number(row?.count || 0)

    return json({ registeredUsers }, 200, cacheHeaders)
  } catch {
    return json({ error: "Site stats are not configured" }, 503)
  }
}
