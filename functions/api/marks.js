import { database, getCurrentUser, json, normalizePath } from "../_lib/auth.js"

const allowedMarkTypes = new Set(["read", "favorite"])

function normalizeMarkType(value) {
  const markType = String(value || "").trim()
  if (!allowedMarkTypes.has(markType)) throw new Error("Unknown mark type")
  return markType
}

function uniqueNormalizedPaths(values) {
  return [
    ...new Set(
      values
        .map((value) => {
          try {
            return normalizePath(value)
          } catch {
            return ""
          }
        })
        .filter(Boolean),
    ),
  ]
}

async function requireUser(request, env) {
  const user = await getCurrentUser(request, env)
  if (!user) {
    const error = new Error("GitHub login required")
    error.status = 401
    throw error
  }
  return user
}

async function handleGet(request, env) {
  const user = await requireUser(request, env)
  const db = database(env)
  const url = new URL(request.url)
  const pathParam = url.searchParams.get("path")
  const noteIdParam = url.searchParams.get("noteId") || url.searchParams.get("note_id")

  if (noteIdParam || pathParam) {
    const noteId = normalizePath(noteIdParam || pathParam)
    const path = normalizePath(pathParam || noteIdParam)
    const { results } = await db
      .prepare(
        `SELECT note_id, path, mark_type, created_at, updated_at
         FROM user_note_marks_v2
         WHERE github_login = ? AND (note_id = ? OR path = ?)
         ORDER BY updated_at DESC`,
      )
      .bind(user.login, noteId, path)
      .all()
    return json({ marks: results ?? [] })
  }

  const { results } = await db
    .prepare(
      `SELECT note_id, path, mark_type, created_at, updated_at
       FROM user_note_marks_v2
       WHERE github_login = ?
       ORDER BY updated_at DESC
       LIMIT 2000`,
    )
    .bind(user.login)
    .all()

  return json({ marks: results ?? [] })
}

async function handlePut(request, env) {
  const user = await requireUser(request, env)
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") throw new Error("Request body must be JSON")

  const path = normalizePath(body.path)
  const noteId = normalizePath(body.noteId || body.note_id || body.path)
  const relatedPaths = uniqueNormalizedPaths([
    noteId,
    path,
    ...(Array.isArray(body.aliases) ? body.aliases : []),
  ])
  const relatedPlaceholders = relatedPaths.map(() => "?").join(", ")
  const markType = normalizeMarkType(body.markType || body.mark_type)
  const active = Boolean(body.active)
  const now = new Date().toISOString()
  const db = database(env)

  if (!active) {
    await db
      .prepare(
        `DELETE FROM user_note_marks_v2
         WHERE github_login = ? AND mark_type = ?
           AND (note_id IN (${relatedPlaceholders}) OR path IN (${relatedPlaceholders}))`,
      )
      .bind(user.login, markType, ...relatedPaths, ...relatedPaths)
      .run()
    return json({ ok: true, mark: { note_id: noteId, path, mark_type: markType, active: false } })
  }

  await db
    .prepare(
      `DELETE FROM user_note_marks_v2
       WHERE github_login = ? AND mark_type = ?
         AND (note_id IN (${relatedPlaceholders}) OR path IN (${relatedPlaceholders}))
         AND note_id <> ?`,
    )
    .bind(user.login, markType, ...relatedPaths, ...relatedPaths, noteId)
    .run()

  await db
    .prepare(
      `INSERT INTO user_note_marks_v2 (github_login, note_id, path, mark_type, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(github_login, note_id, mark_type)
       DO UPDATE SET path = excluded.path, updated_at = excluded.updated_at`,
    )
    .bind(user.login, noteId, path, markType, now, now)
    .run()

  return json({
    ok: true,
    mark: { note_id: noteId, path, mark_type: markType, active: true, updated_at: now },
  })
}

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { "cache-control": "no-store" } })
  }

  try {
    if (request.method === "GET") return handleGet(request, env)
    if (request.method === "PUT") return handlePut(request, env)
    return json({ error: "Method not allowed" }, 405)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Marks service unavailable"
    return json({ error: message }, error.status || 400)
  }
}
