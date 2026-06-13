import { database, getCurrentUser, isAdminLogin, json, normalizePath } from "../_lib/auth.js"

function normalizeContent(value) {
  const content = String(value || "").trim()
  if (!content) throw new Error("请填写评论内容")
  if (content.length > 5000) throw new Error("评论不能超过 5000 个字符")
  return content
}

function normalizeIdempotencyKey(value) {
  const key = String(value || "").trim()
  if (!key) return null
  if (key.length > 120) throw new Error("idempotency key is too long")
  return key
}

function publicComment(row, user, env) {
  const login = row.github_login || ""
  const canDelete = Boolean(user && (user.login === login || isAdminLogin(env, user.login)))

  return {
    id: row.id,
    path: row.path,
    author: row.author,
    content: row.content,
    created_at: row.created_at,
    github_login: login,
    github_avatar_url: row.github_avatar_url || "",
    can_delete: canDelete,
  }
}

async function requireUser(request, env) {
  const user = await getCurrentUser(request, env)
  if (!user) {
    const error = new Error("请先登录 GitHub 后再评论")
    error.status = 401
    throw error
  }
  return user
}

async function handleGet(request, env) {
  const url = new URL(request.url)
  const path = normalizePath(url.searchParams.get("path"))
  const db = await database(env)
  const user = await getCurrentUser(request, env)
  const { results } = await db
    .prepare(
      `SELECT id, path, author, content, created_at, github_login, github_avatar_url
       FROM comments
       WHERE path = ? AND status = 'visible'
       ORDER BY created_at ASC
       LIMIT 200`,
    )
    .bind(path)
    .all()

  return json({
    comments: (results ?? []).map((row) => publicComment(row, user, env)),
    user,
  })
}

async function handlePost(request, env) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return json({ error: "请求格式不是有效 JSON" }, 400)
  }

  if (body.website) {
    return json({ ok: true })
  }

  const user = await requireUser(request, env)
  const path = normalizePath(body.path)
  const content = normalizeContent(body.content)
  const idempotencyKey = normalizeIdempotencyKey(body.idempotencyKey || body.idempotency_key)
  const db = await database(env)
  const comment = {
    id: crypto.randomUUID(),
    path,
    author: user.name || user.login,
    content,
    created_at: new Date().toISOString(),
    github_login: user.login,
    github_id: user.id,
    github_avatar_url: user.avatarUrl,
  }

  const result = await db
    .prepare(
      `INSERT OR IGNORE INTO comments
        (id, path, author, content, status, created_at, github_login, github_id, github_avatar_url, idempotency_key)
       VALUES (?, ?, ?, ?, 'visible', ?, ?, ?, ?, ?)`,
    )
    .bind(
      comment.id,
      comment.path,
      comment.author,
      comment.content,
      comment.created_at,
      comment.github_login,
      comment.github_id,
      comment.github_avatar_url,
      idempotencyKey,
    )
    .run()

  if (result.meta?.changes === 0 && idempotencyKey) {
    const existing = await db
      .prepare(
        `SELECT id, path, author, content, created_at, github_login, github_avatar_url
         FROM comments
         WHERE idempotency_key = ? AND status = 'visible'`,
      )
      .bind(idempotencyKey)
      .first()
    if (existing) return json({ comment: publicComment(existing, user, env) }, 200)
  }

  return json({ comment: publicComment(comment, user, env) }, 201)
}

async function handleDelete(request, env) {
  const user = await requireUser(request, env)
  const url = new URL(request.url)
  const id = String(url.searchParams.get("id") || "").trim()
  if (!id) throw new Error("缺少评论 id")

  const db = await database(env)
  const row = await db
    .prepare("SELECT id, github_login, status FROM comments WHERE id = ?")
    .bind(id)
    .first()

  if (!row || row.status !== "visible") {
    const error = new Error("评论不存在")
    error.status = 404
    throw error
  }

  if (row.github_login !== user.login && !user.isAdmin) {
    const error = new Error("你没有权限删除这条评论")
    error.status = 403
    throw error
  }

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
    if (request.method === "GET") return handleGet(request, env)
    if (request.method === "POST") return handlePost(request, env)
    if (request.method === "DELETE") return handleDelete(request, env)
    return json({ error: "Method not allowed" }, 405)
  } catch (error) {
    const message = error instanceof Error ? error.message : "评论服务暂时不可用"
    const status = error.status || (message.includes("not configured") ? 500 : 400)
    return json({ error: message }, status)
  }
}
