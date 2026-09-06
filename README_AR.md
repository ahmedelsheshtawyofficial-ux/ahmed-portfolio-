# Ahmed Elsheshtawy — Full Website CMS

هذه النسخة توسّع لوحة التحكم لتشمل الموقع بالكامل مع الحفاظ على تصميم الموقع وتأثيراته الحالية.

## الأقسام القابلة للإدارة
- Projects
- Videos
- Insights / Status
- What I Work On
- My Approach
- Skills & Tools
- Learning & Development / Certifications
- Page Content (Home / About / Work / Videos / Approach / Skills / Certifications / Insights / Brand / Contact / Footer)
- Navigation
- Contact & Social / Portrait / Favicon

## الدخول
Secrets المطلوبة في Cloudflare: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SECRET`.

## النشر
Cloudflare Worker + Static Assets + D1. استخدم `npx wrangler deploy`.

## ملاحظات
- الجداول الجديدة يتم إنشاؤها تلقائيًا عند أول طلب API.
- البيانات القديمة للمشاريع والفيديوهات يتم الحفاظ عليها.
- لا حاجة لتشغيل migration يدويًا لهذه النسخة، لكن ملف migration يمكن الاحتفاظ به في المستودع كمرجع.
- الصور تقبل روابط مباشرة حاليًا؛ رفع ملفات حقيقي يمكن إضافته لاحقًا عبر R2 إذا لزم.


### V6 إضافات
- تحكم كامل في هوية الموقع: Brand Mark وLoader وFavicon وPortrait.
- تحكم في Browser Title وMeta Description وAccent Color وتفعيل/تعطيل animations.
- تحكم في روابط وظهور Email / LinkedIn / WhatsApp / Facebook.
- تحكم في رابط وزر View More on LinkedIn.
- استعادة تأثير FMVA® البرتقالي الكبير في بطاقة الشهادة مع watermark ديناميكي.
- الصورة الشخصية الجديدة موجودة افتراضيًا في `/assets/profile.png`.
- جميع الـ animations والـ layout الأصلية محفوظة، والتعديلات كلها من لوحة التحكم.
