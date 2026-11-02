// This server serves a fixed asset list only; it has no write API or session store.
export function createHandler(assets, securityHeaders){
 return {
  async fetch(request){
   const headers=new Headers(securityHeaders);
   headers.set('Cache-Control','no-store');
   let url;
   try{url=new URL(request.url);}catch{return new Response('Bad request',{status:400,headers});}
   if(url.protocol!=='https:'&&!['localhost','127.0.0.1','[::1]'].includes(url.hostname)){
    url.protocol='https:';headers.set('Location',url.href);return new Response(null,{status:308,headers});
   }
   if(!['GET','HEAD'].includes(request.method)){
    headers.set('Allow','GET, HEAD');return new Response(request.method==='HEAD'?null:'Method not allowed',{status:405,headers});
   }
   const path=url.pathname==='/'?'/index.html':url.pathname;
   if(!Object.hasOwn(assets,path))return new Response(request.method==='HEAD'?null:'Not found',{status:404,headers});
   const asset=assets[path];headers.set('Content-Type',asset.type);
   return new Response(request.method==='HEAD'?null:asset.body,{status:200,headers});
  }
 };
}
