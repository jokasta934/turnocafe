import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validOrders,readOrders,validateWork,MAX_STORAGE_BYTES,MAX_ORDERS,toCSV} from '../dist/domain.js';
const order={id:'safe-id',number:1,client:'Cliente',service:'Moler',instructions:'Fino',weight:10,status:'pending',due:'2026-11-03T16:00',createdAt:'2026-11-01T10:00:00Z'};
test('tipos, claves especiales y números duplicados no llegan a la pantalla',()=>{
 for(const override of [{client:[]},{due:20261101},{status:['ready']},{instructions:'x'.repeat(2001)},{grind:'x'.repeat(151)},{weight:Infinity},{services:['Moler','Moler']},{id:'<svg/onload=alert(1)>'}])assert.equal(validOrders([{...order,...override}]),false);
 const polluted=JSON.parse(JSON.stringify(order).replace('"client":"Cliente"','"client":"Cliente","__proto__":{"polluted":true}'));
 assert.equal(validOrders([polluted]),false);assert.equal(validOrders([order,{...order,id:'another-id'}]),false);assert.equal(validOrders([order,{...order,number:2}]),false);
});
test('almacenamiento malformado o excesivo se rechaza sin sobrescribirlo',()=>{
 assert.throws(()=>readOrders('{'));assert.throws(()=>readOrders(' '.repeat(MAX_STORAGE_BYTES+1)));assert.throws(()=>readOrders(JSON.stringify([{...order,status:'unknown'}])));assert.deepEqual(readOrders(JSON.stringify([order])),[order]);assert.equal(validOrders(Array(MAX_ORDERS+1).fill(order)),false);
});
test('validación también limita instrucciones dictadas y datos programáticos',()=>{
 const work={client:'Cliente',weight:10,services:['Moler'],instructions:'',roast:'',grind:''};assert.equal(validateWork(work),'');assert.notEqual(validateWork({...work,client:'x'.repeat(101)}),'');assert.notEqual(validateWork({...work,instructions:'x'.repeat(2001)}),'');
});
test('los puntos de renderizado crean texto, sin interpretar etiquetas del cliente',()=>{
 const dom=readFileSync(new URL('../dist/dom.js',import.meta.url),'utf8');const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');assert.ok(dom.includes('textContent'));assert.ok(dom.includes('createElement'));assert.doesNotMatch(app,/\binnerHTML\b|\bouterHTML\b|\binsertAdjacentHTML\b|\beval\s*\(/);
});
test('CSP bloquea scripts ajenos, formularios de red y contenido incrustado',()=>{
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'),headers=readFileSync(new URL('../dist/_headers',import.meta.url),'utf8');for(const directive of ["script-src 'self'","form-action 'none'","object-src 'none'","base-uri 'none'"]){assert.ok(html.includes(directive));assert.ok(headers.includes(directive));}assert.ok(headers.includes("frame-ancestors 'none'"));assert.doesNotMatch(html,/unsafe-inline|unsafe-eval|javascript:/);
});
test('CSV neutraliza fórmulas incluso después de espacios y saltos',()=>{
 for(const value of ['=1+1',' +cmd','\n@sum(A1)','-1+2'])assert.ok(toCSV([{...order,client:value}]).includes('"\''+value+'"'));
});
