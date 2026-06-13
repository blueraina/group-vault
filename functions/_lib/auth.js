import { generatedMaintainerLogins } from "./maintainers.generated.js"

const SESSION_COOKIE = "gv_session"
const OAUTH_STATE_COOKIE = "gv_oauth_state"
const OAUTH_RETURN_COOKIE = "gv_oauth_return"
const SESSION_MAX_AGE = 60 * 60 * 24 * 30

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
}

const encoder = new TextEncoder()

function parseLoginList(value) {
  return new Set(
    String(value || "")
      .split(/[,\s]+/u)
      .map((login) => login.trim().toLowerCase())
      .filter(Boolean),
  )
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...jsonHeaders, ...headers },
  })
}

export function requireMethod(request, methods) {
  if (methods.includes(request.method)) return null
  return json({ error: "Method not allowed" }, 405)
}

export function database(env) {
  if (!env.COMMENTS_DB || typeof env.COMMENTS_DB.prepare !== "function") {
    throw new Error("COMMENTS_DB D1 binding is not configured")
  }

  return env.COMMENTS_DB
}

export function requireEnv(env, name) {
  const value = String(env[name] || "").trim()
  if (!value) throw new Error(name + " is not configured")
  return value
}

export function hasEnv(env, name) {
  return Boolean(String(env[name] || "").trim())
}

export function missingEnv(env, names) {
  return names.filter((name) => !hasEnv(env, name))
}

export function githubAuthConfigured(env) {
  return (
    missingEnv(env, ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "SESSION_SECRET"]).length === 0
  )
}

export function parseCookies(request) {
  const header = request.headers.get("cookie") || ""
  const cookies = {}
  header.split(";").forEach((part) => {
    const index = part.indexOf("=")
    if (index === -1) return
    const name = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (!name) return
    try {
      cookies[name] = decodeURIComponent(value)
    } catch {
      cookies[name] = value
    }
  })
  return cookies
}

export function cookieHeader(request, name, value, options = {}) {
  const url = new URL(request.url)
  const attrs = [
    name + "=" + encodeURIComponent(value),
    "Path=" + (options.path || "/"),
    "SameSite=" + (options.sameSite || "Lax"),
  ]

  if (options.httpOnly !== false) attrs.push("HttpOnly")
  if (options.maxAge != null) attrs.push("Max-Age=" + String(options.maxAge))
  if (options.expires) attrs.push("Expires=" + options.expires.toUTCString())
  if (url.protocol === "https:") attrs.push("Secure")

  return attrs.join("; ")
}

export function clearCookieHeader(request, name) {
  return cookieHeader(request, name, "", {
    maxAge: 0,
    expires: new Date(0),
  })
}

function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function randomToken(size = 32) {
  const bytes = new Uint8Array(size)
  crypto.getRandomValues(bytes)
  let binary = ""
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

async function hmacHex(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value))
  return bytesToHex(signature)
}

export function adminLogins(env) {
  return parseLoginList(env.ADMIN_GITHUB_LOGINS)
}

export function maintainerLogins(env) {
  return new Set([
    ...generatedMaintainerLogins.map((login) => String(login).trim().toLowerCase()).filter(Boolean),
    ...adminLogins(env),
    ...parseLoginList(env.MAINTAINER_GITHUB_LOGINS),
  ])
}

export function isMaintainerLogin(env, login) {
  return maintainerLogins(env).has(String(login || "").toLowerCase())
}

export function isAdminLogin(env, login) {
  return isMaintainerLogin(env, login)
}

export function normalizePath(value) {
  const path =
    String(value || "")
      .trim()
      .replace(/^\/+|\/+$/g, "") || "index"
  if (path.length > 300) throw new Error("path is too long")
  return path
}

export function safeReturnTo(request, value) {
  if (!value) return "/"

  try {
    const current = new URL(request.url)
    const next = new URL(value, current.origin)
    if (next.origin !== current.origin) return "/"
    return next.pathname + next.search + next.hash
  } catch {
    return "/"
  }
}

