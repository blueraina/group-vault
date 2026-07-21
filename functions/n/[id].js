import { shortlinks } from "../_lib/shortlinks.generated.js"

function text(message, status = 200) {
  return new Response(message, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}

export async function onRequest(context) {
  const { request, params } = context
  if (request.method !== "GET" && request.method !== "HEAD") {
    return text("Method Not Allowed", 405)
  }

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id
  const id = String(rawId || "").trim()
  if (!/^\d+$/u.test(id)) {
    return text("Short link not found", 404)
  }

  const target = shortlinks[id]
  if (!target) {
    return text("Short link not found", 404)
  }

  const location = new URL(target, request.url)
  return Response.redirect(location.toString(), 302)
}
