import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHandler} from '../worker/index.js';
const headers=Object.fromEntries(readFileSync(new URL('../dist/_headers',import.meta.url),'utf8').split('\n').filter(line=>line.startsWith('  ')).map(line=>{const n=line.indexOf(':');return [line.slice(0,n).trim(),line.slice(n+1).trim()];}));
const worker=createHandler({'/index.html':{type:'text/html; charset=utf-8',body:'Safe page'}},headers);
test('encabezados HTTP reales en éxito, errores y formularios rechazados',async()=>{
 for(const [path,method,status] of [['/','GET',200],['/missing','GET',404],['/','POST',405],['/.env','GET',404],['/.openai/hosting.json','GET',404]]){
  const response=await worker.fetch(new Request('https://example.test'+path,{method}));assert.equal(response.status,status);assert.equal(response.headers.get('X-Content-Type-Options'),'nosniff');assert.equal(response.headers.get('X-Frame-Options'),'DENY');assert.equal(response.headers.get('Strict-Transport-Security'),'max-age=31536000');assert.ok(response.headers.get('Content-Security-Policy').includes("frame-ancestors 'none'"));assert.ok(response.headers.get('Permissions-Policy').includes('microphone=(self)'));
 }
});
test('HTTPS obligatorio en publicación y HEAD sin cuerpo',async()=>{
 const redirect=await worker.fetch(new Request('http://example.test/'));assert.equal(redirect.status,308);assert.equal(redirect.headers.get('Location'),'https://example.test/');
 const head=await worker.fetch(new Request('https://example.test/',{method:'HEAD'}));assert.equal(await head.text(),'');assert.equal(head.status,200);
});
