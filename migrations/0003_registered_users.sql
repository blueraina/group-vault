CREATE TABLE IF NOT EXISTS registered_users (
  github_login TEXT PRIMARY KEY COLLATE NOCASE,
  github_id TEXT,
  github_name TEXT,
  github_avatar_url TEXT,
  github_html_url TEXT,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS registered_users_last_seen_at_idx
  ON registered_users(last_seen_at);

INSERT OR IGNORE INTO registered_users
  (github_login, github_id, github_name, github_avatar_url, github_html_url, first_seen_at, last_seen_at)
SELECT
  github_login,
  MAX(github_id),
  MAX(github_name),
  MAX(github_avatar_url),
  MAX(github_html_url),
  MIN(created_at),
  MAX(last_seen_at)
FROM auth_sessions
WHERE github_login IS NOT NULL AND TRIM(github_login) != ''
GROUP BY github_login COLLATE NOCASE;

INSERT OR IGNORE INTO registered_users
  (github_login, github_id, github_name, github_avatar_url, github_html_url, first_seen_at, last_seen_at)
SELECT
  github_login,
  MAX(github_id),
  MAX(author),
  MAX(github_avatar_url),
  'https://github.com/' || github_login,
  MIN(created_at),
  MAX(created_at)
FROM comments
WHERE github_login IS NOT NULL AND TRIM(github_login) != ''
GROUP BY github_login COLLATE NOCASE;

INSERT OR IGNORE INTO registered_users
  (github_login, first_seen_at, last_seen_at)
SELECT
  github_login,
  MIN(created_at),
  MAX(updated_at)
FROM user_note_marks
WHERE github_login IS NOT NULL AND TRIM(github_login) != ''
GROUP BY github_login COLLATE NOCASE;
