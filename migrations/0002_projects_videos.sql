-- Projects and Videos tables. The Worker also creates/seeds these automatically on first API request.
CREATE TABLE IF NOT EXISTS cms_meta (key TEXT PRIMARY KEY, value TEXT DEFAULT '');
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  cat_en TEXT DEFAULT '', cat_ar TEXT DEFAULT '',
  title_en TEXT NOT NULL, title_ar TEXT DEFAULT '',
  desc_en TEXT DEFAULT '', desc_ar TEXT DEFAULT '',
  tags TEXT DEFAULT '', model_url TEXT DEFAULT '', dashboard_url TEXT DEFAULT '',
  overview_en TEXT DEFAULT '', overview_ar TEXT DEFAULT '',
  problem_en TEXT DEFAULT '', problem_ar TEXT DEFAULT '',
  objective_en TEXT DEFAULT '', objective_ar TEXT DEFAULT '',
  data_en TEXT DEFAULT '', data_ar TEXT DEFAULT '',
  analysis_en TEXT DEFAULT '', analysis_ar TEXT DEFAULT '',
  findings_en TEXT DEFAULT '', findings_ar TEXT DEFAULT '',
  lessons_en TEXT DEFAULT '', lessons_ar TEXT DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  category_en TEXT DEFAULT '', category_ar TEXT DEFAULT '',
  title_en TEXT NOT NULL, title_ar TEXT DEFAULT '',
  desc_en TEXT DEFAULT '', desc_ar TEXT DEFAULT '',
  url TEXT DEFAULT '', thumbnail_url TEXT DEFAULT '', duration TEXT DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0
);
