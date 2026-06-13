CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS comments_path_created_at_idx ON comments(path, created_at);
CREATE INDEX IF NOT EXISTS comments_status_idx ON comments(status);
