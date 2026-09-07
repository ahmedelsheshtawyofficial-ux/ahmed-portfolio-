CREATE TABLE IF NOT EXISTS admin_tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT DEFAULT '',
  url TEXT NOT NULL,
  description_en TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO admin_tools (slug,name_en,name_ar,url,description_en,description_ar,sort_order)
VALUES ('files-ink','Files.ink','Files.ink','https://files.ink/','Free file hosting / direct links','استضافة ملفات مجانية / روابط مباشرة',1);
