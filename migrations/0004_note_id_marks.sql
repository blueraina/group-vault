CREATE TABLE IF NOT EXISTS user_note_marks_v2 (
  github_login TEXT NOT NULL,
  note_id TEXT NOT NULL,
  path TEXT NOT NULL,
  mark_type TEXT NOT NULL CHECK (mark_type IN ('read', 'favorite')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (github_login, note_id, mark_type)
);

CREATE INDEX IF NOT EXISTS user_note_marks_v2_login_note_idx
  ON user_note_marks_v2(github_login, note_id);

CREATE INDEX IF NOT EXISTS user_note_marks_v2_login_path_idx
  ON user_note_marks_v2(github_login, path);

INSERT OR IGNORE INTO user_note_marks_v2 (
  github_login,
  note_id,
  path,
  mark_type,
  created_at,
  updated_at
)
SELECT
  github_login,
  path AS note_id,
  path,
  mark_type,
  created_at,
  updated_at
FROM user_note_marks;
