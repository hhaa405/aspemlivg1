/* twbb sw twbb-auto-d9dd9b */
const VER="twbb-auto-d9dd9b";
self.addEventListener("install",event=>{
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    try{
      const keys=await caches.keys();
      await Promise.all(keys.filter(k=>k.startsWith("twbb-auto-")&&k!==VER).map(k=>caches.delete(k)));
    }catch(e){}
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET")return;
  const u=new URL(req.url);
  if(u.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    try{
      const res=await fetch(req,{cache:"no-store"});
      if(res&&res.ok){
        try{
          const cache=await caches.open(VER);
          const segs=u.pathname.split("/").filter(Boolean);const base=segs.length?segs[segs.length-1]:"";const key=(base==="payload.bin")?"payload.bin":(base==="index.html"||base===""||base==="aspemlivg1")?"index.html":req;
          await cache.put(key,res.clone());
        }catch(e){}
      }
      return res;
    }catch(e){
      try{
        const cache=await caches.open(VER);
        const hit=await cache.match(req)||await cache.match("index.html")||await cache.match("payload.bin");
        if(hit)return hit;
      }catch(e2){}
      throw e;
    }
  })());
});
