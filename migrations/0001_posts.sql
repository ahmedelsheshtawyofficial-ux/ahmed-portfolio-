CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  cat_en TEXT DEFAULT '', cat_ar TEXT DEFAULT '',
  title_en TEXT NOT NULL, title_ar TEXT DEFAULT '',
  desc_en TEXT DEFAULT '', desc_ar TEXT DEFAULT '',
  date_en TEXT DEFAULT '', date_ar TEXT DEFAULT '',
  url TEXT DEFAULT '#',
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_published_order ON posts(published, sort_order, id);

INSERT OR IGNORE INTO posts (slug,cat_en,cat_ar,title_en,title_ar,desc_en,desc_ar,date_en,date_ar,sort_order) VALUES
('financial-analysis-vs-accounting','Fundamentals','أساسيات','Financial Analysis vs Accounting','التحليل المالي مقابل المحاسبة','Where the two disciplines overlap, and where they genuinely differ.','أين يتقاطع التخصصان، وأين يختلفان فعليًا.','Aug 2026','أغسطس 2026',0),
('what-does-fpa-analyst-do','FP&A','FP&A','What Does an FP&A Analyst Actually Do?','ماذا يفعل محلل التخطيط والتحليل المالي (FP&A) فعليًا؟','A practical look at planning, budgeting and forecasting work.','نظرة عملية على أعمال التخطيط والموازنات والتنبؤ.','Aug 2026','أغسطس 2026',1),
('read-financial-statements','Fundamentals','أساسيات','How to Read Financial Statements','كيف تقرأ القوائم المالية','A grounded starting point for the income statement, balance sheet and cash flow.','نقطة انطلاق واضحة لقائمة الدخل والميزانية العمومية وقائمة التدفقات النقدية.','Jul 2026','يوليو 2026',2),
('understanding-financial-modeling','Modeling','النمذجة','Understanding Financial Modeling','فهم النمذجة المالية','What a model actually needs to do well, beyond the spreadsheet.','ما الذي يحتاجه النموذج فعليًا ليكون جيدًا، بعيدًا عن جدول البيانات.','Jul 2026','يوليو 2026',3),
('current-vs-deferred-tax','Tax','الضرائب','Current Tax vs Deferred Tax','الضريبة الحالية مقابل الضريبة المؤجلة','A concept explained clearly, without the jargon.','مفهوم مشروح بوضوح، بدون تعقيد.','Jun 2026','يونيو 2026',4),
('financial-ratios-business-decisions','Analysis','التحليل','How Financial Ratios Support Business Decisions','كيف تدعم النسب المالية قرارات الأعمال','Turning a ratio into an actual decision input.','تحويل النسبة المالية إلى مدخل فعلي لاتخاذ القرار.','Jun 2026','يونيو 2026',5);
