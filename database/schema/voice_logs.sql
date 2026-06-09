-- voice_logs.sql
CREATE TABLE voice_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  intent VARCHAR(100),
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
