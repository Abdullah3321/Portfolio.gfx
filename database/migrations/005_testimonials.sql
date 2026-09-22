CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  quote TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO testimonials (name, role, quote, sort_order)
SELECT seed.name, seed.role, seed.quote, seed.sort_order
FROM (VALUES
  ('Sara Idris', 'Founder, Brickly', 'Mehroz thinks like a founder, not a vendor. He rebuilt our store, our brand, and our numbers - all at once.', 0),
  ('Omar Farooq', 'CEO, Dental Factor', 'The clarity he brought to our strategy paid for itself in the first month. Genuinely rare talent.', 1),
  ('Lina Rahman', 'Creative Lead, Rastak', 'Every deliverable felt premium. Our brand finally looks like the category leader we want to be.', 2)
) AS seed(name, role, quote, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);