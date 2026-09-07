CREATE TABLE IF NOT EXISTS custom_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  label_en TEXT DEFAULT '',
  label_ar TEXT DEFAULT '',
  title_en TEXT NOT NULL,
  title_ar TEXT DEFAULT '',
  desc_en TEXT DEFAULT '',
  desc_ar TEXT DEFAULT '',
  content_en TEXT DEFAULT '',
  content_ar TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  cta_label_en TEXT DEFAULT '',
  cta_label_ar TEXT DEFAULT '',
  cta_url TEXT DEFAULT '',
  background TEXT DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);