export function createOauthState() {
  return randomToken(24)
}

export function stateCookie(request, state) {
  return cookieHeader(request, OAUTH_STATE_COOKIE, state, { maxAge: 600 })
}

export function returnCookie(request, returnTo) {
  return cookieHeader(request, OAUTH_RETURN_COOKIE, returnTo, { maxAge: 600 })
}

export function clearOauthCookies(request) {
  return [
    clearCookieHeader(request, OAUTH_STATE_COOKIE),
    clearCookieHeader(request, OAUTH_RETURN_COOKIE),
  ]
}

export function getOauthState(request) {
  return parseCookies(request)[OAUTH_STATE_COOKIE] || ""
}

export function getOauthReturnTo(request) {
  return parseCookies(request)[OAUTH_RETURN_COOKIE] || "/"
}

async function sessionHash(env, token) {
  return hmacHex(requireEnv(env, "SESSION_SECRET"), token)
}

export async function createSession(env, githubUser) {
  const db = database(env)
  const token = randomToken(48)
  const tokenHash = await sessionHash(env, token)
  const now = new Date()
  const expires = new Date(now.getTime() + SESSION_MAX_AGE * 1000)

  await db
    .prepare(
      `INSERT INTO auth_sessions
        (token_hash, github_id, github_login, github_name, github_avatar_url, github_html_url, created_at, last_seen_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      tokenHash,
      String(githubUser.id),
      githubUser.login,
      githubUser.name || null,
      githubUser.avatar_url || null,
      githubUser.html_url || null,
      now.toISOString(),
      now.toISOString(),
      expires.toISOString(),
    )
    .run()

  await recordRegisteredUser(env, githubUser, now).catch(() => {})

  return { token, expires }
}

export async function recordRegisteredUser(env, githubUser, date = new Date()) {
  const db = database(env)
  const now = date.toISOString()
  const login = String(githubUser.login || "").trim()
  if (!login) return

  await db
    .prepare(
      `INSERT INTO registered_users
        (github_login, github_id, github_name, github_avatar_url, github_html_url, first_seen_at, last_seen_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(github_login)
       DO UPDATE SET
        github_id = excluded.github_id,
        github_name = excluded.github_name,
        github_avatar_url = excluded.github_avatar_url,
        github_html_url = excluded.github_html_url,
        last_seen_at = excluded.last_seen_at`,
    )
    .bind(
      login,
      githubUser.id == null ? null : String(githubUser.id),
      githubUser.name || null,
      githubUser.avatar_url || null,
      githubUser.html_url || null,
      now,
      now,
    )
    .run()
}

export function sessionCookie(request, token) {
  return cookieHeader(request, SESSION_COOKIE, token, { maxAge: SESSION_MAX_AGE })
}

export function clearSessionCookie(request) {
  return clearCookieHeader(request, SESSION_COOKIE)
}

export async function getCurrentUser(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE]
  if (!token) return null

  const db = database(env)
  const tokenHash = await sessionHash(env, token)
  const now = new Date().toISOString()
  const row = await db
    .prepare(
      `SELECT github_id, github_login, github_name, github_avatar_url, github_html_url, expires_at
       FROM auth_sessions
       WHERE token_hash = ? AND expires_at > ?`,
    )
    .bind(tokenHash, now)
    .first()

  if (!row) return null

  await db
    .prepare("UPDATE auth_sessions SET last_seen_at = ? WHERE token_hash = ?")
    .bind(now, tokenHash)
    .run()
    .catch(() => {})

  return {
    id: String(row.github_id),
    login: String(row.github_login),
    name: row.github_name || String(row.github_login),
    avatarUrl: row.github_avatar_url || "",
    htmlUrl: row.github_html_url || "",
    isAdmin: isAdminLogin(env, row.github_login),
  }
}

export async function deleteCurrentSession(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE]
  if (!token) return

  const db = database(env)
  const tokenHash = await sessionHash(env, token)
  await db.prepare("DELETE FROM auth_sessions WHERE token_hash = ?").bind(tokenHash).run()
}
