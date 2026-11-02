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
export function validateWork({weight,services,packaging,instructions}){
  if(!Number.isFinite(weight)||weight<=0||weight>100000)return 'Indica el peso total recibido en kilos.';
  if(!Array.isArray(services)||!services.length||services.some(s=>!serviceOptions.includes(s)))return 'Selecciona al menos un servicio.';
  if(services.includes('Empaquetar')&&!packaging?.bagType?.trim())return 'Indica qué tipo de funda eligió el cliente.';
  if(services.includes('Empaquetar')&&(!Number.isSafeInteger(packaging?.gramsPerBag)||packaging.gramsPerBag<1||packaging.gramsPerBag>100000))return 'Indica el peso de cada funda en gramos enteros (mínimo 1 g).';
  if(services.includes('Otro servicio')&&!instructions?.trim())return 'Describe el otro servicio en las instrucciones.';
  return '';
}
export function validOrders(data){return Array.isArray(data)&&data.every(o=>o&&typeof o.id==='string'&&Number.isSafeInteger(o.number)&&o.number>0&&typeof o.client==='string'&&typeof o.service==='string'&&typeof o.instructions==='string'&&typeof o.createdAt==='string'&&Number.isFinite(Date.parse(o.due))&&Object.hasOwn(statuses,o.status)&&(o.services===undefined||(Array.isArray(o.services)&&o.services.length>0&&o.services.every(s=>serviceOptions.includes(s))))&&(o.roast===undefined||typeof o.roast==='string')&&(o.grind===undefined||typeof o.grind==='string')&&(o.packaging===undefined||o.packaging===null||(typeof o.packaging.bagType==='string'&&typeof o.packaging.presentation==='string'&&(o.packaging.gramsPerBag===undefined||(Number.isSafeInteger(o.packaging.gramsPerBag)&&o.packaging.gramsPerBag>0&&o.packaging.gramsPerBag<=100000))))&&(o.weight===null||(typeof o.weight==='number'&&o.weight>0)));}
export function csvCell(value){let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function toCSV(orders){return '\uFEFF'+[['Número','Cliente','Servicios','Peso total recibido (kg)','Tipo de tueste','Tipo de molienda','Tipo de funda','Peso por funda (g)','Cantidad y otras indicaciones del empaque','Otras instrucciones','Retiro','Estado','Creado','Listo para retirar','Entregado'],...orders.map(o=>[String(o.number).padStart(3,'0'),o.client,o.service,o.weight,o.roast??'',o.grind??'',o.packaging?.bagType??'',o.packaging?.gramsPerBag??'',o.packaging?.presentation??'',o.instructions,o.due,statuses[o.status],o.createdAt,o.readyAt??'',o.deliveredAt??''])].map(row=>row.map(csvCell).join(',')).join('\r\n');}
