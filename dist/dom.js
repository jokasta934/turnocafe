// All variable content becomes text nodes. Never parse customer data as HTML.
export function node(tag, className='', text){
  const element=document.createElement(tag);
  if(className)element.className=className;
  if(text!==undefined)element.textContent=String(text);
  return element;
}
export function row(label,value){const result=node('div','review-row');result.append(node('span','',label),node('b','',value));return result;}
export function notice(text){return node('div','form-note',text);}
