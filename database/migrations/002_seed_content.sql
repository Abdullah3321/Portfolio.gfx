INSERT INTO profiles (name, role, bio, email, location)
SELECT 'Mehroz', 'E-commerce Expert & Creative Strategist', 'I help modern brands grow through strategy, design, and e-commerce execution.', 'hello@mehrozgfx.com', 'Dubai - Working Worldwide'
WHERE NOT EXISTS (SELECT 1 FROM profiles);

INSERT INTO projects (slug, title, category, metric, description, media, status, featured, sort_order)
SELECT seed.slug, seed.title, seed.category, seed.metric, seed.description, seed.media, seed.status, seed.featured, seed.sort_order
FROM (VALUES
  ('brickly', 'Brickly', 'D2C / Home & Living', '+214% revenue in 6 months', 'Premium modular furniture storefront and growth strategy.', 'product', 'Published', TRUE, 0),
  ('dental-factor', 'Dental Factor', 'Healthcare E-commerce', '2.9x return on ad spend', 'Catalog restructuring and product detail experience for profitable scale.', 'workspace', 'Published', TRUE, 1),
  ('rastak', 'Rastak', 'Fashion & Lifestyle', '+88% conversion rate', 'Editorial brand refresh and conversion optimization program.', 'architecture', 'Published', FALSE, 2),
  ('coco-crave', 'CocoCrave', 'Food & Beverage', '3.4x AOV growth', 'Bundle strategy, subscriptions, and a repeat-purchase content engine.', 'product', 'Draft', FALSE, 3)
) AS seed(slug, title, category, metric, description, media, status, featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE projects.slug = seed.slug);

INSERT INTO services (title, description, visible, sort_order)
SELECT seed.title, seed.description, TRUE, seed.sort_order
FROM (VALUES
  ('E-commerce Strategy', 'Roadmaps that turn browsers into buyers.', 0),
  ('Shopify Management', 'Store builds and operations engineered for scale.', 1),
  ('Creative Direction', 'Editorial campaigns that keep brands cohesive.', 2),
  ('Conversion Optimization', 'Data-led improvements to conversion and lifetime value.', 3)
) AS seed(title, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM services);
