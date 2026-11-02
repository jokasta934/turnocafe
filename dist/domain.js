export const STORAGE_KEY='turnocafe.orders.v1';
export const statuses={pending:'Pendiente',ready:'Listo para retirar',delivered:'Entregado'};
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function isLate(order,now=new Date()){return order.status!=='delivered'&&new Date(order.due).getTime()<now.getTime();}
export function isToday(order,now=new Date()){return new Date(order.due).toDateString()===now.toDateString();}
export function nextNumber(orders){return Math.max(0,...orders.map(o=>o.number))+1;}
export const bagOptions=['Transparente de libra','Negra de libra','Negra pequeña','Plateada de kilo'];
export const serviceOptions=['Tostar','Moler','Empaquetar','Otro servicio'];
export function getServices(order){
  if(Array.isArray(order.services))return order.services;
  if(order.service==='Tostar y moler')return ['Tostar','Moler'];
  return serviceOptions.includes(order.service)?[order.service]:['Otro servicio'];
}
export function serviceLabel(services){return services.join(' + ');}
export const MAX_ORDERS=2000;
export const MAX_STORAGE_BYTES=3000000;
const forbiddenKeys=new Set(['__proto__','constructor','prototype']);
const text=(value,max,required=false)=>typeof value==='string'&&value.length<=max&&(!required||value.trim().length>0)&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null)&&!Object.keys(value).some(key=>forbiddenKeys.has(key));
const date=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?$/.test(value)&&Number.isFinite(Date.parse(value));
const services=value=>Array.isArray(value)&&value.length>0&&value.length<=serviceOptions.length&&new Set(value).size===value.length&&value.every(s=>typeof s==='string'&&serviceOptions.includes(s));
const grams=value=>Number.isSafeInteger(value)&&value>=1&&value<=100000;
export function validateWork({client,weight,services:selected,packaging,instructions,roast='',grind=''}){
  if(client!==undefined&&!text(client,100,true))return 'Indica un nombre de cliente de hasta 100 caracteres.';
  if(!Number.isFinite(weight)||weight<=0||weight>100000)return 'Indica el peso total recibido en kilos.';
  if(!services(selected))return 'Selecciona al menos un servicio, sin repetir opciones.';
  if(!text(instructions,2000)||!text(roast,150)||!text(grind,150))return 'Revisa las instrucciones (máximo 2000 caracteres) y las especificaciones (máximo 150).';
  if(selected.includes('Empaquetar')){
    if(!object(packaging)||!text(packaging.bagType,150,true))return 'Indica qué tipo de funda eligió el cliente (máximo 150 caracteres).';
    if(!grams(packaging.gramsPerBag))return 'Indica el peso de cada funda en gramos enteros (mínimo 1 g).';
    if(!text(packaging.presentation,200))return 'Las indicaciones de empaque admiten hasta 200 caracteres.';
  }
  if(selected.includes('Otro servicio')&&!instructions.trim())return 'Describe el otro servicio en las instrucciones.';
  return '';
}
export function validOrders(data){
 if(!Array.isArray(data)||data.length>MAX_ORDERS)return false;
 const ids=new Set(),numbers=new Set();
 return data.every(o=>{
  if(!object(o)||!text(o.id,100,true)||!/^[A-Za-z0-9-]+$/.test(o.id)||ids.has(o.id)||!Number.isSafeInteger(o.number)||o.number<1||numbers.has(o.number))return false;
  ids.add(o.id);numbers.add(o.number);
  if(!text(o.client,100,true)||!text(o.service,100,true)||!text(o.instructions,2000)||!date(o.createdAt)||!date(o.due)||typeof o.status!=='string'||!Object.hasOwn(statuses,o.status))return false;
  if(o.weight!==null&&(!Number.isFinite(o.weight)||o.weight<=0||o.weight>100000))return false;
  if(o.services!==undefined&&!services(o.services))return false;
  if(o.roast!==undefined&&!text(o.roast,150)||o.grind!==undefined&&!text(o.grind,150))return false;
  if(o.readyAt!==undefined&&!date(o.readyAt)||o.deliveredAt!==undefined&&!date(o.deliveredAt))return false;
  if(o.packaging!==undefined&&o.packaging!==null){const p=o.packaging;if(!object(p)||!text(p.bagType,150,true)||!text(p.presentation,200)||p.gramsPerBag!==undefined&&!grams(p.gramsPerBag))return false;}
  return true;
 });
}
export function readOrders(raw){
 if(typeof raw!=='string'||raw.length>MAX_STORAGE_BYTES||new TextEncoder().encode(raw).byteLength>MAX_STORAGE_BYTES)throw Error('Storage size limit');
 const data=JSON.parse(raw);if(!validOrders(data))throw Error('Invalid stored orders');return data;
}
export function csvCell(value){let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function toCSV(orders){return '\uFEFF'+[['Número','Cliente','Servicios','Peso total recibido (kg)','Tipo de tueste','Tipo de molienda','Tipo de funda','Peso por funda (g)','Cantidad y otras indicaciones del empaque','Otras instrucciones','Retiro','Estado','Creado','Listo para retirar','Entregado'],...orders.map(o=>[String(o.number).padStart(3,'0'),o.client,o.service,o.weight,o.roast??'',o.grind??'',o.packaging?.bagType??'',o.packaging?.gramsPerBag??'',o.packaging?.presentation??'',o.instructions,o.due,statuses[o.status],o.createdAt,o.readyAt??'',o.deliveredAt??''])].map(row=>row.map(csvCell).join(',')).join('\r\n');}
