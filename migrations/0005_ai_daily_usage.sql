CREATE TABLE IF NOT EXISTS ai_daily_usage (
  github_login TEXT NOT NULL COLLATE NOCASE,
  usage_date TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (github_login, usage_date)
);

CREATE INDEX IF NOT EXISTS ai_daily_usage_date_idx
  ON ai_daily_usage(usage_date);
