const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  })
}

function normalizePath(value) {
  const path = String(value || "").trim().replace(/^\/+|\/+$/g, "") || "index"
  if (path.length > 300) throw new Error("path 太长")
  return path
}

function normalizeAuthor(value) {
  const author = String(value || "").replace(/\s+/g, " ").trim()
  if (!author) throw new Error("请填写昵称")
  if (author.length > 40) throw new Error("昵称不能超过 40 个字符")
  return author
}

function normalizeContent(value) {
  const content = String(value || "").trim()
  if (!content) throw new Error("请填写评论内容")
  if (content.length > 5000) throw new Error("评论不能超过 5000 个字符")
  return content
}

async function database(env) {
  if (!env.COMMENTS_DB || typeof env.COMMENTS_DB.prepare !== "function") {
    throw new Error("COMMENTS_DB D1 绑定尚未配置")
  }

  return env.COMMENTS_DB
}

async function handleGet(request, env) {
  const url = new URL(request.url)
  const path = normalizePath(url.searchParams.get("path"))
  const db = await database(env)
  const { results } = await db
    .prepare(
      "SELECT id, path, author, content, created_at FROM comments WHERE path = ? AND status = 'visible' ORDER BY created_at ASC LIMIT 200",
    )
    .bind(path)
    .all()

  return json({ comments: results ?? [] })
}

async function handlePost(request, env) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return json({ error: "请求格式不是有效 JSON" }, 400)
  }

  if (body.website) {
    return json({ ok: true })
  }

  const path = normalizePath(body.path)
  const author = normalizeAuthor(body.author)
  const content = normalizeContent(body.content)
  const db = await database(env)
  const comment = {
    id: crypto.randomUUID(),
    path,
    author,
    content,
    created_at: new Date().toISOString(),
  }

  await db
    .prepare(
      "INSERT INTO comments (id, path, author, content, status, created_at) VALUES (?, ?, ?, ?, 'visible', ?)",
    )
    .bind(comment.id, comment.path, comment.author, comment.content, comment.created_at)
    .run()

  return json({ comment }, 201)
}

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: jsonHeaders })
  }

  try {
    if (request.method === "GET") return handleGet(request, env)
    if (request.method === "POST") return handlePost(request, env)
    return json({ error: "Method not allowed" }, 405)
  } catch (error) {
    const message = error instanceof Error ? error.message : "评论服务暂时不可用"
    const status = message.includes("尚未配置") ? 500 : 400
    return json({ error: message }, status)
  }
}
