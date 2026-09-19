CREATE TABLE IF NOT EXISTS resumes (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf' CHECK (mime_type = 'application/pdf'),
  file_size INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 10485760),
  file_data BYTEA NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
