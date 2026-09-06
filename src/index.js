const enc = new TextEncoder();
const COOKIE = 'ahmed_admin';

function b64(bytes){
  let s=''; for(const b of bytes) s+=String.fromCharCode(b);
  return btoa(s).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
}
function unb64(s){
  s=s.replaceAll('-','+').replaceAll('_','/');
  while(s.length%4)s+='=';
  const bin=atob(s);
  return Uint8Array.from(bin,c=>c.charCodeAt(0));
}
async function key(secret){
  return crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
}
async function sign(value,secret){
  return b64(new Uint8Array(await crypto.subtle.sign('HMAC',await key(secret),enc.encode(value))));
}
async function makeCookie(secret){
  const value=`${Date.now()}.${crypto.randomUUID()}`;
  return `${value}.${await sign(value,secret)}`;
}
async function validCookie(request,secret){
  if(!secret)return false;
  const m=request.headers.get('Cookie')?.match(new RegExp(`${COOKIE}=([^;]+)`));
  if(!m)return false;
  const parts=m[1].split('.');
  if(parts.length<3)return false;
  const value=parts.slice(0,2).join('.');
  const ts=Number(parts[0]);
  if(!Number.isFinite(ts)||Date.now()-ts>1000*60*60*24*7)return false;
  return crypto.subtle.verify('HMAC',await key(secret),unb64(parts[2]),enc.encode(value));
}
function setCookie(value){return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`}
function clearCookie(){return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json;charset=utf-8','cache-control':'no-store'}})}

const POST_FIELDS=['slug','cat_en','cat_ar','title_en','title_ar','desc_en','desc_ar','date_en','date_ar','url','published','sort_order'];
const PROJECT_FIELDS=['slug','cat_en','cat_ar','title_en','title_ar','desc_en','desc_ar','tags','model_url','dashboard_url','overview_en','overview_ar','problem_en','problem_ar','objective_en','objective_ar','data_en','data_ar','analysis_en','analysis_ar','findings_en','findings_ar','lessons_en','lessons_ar','published','sort_order'];
const VIDEO_FIELDS=['slug','category_en','category_ar','title_en','title_ar','desc_en','desc_ar','url','thumbnail_url','duration','published','sort_order'];

function clean(body,fields){
  const out={};
  for(const k of fields) if(k in body) out[k]=k==='published'?(body[k]?1:0):k==='sort_order'?Number(body[k])||0:String(body[k]??'');
  return out;
}

async function ensureTables(env){
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS cms_meta (key TEXT PRIMARY KEY, value TEXT DEFAULT '')`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE,
      cat_en TEXT DEFAULT '', cat_ar TEXT DEFAULT '', title_en TEXT NOT NULL, title_ar TEXT DEFAULT '',
      desc_en TEXT DEFAULT '', desc_ar TEXT DEFAULT '', tags TEXT DEFAULT '', model_url TEXT DEFAULT '', dashboard_url TEXT DEFAULT '',
      overview_en TEXT DEFAULT '', overview_ar TEXT DEFAULT '', problem_en TEXT DEFAULT '', problem_ar TEXT DEFAULT '',
      objective_en TEXT DEFAULT '', objective_ar TEXT DEFAULT '', data_en TEXT DEFAULT '', data_ar TEXT DEFAULT '',
      analysis_en TEXT DEFAULT '', analysis_ar TEXT DEFAULT '', findings_en TEXT DEFAULT '', findings_ar TEXT DEFAULT '',
      lessons_en TEXT DEFAULT '', lessons_ar TEXT DEFAULT '', published INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE,
      category_en TEXT DEFAULT '', category_ar TEXT DEFAULT '', title_en TEXT NOT NULL, title_ar TEXT DEFAULT '',
      desc_en TEXT DEFAULT '', desc_ar TEXT DEFAULT '', url TEXT DEFAULT '', thumbnail_url TEXT DEFAULT '', duration TEXT DEFAULT '',
      published INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0
    )`)
  ]);

  const seeded=await env.DB.prepare("SELECT value FROM cms_meta WHERE key='seed_v2'").first();
  if(!seeded){
    const projects=[
      ['p1','Financial Analysis · Case Study','التحليل المالي · دراسة حالة','Financial Performance Analysis','تحليل الأداء المالي','Analyzing revenue, expenses, profitability and key financial performance indicators to understand the company\'s financial position.','تحليل الإيرادات والمصروفات والربحية ومؤشرات الأداء المالي الرئيسية لفهم الوضع المالي للشركة.','Revenue Analysis,Profitability,KPIs,Financial Statements','assets/projects/financial-performance-model.png','assets/projects/financial-performance-dashboard.png','A structured analysis of a company\'s financial performance across two fiscal years, focused on revenue, cost behaviour and profitability.','تحليل منظم لأداء شركة مالياً على مدار سنتين ماليتين، يركّز على الإيرادات وسلوك التكاليف والربحية.','Understanding what is actually driving changes in profitability, beyond the headline revenue number.','فهم ما يقود التغيرات الفعلية في الربحية، بعيدًا عن رقم الإيرادات الإجمالي وحده.','Build a clear, evidence-based picture of financial performance to support decision-making.','بناء صورة واضحة وقائمة على الأدلة للأداء المالي لدعم اتخاذ القرار.','Publicly available financial statements and reasonable assumptions where data was incomplete.','قوائم مالية متاحة للعموم وافتراضات معقولة حيثما كانت البيانات غير مكتملة.','Revenue trends, gross margin, operating expense ratios and EBITDA margin were reviewed year over year.','تمت مراجعة اتجاهات الإيرادات وهامش الربح الإجمالي ونسب المصروفات التشغيلية وهامش EBITDA سنة بعد أخرى.','Margin movement was driven more by cost structure than by revenue growth — the kind of detail a top-line view alone would miss.','تبيّن أن حركة الهامش كانت مدفوعة بهيكل التكاليف أكثر من نمو الإيرادات — وهو تفصيل قد تفوته النظرة السطحية للأرقام.','Reinforced the importance of decomposing performance into its underlying drivers rather than reading summary metrics at face value.','أكّد على أهمية تفكيك الأداء إلى محركاته الأساسية بدلًا من الاكتفاء بقراءة المؤشرات الملخصة.',1,1],
      ['p2','Financial Modeling · Case Study','النمذجة المالية · دراسة حالة','STC Financial Analysis & Modeling','تحليل ونمذجة STC المالية','A practical case study focused on analyzing financial performance and building a structured financial model.','دراسة حالة عملية تركّز على تحليل الأداء المالي وبناء نموذج مالي منظم.','Financial Modeling,Forecasting,Scenario Analysis,Excel','assets/projects/stc-financial-model.png','assets/projects/stc-dashboard.png','A practical case study combining financial statement analysis with a structured forecasting model.','دراسة حالة عملية تجمع بين تحليل القوائم المالية وبناء نموذج تنبؤ منظم.','Translating historical financial performance into a credible forward-looking view.','ترجمة الأداء المالي التاريخي إلى رؤية مستقبلية موثوقة.','Build a base-case and upside scenario to understand sensitivity to key assumptions.','بناء سيناريو أساسي وآخر تفاؤلي لفهم حساسية النموذج تجاه الافتراضات الرئيسية.','Historical financials and a defined set of growth, margin and capex assumptions.','بيانات مالية تاريخية ومجموعة محددة من افتراضات النمو والهامش والإنفاق الرأسمالي.','Scenario analysis was used to stress-test how changes in growth and margin assumptions affect outcomes.','تم استخدام تحليل السيناريوهات لاختبار تأثير التغيرات في افتراضات النمو والهامش على النتائج.','Small changes in margin assumptions had a larger effect on outcomes than equivalent changes in growth — useful for prioritising which assumptions deserve the most scrutiny.','التغيرات الصغيرة في افتراضات الهامش كان لها تأثير أكبر على النتائج مقارنة بتغيرات مماثلة في النمو — وهو أمر مفيد لتحديد الافتراضات التي تستحق تدقيقًا أكبر.','Learned to prioritise time on the assumptions that actually move the model, not the ones that feel most intuitive to adjust.','تعلمت كيفية إعطاء الأولوية للافتراضات التي تحرك النموذج فعليًا، وليس تلك التي يبدو تعديلها بديهيًا أكثر.',1,2],
      ['p3','3-Statement Modeling · Case Study','نمذجة القوائم الثلاث · دراسة حالة','Financial Modeling Case','حالة نمذجة مالية','Building a financial model from historical data and using assumptions to develop forward-looking projections.','بناء نموذج مالي من بيانات تاريخية واستخدام الافتراضات لتطوير توقعات مستقبلية.','3-Statement Model,Forecasting,Assumptions,Scenario Analysis','assets/projects/three-statement-model.png','assets/projects/model-dashboard.png','A 3-statement financial model built from historical data, linking the income statement, balance sheet and cash flow statement.','نموذج مالي بالقوائم الثلاث مبني من بيانات تاريخية، يربط قائمة الدخل والميزانية العمومية وقائمة التدفقات النقدية.','Producing a set of forward-looking projections that remain internally consistent across all three statements.','إنتاج مجموعة من التوقعات المستقبلية تظل متسقة داخليًا عبر القوائم الثلاث جميعها.','Build a working 3-statement model with clearly stated assumptions and scenario flexibility.','بناء نموذج قوائم ثلاث فعّال بافتراضات واضحة ومرونة في السيناريوهات.','Historical financial statements and a documented set of forecasting assumptions.','قوائم مالية تاريخية ومجموعة موثقة من افتراضات التنبؤ.','Assumptions were built for revenue growth, working capital and capital expenditure, then flowed through all three statements.','بُنيت الافتراضات لنمو الإيرادات ورأس المال العامل والإنفاق الرأسمالي، ثم تم تمريرها عبر القوائم الثلاث جميعها.','Keeping the balance sheet balanced end-to-end required careful handling of the cash flow statement and circularity between interest and debt.','تطلّب الحفاظ على توازن الميزانية العمومية من البداية للنهاية معالجة دقيقة لقائمة التدفقات النقدية والدائرية بين الفوائد والديون.','Gained a much clearer understanding of how the three statements are mechanically connected, not just conceptually.','اكتسبت فهمًا أوضح بكثير لكيفية ارتباط القوائم الثلاث ميكانيكيًا، وليس فقط من الناحية المفاهيمية.',1,3]
    ];
    const sql=`INSERT INTO projects (slug,cat_en,cat_ar,title_en,title_ar,desc_en,desc_ar,tags,model_url,dashboard_url,overview_en,overview_ar,problem_en,problem_ar,objective_en,objective_ar,data_en,data_ar,analysis_en,analysis_ar,findings_en,findings_ar,lessons_en,lessons_ar,published,sort_order) VALUES (${Array(26).fill('?').join(',')})`;
    for(const x of projects) await env.DB.prepare(sql).bind(...x).run();
    await env.DB.prepare("INSERT OR REPLACE INTO cms_meta (key,value) VALUES ('seed_v2','1')").run();
  }
  const vCount=await env.DB.prepare('SELECT COUNT(*) AS n FROM videos').first();
  if(!vCount?.n){
    const videos=[
      ['v1','Financial Analysis Case Study','دراسة حالة في التحليل المالي','How I Analyze a Company\'s Financial Performance','كيف أحلل الأداء المالي لشركة ما','Walking through revenue, margin and KPI analysis step by step.','شرح خطوة بخطوة لتحليل الإيرادات والهوامش ومؤشرات الأداء.','', '', '08:12',1,1],
      ['v2','Financial Modeling','النمذجة المالية','Building a Financial Model from Scratch','بناء نموذج مالي من الصفر','A structured approach to assumptions, drivers and outputs.','منهج منظم للافتراضات والمحركات والمخرجات.','', '', '14:30',1,2],
      ['v3','FP&A','التخطيط والتحليل المالي','Budget vs Actual Analysis Explained','شرح تحليل الموازنة مقابل الفعلي','Understanding variances and what they mean for the business.','فهم الانحرافات وما تعنيه بالنسبة للأعمال.','', '', '06:47',1,3],
      ['v4','Finance Concepts','مفاهيم مالية','Current Tax vs Deferred Tax','الضريبة الحالية مقابل الضريبة المؤجلة','Breaking down a concept that trips up a lot of analysts.','تفكيك مفهوم كثيرًا ما يُربك المحللين.','', '', '',1,4]
    ];
    const sql=`INSERT INTO videos (slug,category_en,category_ar,title_en,title_ar,desc_en,desc_ar,url,thumbnail_url,duration,published,sort_order) VALUES (${Array(12).fill('?').join(',')})`;
    for(const x of videos) await env.DB.prepare(sql).bind(...x).run();
  }
}

async function collectionApi(request,env,kind){
  const isAdmin=await validCookie(request,env.ADMIN_SECRET);
  const config=kind==='projects'?{table:'projects',fields:PROJECT_FIELDS,title:'Project'}:{table:'videos',fields:VIDEO_FIELDS,title:'Video'};
  if(request.method==='GET'){
    const q=isAdmin?`SELECT * FROM ${config.table} ORDER BY sort_order ASC,id ASC`:`SELECT * FROM ${config.table} WHERE published=1 ORDER BY sort_order ASC,id ASC`;
    const {results}=await env.DB.prepare(q).all(); return json(results||[]);
  }
  if(!isAdmin)return json({error:'غير مصرح'},401);
  if(request.method==='POST'){
    let body; try{body=await request.json()}catch{return json({error:'JSON غير صالح'},400)}
    const d=clean(body,config.fields); if(!d.slug||!d.title_en)return json({error:'Slug و Title EN مطلوبان'},400);
    try{const r=await env.DB.prepare(`INSERT INTO ${config.table} (${Object.keys(d).join(',')}) VALUES (${Object.keys(d).map(()=>'?').join(',')})`).bind(...Object.values(d)).run();return json({id:r.meta.last_row_id,...d},201)}catch(e){return json({error:String(e.message||e)},400)}
  }
  if(request.method==='PUT'){
    let body; try{body=await request.json()}catch{return json({error:'JSON غير صالح'},400)}
    const id=Number(body.id); if(!id)return json({error:'ID مطلوب'},400); const d=clean(body,config.fields); delete d.id;
    if(!Object.keys(d).length)return json({error:'لا توجد تغييرات'},400);
    try{const r=await env.DB.prepare(`UPDATE ${config.table} SET ${Object.keys(d).map(k=>`${k}=?`).join(',')} WHERE id=?`).bind(...Object.values(d),id).run();return json({ok:!!r.meta.changes})}catch(e){return json({error:String(e.message||e)},400)}
  }
  if(request.method==='DELETE'){
    const id=Number(new URL(request.url).searchParams.get('id')); if(!id)return json({error:'ID مطلوب'},400);
    const r=await env.DB.prepare(`DELETE FROM ${config.table} WHERE id=?`).bind(id).run(); return json({ok:!!r.meta.changes});
  }
  return json({error:'Method Not Allowed'},405);
}

async function api(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/login'&&request.method==='POST'){
    let b;try{b=await request.json()}catch{return json({error:'بيانات غير صالحة'},400)}
    if(!env.ADMIN_USERNAME||!env.ADMIN_PASSWORD)return json({error:'بيانات دخول الأدمن غير مكتملة في Cloudflare'},500);
    if(b.username!==env.ADMIN_USERNAME||b.password!==env.ADMIN_PASSWORD)return json({error:'اسم المستخدم أو كلمة المرور غير صحيحة'},401);
    if(!env.ADMIN_SECRET)return json({error:'ADMIN_SECRET غير مضبوط في Cloudflare'},500);
    const c=await makeCookie(env.ADMIN_SECRET);return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','set-cookie':setCookie(c)}});
  }
  if(url.pathname==='/api/logout'&&request.method==='POST')return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','set-cookie':clearCookie()}});
  if(url.pathname==='/api/me'&&request.method==='GET')return json({authenticated:await validCookie(request,env.ADMIN_SECRET)});
  if(['/api/projects','/api/videos'].includes(url.pathname)){
    await ensureTables(env);
    return collectionApi(request,env,url.pathname==='/api/projects'?'projects':'videos');
  }
  if(url.pathname==='/api/posts'){
    const isAdmin=await validCookie(request,env.ADMIN_SECRET);
    if(request.method==='GET'){const q=isAdmin?'SELECT * FROM posts ORDER BY sort_order ASC,id ASC':'SELECT * FROM posts WHERE published=1 ORDER BY sort_order ASC,id ASC';const {results}=await env.DB.prepare(q).all();return json(results||[])}
    if(!isAdmin)return json({error:'غير مصرح'},401);
    if(request.method==='POST'){let body;try{body=await request.json()}catch{return json({error:'JSON غير صالح'},400)}const d=clean(body,POST_FIELDS);if(!d.slug||!d.title_en)return json({error:'Slug و Title EN مطلوبان'},400);try{const r=await env.DB.prepare(`INSERT INTO posts (${Object.keys(d).join(',')}) VALUES (${Object.keys(d).map(()=>'?').join(',')})`).bind(...Object.values(d)).run();return json({id:r.meta.last_row_id,...d},201)}catch(e){return json({error:String(e.message||e)},400)}}
    if(request.method==='PUT'){let body;try{body=await request.json()}catch{return json({error:'JSON غير صالح'},400)}const id=Number(body.id);if(!id)return json({error:'ID مطلوب'},400);const d=clean(body,POST_FIELDS);delete d.id;if(!Object.keys(d).length)return json({error:'لا توجد تغييرات'},400);try{const r=await env.DB.prepare(`UPDATE posts SET ${Object.keys(d).map(k=>`${k}=?`).join(',')} WHERE id=?`).bind(...Object.values(d),id).run();return json({ok:!!r.meta.changes})}catch(e){return json({error:String(e.message||e)},400)}}
    if(request.method==='DELETE'){const id=Number(url.searchParams.get('id'));if(!id)return json({error:'ID مطلوب'},400);const r=await env.DB.prepare('DELETE FROM posts WHERE id=?').bind(id).run();return json({ok:!!r.meta.changes})}
  }
  return json({error:'Not Found'},404);
}

export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return api(request,env);return env.ASSETS.fetch(request);}};
