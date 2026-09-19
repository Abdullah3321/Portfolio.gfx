ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS contact_title TEXT NOT NULL DEFAULT 'Let''s talk about your brand.',
  ADD COLUMN IF NOT EXISTS contact_intro TEXT NOT NULL DEFAULT 'Tell me where you are and where you want to be. I usually reply within 24 hours.',
  ADD COLUMN IF NOT EXISTS contact_response_time TEXT NOT NULL DEFAULT 'Usually within 24 hours',
  ADD COLUMN IF NOT EXISTS contact_location TEXT NOT NULL DEFAULT 'Dubai - Working Worldwide',
  ADD COLUMN IF NOT EXISTS about_intro TEXT NOT NULL DEFAULT 'I help modern brands grow through strategy, design, and e-commerce execution.',
  ADD COLUMN IF NOT EXISTS about_detail TEXT NOT NULL DEFAULT 'The best work sits at the intersection of a sharp point of view and a commercial outcome.',
  ADD COLUMN IF NOT EXISTS about_proof TEXT NOT NULL DEFAULT 'From first sketch to post-launch optimization, I stay close to the details that make a brand feel considered and perform.',
  ADD COLUMN IF NOT EXISTS services_intro TEXT NOT NULL DEFAULT 'Engagements are shaped around your goals. Below is the full range of ways I plug into a brand.',
  ADD COLUMN IF NOT EXISTS portfolio_intro TEXT NOT NULL DEFAULT 'A selection of brands scaled through strategy, design and e-commerce.',
  ADD COLUMN IF NOT EXISTS case_studies_intro TEXT NOT NULL DEFAULT 'A closer look at the strategy, execution and outcomes behind selected engagements.',
  ADD COLUMN IF NOT EXISTS experience_intro TEXT NOT NULL DEFAULT 'Seven years of experience scaling D2C brands across agencies, studios and direct founder partnerships.';
