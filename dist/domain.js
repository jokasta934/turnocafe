export const STORAGE_KEY='turnocafe.orders.v1';
export const statuses={pending:'Pendiente',ready:'Listo para pesar',delivered:'Entregado'};
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function isLate(order,now=new Date()){return order.status!=='delivered'&&new Date(order.due).getTime()<now.getTime();}
export function isToday(order,now=new Date()){return new Date(order.due).toDateString()===now.toDateString();}
export function nextNumber(orders){return Math.max(0,...orders.map(o=>o.number))+1;}
export function validOrders(data){return Array.isArray(data)&&data.every(o=>o&&typeof o.id==='string'&&Number.isSafeInteger(o.number)&&o.number>0&&typeof o.client==='string'&&typeof o.service==='string'&&typeof o.instructions==='string'&&typeof o.createdAt==='string'&&Number.isFinite(Date.parse(o.due))&&Object.hasOwn(statuses,o.status)&&(o.weight===null||(typeof o.weight==='number'&&o.weight>0)));}
export function csvCell(value){let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function toCSV(orders){return '\uFEFF'+[['Número','Cliente','Servicio','Kilos recibidos','Instrucciones','Retiro','Estado','Creado','Listo para pesar','Entregado'],...orders.map(o=>[String(o.number).padStart(3,'0'),o.client,o.service,o.weight,o.instructions,o.due,statuses[o.status],o.createdAt,o.readyAt??'',o.deliveredAt??''])].map(row=>row.map(csvCell).join(',')).join('\r\n');}
