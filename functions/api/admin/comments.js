import { database, getCurrentUser, json } from "../../_lib/auth.js"

function httpError(message, status) {
  const error = new Error(message)
  error.status = status
  return error
}

async function requireAdmin(request, env) {
  const user = await getCurrentUser(request, env)
  if (!user) throw httpError("请先登录 GitHub 后再查看评论管理页", 401)
  if (!user.isAdmin) throw httpError("你没有权限查看评论管理页", 403)
  return user
}

function normalizeLimit(value) {
  const limit = Number.parseInt(String(value || ""), 10)
  if (!Number.isFinite(limit)) return 50
  return Math.max(1, Math.min(limit, 200))
}

async function handleGet(request, env) {
  const user = await requireAdmin(request, env)
  const url = new URL(request.url)
  const limit = normalizeLimit(url.searchParams.get("limit"))
  const db = database(env)
  const { results } = await db
    .prepare(
      `SELECT id, path, author, content, created_at, github_login, github_avatar_url
       FROM comments
       WHERE status = 'visible'
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all()

  return json({ user, comments: results ?? [] })
}

async function handleDelete(request, env) {
  const user = await requireAdmin(request, env)
  const url = new URL(request.url)
  const id = String(url.searchParams.get("id") || "").trim()
  if (!id) throw httpError("缺少评论 id", 400)

  const db = database(env)
  const row = await db.prepare("SELECT id, status FROM comments WHERE id = ?").bind(id).first()

  if (!row || row.status !== "visible") throw httpError("评论不存在", 404)

  await db
    .prepare("UPDATE comments SET status = 'deleted', deleted_at = ?, deleted_by = ? WHERE id = ?")
    .bind(new Date().toISOString(), user.login, id)
    .run()

  return json({ ok: true })
}

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { "cache-control": "no-store" } })
  }

  try {
    if (request.method === "GET") return await handleGet(request, env)
    if (request.method === "DELETE") return await handleDelete(request, env)
    return json({ error: "Method not allowed" }, 405)
  } catch (error) {
    const message = error instanceof Error ? error.message : "评论管理服务暂时不可用"
    const configured = !message.includes("not configured")
    const status = error.status || (configured ? 400 : 503)
    return json({ error: message, configured }, status)
  }
}
