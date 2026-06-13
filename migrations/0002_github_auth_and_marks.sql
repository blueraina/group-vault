ALTER TABLE comments ADD COLUMN github_login TEXT;
ALTER TABLE comments ADD COLUMN github_id TEXT;
ALTER TABLE comments ADD COLUMN github_avatar_url TEXT;
ALTER TABLE comments ADD COLUMN idempotency_key TEXT;
ALTER TABLE comments ADD COLUMN deleted_at TEXT;
ALTER TABLE comments ADD COLUMN deleted_by TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS comments_idempotency_key_idx
  ON comments(idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS auth_sessions (
  token_hash TEXT PRIMARY KEY,
  github_id TEXT NOT NULL,
  github_login TEXT NOT NULL,
  github_name TEXT,
  github_avatar_url TEXT,
  github_html_url TEXT,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS auth_sessions_login_idx ON auth_sessions(github_login);
CREATE INDEX IF NOT EXISTS auth_sessions_expires_at_idx ON auth_sessions(expires_at);

CREATE TABLE IF NOT EXISTS user_note_marks (
  github_login TEXT NOT NULL,
  path TEXT NOT NULL,
  mark_type TEXT NOT NULL CHECK (mark_type IN ('read', 'favorite')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (github_login, path, mark_type)
);

CREATE INDEX IF NOT EXISTS user_note_marks_login_path_idx
  ON user_note_marks(github_login, path);
