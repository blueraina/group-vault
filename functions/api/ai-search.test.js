import assert from "node:assert/strict"
import test from "node:test"

import { checkDailyRateLimit, dailyUsageDate } from "./ai-search.js"

function fakeDatabase() {
  const counts = new Map()

  return {
    prepare(sql) {
      assert.match(sql, /ON CONFLICT\(github_login, usage_date\)/u)
      assert.match(sql, /RETURNING request_count/u)

      return {
        bind(login, usageDate, _updatedAt, limit) {
          return {
            async first() {
              const key = `${login}:${usageDate}`
              const current = counts.get(key) || 0
              if (current >= limit) return null

              const next = current + 1
              counts.set(key, next)
              return { request_count: next }
            },
          }
        },
      }
    },
  }
}

test("dailyUsageDate resets at midnight in Japan", () => {
  assert.equal(dailyUsageDate(Date.parse("2026-08-10T14:59:59Z")), "2026-08-10")
  assert.equal(dailyUsageDate(Date.parse("2026-08-10T15:00:00Z")), "2026-08-11")
})

test("daily rate limit allows 200 requests per user and resets the next day", async () => {
  const env = { COMMENTS_DB: fakeDatabase() }
  const user = { login: "BlueRaina" }
  const firstDay = Date.parse("2026-08-10T03:00:00Z")

  let usage
  for (let index = 0; index < 200; index += 1) {
    usage = await checkDailyRateLimit(env, user, firstDay)
  }

  assert.deepEqual(usage, {
    limit: 200,
    used: 200,
    remaining: 0,
    usageDate: "2026-08-10",
  })

  await assert.rejects(checkDailyRateLimit(env, user, firstDay), (error) => {
    assert.equal(error.status, 429)
    assert.equal(error.code, "DAILY_RATE_LIMITED")
    return true
  })

  const nextDayUsage = await checkDailyRateLimit(env, user, Date.parse("2026-08-10T15:00:00Z"))
  assert.equal(nextDayUsage.used, 1)
  assert.equal(nextDayUsage.remaining, 199)
  assert.equal(nextDayUsage.usageDate, "2026-08-11")
})
