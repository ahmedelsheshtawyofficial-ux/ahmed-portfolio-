# موقع أحمد — Cloudflare فقط (بدون Supabase)

هذه النسخة تستخدم Cloudflare Pages + Pages Functions + D1 فقط.
لا يوجد Supabase ولا Node.js مطلوب بعد النشر.

## ماذا يدير الأدمن؟
- إضافة / تعديل / حذف Status / Insights.
- نشر أو إخفاء أي Status.
- عربي + English.
- ترتيب المنشورات والروابط والتواريخ.

## النشر المجاني
1. أنشئ حساب Cloudflare مجاني.
2. أنشئ D1 Database باسم `ahmed-portfolio-db`.
3. نفّذ ملف `migrations/0001_posts.sql` في D1 SQL Editor.
4. ارفع المشروع إلى GitHub.
5. أنشئ Cloudflare Pages project من GitHub.
6. اجعل build command فارغًا وBuild output directory = `.`.
7. أضف D1 binding باسم `DB` إلى قاعدة البيانات.
8. أضف Secrets/Variables:
   - `ADMIN_PASSWORD` = كلمة مرور الأدمن
   - `ADMIN_SECRET` = قيمة عشوائية طويلة جدًا (32+ حرفًا)
9. أعد النشر.

لوحة التحكم: `/admin.html`

مهم: المجاني ليس ضمانًا أبديًا. حاليًا Cloudflare يوفّر Workers Free وD1 Free، لكن توجد حدود استخدام يومية. إذا تجاوزت الحد اليومي، تتوقف طلبات قاعدة البيانات حتى إعادة الضبط؛ البيانات لا تُحذف. راجع حدود Cloudflare قبل الاعتماد التجاري.
