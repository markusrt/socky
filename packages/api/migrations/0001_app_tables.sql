-- Socky app tables (ADR 0002 Phase B: D1).
-- Better Auth core tables (user, session, account, verification) are created
-- via the programmatic migration endpoint (`POST /migrate`) using better-auth/db/migration.

CREATE TABLE IF NOT EXISTS actual_sizes (
  id TEXT PRIMARY KEY,
  pattern_id TEXT NOT NULL,
  label TEXT NOT NULL,
  chart_size_label TEXT NOT NULL,
  counts_json TEXT NOT NULL,
  tip_rounds_json TEXT NOT NULL,
  construction_json TEXT,
  tags_json TEXT,
  notes TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pair_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  pattern_id TEXT NOT NULL,
  chart_size_label TEXT NOT NULL,
  actual_size_label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'DONE', 'ARCHIVED')),
  active_sock INTEGER NOT NULL DEFAULT 1 CHECK (active_sock IN (1, 2)),
  created_at TEXT NOT NULL,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_pair_sessions_user ON pair_sessions (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS session_steps (
  session_id TEXT NOT NULL,
  sort_index INTEGER NOT NULL,
  step_key TEXT NOT NULL,
  title_key TEXT NOT NULL,
  technique_note_key TEXT,
  unit TEXT NOT NULL,
  target_count INTEGER NOT NULL,
  display_value TEXT,
  tip_round_index INTEGER,
  tip_round_title TEXT,
  tip_row_label TEXT,
  tip_direction TEXT,
  row_polarity TEXT,
  tip_rounds_json TEXT,
  sock1_done INTEGER NOT NULL DEFAULT 0,
  sock2_done INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (session_id, sort_index),
  FOREIGN KEY (session_id) REFERENCES pair_sessions (id) ON DELETE CASCADE
);
