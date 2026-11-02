import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bgithub_pat_[A-Za-z0-9_]{40,}\b/,/\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b/,/\bAKIA[A-Z0-9]{16}\b/,/\bnpm_[A-Za-z0-9]{30,}\b/];
const failures=[];
const git=args=>execFileSync('git',args,{encoding:'utf8',maxBuffer:20_000_000});
const scan=(name,text)=>{if(patterns.some(pattern=>pattern.test(text)))failures.push(`Posible secreto: ${name}`);};
for(const path of git(['ls-files','-z']).split('\0').filter(Boolean)){
 try{scan(path,readFileSync(path,'utf8'));}catch{continue;}
 if(/(^|\/)(?:\.env(?:\..*)?|[^/]+\.(?:pem|key|p12|pfx))$/.test(path)&&!path.endsWith('.env.example'))failures.push(`Archivo sensible rastreado: ${path}`);
}
if(process.argv.includes('--history'))for(const revision of git(['rev-list','--all']).trim().split('\n').filter(Boolean)){
 for(const path of git(['ls-tree','-r','--name-only',revision]).trim().split('\n').filter(Boolean))scan(`${revision.slice(0,8)}:${path}`,git(['show',`${revision}:${path}`]));
}
for(const path of ['dist/app.js','dist/dom.js']){
 const text=readFileSync(path,'utf8');
 if(/\b(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval|new Function)\b/.test(text))failures.push(`Operación DOM peligrosa: ${path}`);
}
if(/@import|https?:\/\//.test(readFileSync('dist/style.css','utf8')))failures.push('Recurso CSS remoto sin revisar');
const html=readFileSync('dist/index.html','utf8');
if(!html.includes('Content-Security-Policy')||/\bon\w+\s*=|javascript:/i.test(html))failures.push('Política CSP ausente o controlador en línea');
const pkg=JSON.parse(readFileSync('package.json','utf8'));
if(Object.keys(pkg.dependencies||{}).length||Object.keys(pkg.devDependencies||{}).length)failures.push('Se añadieron dependencias: revisar y actualizar este control de seguridad');
if(failures.length){console.error([...new Set(failures)].join('\n'));process.exitCode=1;}else console.log('Sin secretos con los patrones revisados; sin operaciones DOM peligrosas ni dependencias de terceros.');
