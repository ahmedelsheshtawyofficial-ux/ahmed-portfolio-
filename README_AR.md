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
- الصور تقبل روابط مباشرة حاليًا؛ رفع ملفات حقيقي يمكن إضافته لاحقًا عبر Google Drive إذا لزم.


### V6 إضافات
- تحكم كامل في هوية الموقع: Brand Mark وLoader وFavicon وPortrait.
- تحكم في Browser Title وMeta Description وAccent Color وتفعيل/تعطيل animations.
- تحكم في روابط وظهور Email / LinkedIn / WhatsApp / Facebook.
- تحكم في رابط وزر View More on LinkedIn.
- استعادة تأثير FMVA® البرتقالي الكبير في بطاقة الشهادة مع watermark ديناميكي.
- الصورة الشخصية الجديدة موجودة افتراضيًا في `/assets/profile.png`.
- جميع الـ animations والـ layout الأصلية محفوظة، والتعديلات كلها من لوحة التحكم.

## V23 — أقسام الموقع وترتيبها
- إضافة قسم جديد من لوحة التحكم من خلال **Sections & Layout**.
- ترتيب أقسام الصفحة الرئيسية لأعلى/لأسفل وحفظ الترتيب في `site.section_order`.
- يدعم القسم الجديد عنوانًا ووصفًا ومحتوى وصورة وزرًا وخلفية اختيارية.
- الأقسام الأساسية لا تُحذف من الموقع؛ يمكن فقط إعادة ترتيبها.
- إدارة أقسام الموقع مستقلة عن ترتيب عناصر قائمة الـ Navigation.


## رفع الملفات من لوحة التحكم (Google Drive)
هذه النسخة تضيف رفع ملفات Excel / PDF / صور من داخل تعديل المشروع. يلزم إنشاء Cloudflare Google Drive bucket مرة واحدة باسم `ahmed-portfolio-media` ثم Deploy. الـ Worker مربوط باسم `MEDIA` ويخزن الملفات في `/media/...`.

بعد إنشاء الـ bucket، ارفع المشروع كالمعتاد. من لوحة التحكم > المشاريع > تعديل/إضافة مشروع ستجد قسم **رفع ملفات المشروع**، ويمكن اختيار عدة ملفات دفعة واحدة. الروابط تُضاف تلقائيًا إلى حقول Additional Model/Dashboard Media URLs.

- تمت إضافة قسم «🛠️ الأدوات» داخل لوحة الأدمن فقط لحفظ روابط الخدمات والأدوات مثل Files.ink.
- روابط ملفات المشاريع أصبحت عامة (External Files) بدل ربطها بخدمة واحدة.

### V27
- قسم «🛠️ الأدوات» موجود داخل لوحة الأدمن فقط، ومحمِي بتسجيل الدخول، مع Files.ink مضاف مسبقًا ويمكن إضافة روابط أخرى وتعديلها وحذفها.
- روابط ملفات المشاريع أصبحت عامة (External Files) بدل ربطها بخدمة واحدة.
