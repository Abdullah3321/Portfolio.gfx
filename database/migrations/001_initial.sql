CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  metric TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  media TEXT NOT NULL DEFAULT 'product' CHECK (media IN ('product', 'workspace', 'architecture')),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Published', 'Draft')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_public_idx ON projects (status, featured DESC, sort_order ASC);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries (status, created_at DESC);

CREATE TABLE IF NOT EXISTS site_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  site_title TEXT NOT NULL,
  site_description TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  analytics_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_path_idx ON analytics_events (path, created_at DESC);

INSERT INTO site_settings (id, site_title, site_description, contact_email)
VALUES (TRUE, 'Mehroz | E-commerce Strategy & Creative Direction', 'A refined portfolio website for a strategic e-commerce and brand consultant.', 'hello@mehrozgfx.com')
ON CONFLICT (id) DO NOTHING;
