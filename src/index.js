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

const FIELDS=['slug','cat_en','cat_ar','title_en','title_ar','desc_en','desc_ar','date_en','date_ar','url','published','sort_order'];
function json(data,status=200){
  return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json;charset=utf-8','cache-control':'no-store'}});
}
function clean(body){
  const out={};
  for(const k of FIELDS) if(k in body) out[k]=k==='published'?(body[k]?1:0):k==='sort_order'?Number(body[k])||0:String(body[k]??'');
  return out;
}

async function api(request,env){
  const url=new URL(request.url);

  if(url.pathname==='/api/login' && request.method==='POST'){
    let b; try{b=await request.json()}catch{return json({error:'بيانات غير صالحة'},400)}
    if(!env.ADMIN_PASSWORD||b.password!==env.ADMIN_PASSWORD)return json({error:'كلمة المرور غير صحيحة'},401);
    if(!env.ADMIN_SECRET)return json({error:'ADMIN_SECRET غير مضبوط في Cloudflare'},500);
    const c=await makeCookie(env.ADMIN_SECRET);
    return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','set-cookie':setCookie(c)}});
  }

  if(url.pathname==='/api/logout' && request.method==='POST'){
    return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','set-cookie':clearCookie()}});
  }

  if(url.pathname==='/api/me' && request.method==='GET'){
    return json({authenticated:await validCookie(request,env.ADMIN_SECRET)});
  }

  if(url.pathname==='/api/posts'){
    const isAdmin=await validCookie(request,env.ADMIN_SECRET);
    if(request.method==='GET'){
      const q=isAdmin?'SELECT * FROM posts ORDER BY sort_order ASC,id ASC':'SELECT * FROM posts WHERE published=1 ORDER BY sort_order ASC,id ASC';
      const {results}=await env.DB.prepare(q).all();
      return json(results||[]);
    }
    if(!isAdmin)return json({error:'غير مصرح'},401);

    if(request.method==='POST'){
      let body; try{body=await request.json()}catch{return json({error:'JSON غير صالح'},400)}
      const d=clean(body);
      if(!d.slug||!d.title_en)return json({error:'Slug و Title EN مطلوبان'},400);
      try{
        const r=await env.DB.prepare(`INSERT INTO posts (${Object.keys(d).join(',')}) VALUES (${Object.keys(d).map(k=>'?').join(',')})`).bind(...Object.values(d)).run();
        return json({id:r.meta.last_row_id,...d},201);
      }catch(e){return json({error:String(e.message||e)},400)}
    }

    if(request.method==='PUT'){
      let body; try{body=await request.json()}catch{return json({error:'JSON غير صالح'},400)}
      const id=Number(body.id); if(!id)return json({error:'ID مطلوب'},400);
      const d=clean(body); delete d.id;
      if(!Object.keys(d).length)return json({error:'لا توجد تغييرات'},400);
      try{
        const r=await env.DB.prepare(`UPDATE posts SET ${Object.keys(d).map(k=>`${k}=?`).join(',')} WHERE id=?`).bind(...Object.values(d),id).run();
        return json({ok:!!r.meta.changes});
      }catch(e){return json({error:String(e.message||e)},400)}
    }

    if(request.method==='DELETE'){
      const id=Number(url.searchParams.get('id')); if(!id)return json({error:'ID مطلوب'},400);
      const r=await env.DB.prepare('DELETE FROM posts WHERE id=?').bind(id).run();
      return json({ok:!!r.meta.changes});
    }
  }

  return json({error:'Not Found'},404);
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname.startsWith('/api/')) return api(request,env);
    return env.ASSETS.fetch(request);
  }
};
