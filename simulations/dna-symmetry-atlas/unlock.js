'use strict';
// Only an authenticated decryption result is rendered. The public deployment
// contains no plaintext research files and no stored password or derived key.
const form=document.getElementById('unlock-form'),password=document.getElementById('password'),status=document.getElementById('status');
const frame=document.getElementById('atlas-frame'),viewer=document.getElementById('viewer'),lockScreen=document.getElementById('lock-screen');
let files=null,payloadPromise=null,manifestPromise=null;
const urls=new Map();
const bytes64=text=>Uint8Array.from(atob(text),c=>c.charCodeAt(0));
const setStatus=(message,error=false)=>{status.textContent=message;status.dataset.error=String(error)};
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);

async function manifest(){
  if(!manifestPromise)manifestPromise=fetch('manifest.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('download');return r.json()});
  return manifestPromise;
}
async function payload(meta){
  if(!payloadPromise)payloadPromise=(async()=>{
    const response=await fetch(meta.payload,{cache:'no-store'});if(!response.ok)throw new Error('download');
    const total=Number(response.headers.get('content-length'))||meta.bytes,reader=response.body?.getReader();
    if(!reader)return response.arrayBuffer();
    const chunks=[];let received=0;
    while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);received+=value.length;setStatus(`Loading protected content… ${Math.min(100,Math.round(received/total*100))}%`)}
    return new Blob(chunks).arrayBuffer();
  })();
  try{return await payloadPromise}catch(e){payloadPromise=null;throw e}
}
function canonical(href,current){
  const resolved=new URL(href,'https://protected-bundle.invalid/'+current);
  return resolved.origin==='https://protected-bundle.invalid'?decodeURIComponent(resolved.pathname.slice(1)):null;
}
function fileBytes(file){return file.encoding==='base64'?bytes64(file.data):file.data}
function objectURL(path){
  if(urls.has(path))return urls.get(path);
  const file=files[path];let content=fileBytes(file);
  if(file.type==='text/html'){
    const doc=new DOMParser().parseFromString(content,'text/html');
    for(const link of doc.querySelectorAll('a[href]')){
      const href=link.getAttribute('href');
      if(!href||href.startsWith('#')||href.startsWith('blob:')||href.startsWith('data:'))continue;
      const target=canonical(href,path);
      if(target&&own(files,target)){
        if(files[target].type==='text/html'){link.href='#';link.dataset.protectedPath=target}
        else{link.href=objectURL(target);link.target='_blank';link.rel='noopener noreferrer';if(/\.(gz|bib)$/i.test(target))link.download=target.split('/').pop()}
      }else if(/^(https?:)?\/\//i.test(href)){link.target='_blank';link.rel='noopener noreferrer'}
    }
    const navigation=doc.createElement('script');
    navigation.textContent=`document.addEventListener('click',function(e){const a=e.target.closest?.('a[data-protected-path]');if(!a)return;e.preventDefault();parent.postMessage({type:'dna-atlas-open',path:a.dataset.protectedPath},${JSON.stringify(location.origin)});},true);`;
    doc.head.append(navigation);content='<!doctype html>\n'+doc.documentElement.outerHTML;
  }
  const url=URL.createObjectURL(new Blob([content],{type:file.type+(file.encoding==='utf-8'?';charset=utf-8':'')}));urls.set(path,url);return url;
}
function openPage(path){if(!files||!own(files,path)||files[path].type!=='text/html')return;frame.src=objectURL(path)}
window.addEventListener('message',event=>{
  if(event.source!==frame.contentWindow||event.origin!==location.origin)return;
  if(event.data?.type==='dna-atlas-open'&&typeof event.data.path==='string')openPage(event.data.path);
});
form.addEventListener('submit',async event=>{
  event.preventDefault();if(!password.value)return;
  const button=document.getElementById('unlock');button.disabled=true;password.disabled=true;
  setStatus('Preparing secure access…');
  try{
    if(!window.crypto?.subtle||!window.DecompressionStream)throw new Error('unsupported');
    const meta=await manifest(),encoded=new TextEncoder().encode(password.value);
    const material=await crypto.subtle.importKey('raw',encoded,'PBKDF2',false,['deriveKey']);encoded.fill(0);
    const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes64(meta.salt),iterations:meta.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
    const encrypted=await payload(meta);setStatus('Unlocking the atlas…');
    const packed=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes64(meta.iv),additionalData:new TextEncoder().encode(meta.context),tagLength:128},key,encrypted);
    const stream=new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const bundle=JSON.parse(await new Response(stream).text());
    if(bundle.version!==1||!own(bundle.files,'results/final/index.html'))throw new Error('bundle');
    files=bundle.files;password.value='';openPage('results/final/index.html');lockScreen.hidden=true;viewer.hidden=false;setStatus('');
  }catch(error){
    files=null;
    if(error.name==='OperationError')setStatus('Incorrect password. Please try again.',true);
    else if(error.message==='unsupported')setStatus('Please use a recent browser over HTTPS to open this atlas.',true);
    else setStatus('The protected content could not be loaded. Check your connection and try again.',true);
  }finally{button.disabled=false;password.disabled=false;if(!files)password.focus()}
});
document.getElementById('lock').addEventListener('click',()=>{
  frame.src='about:blank';viewer.hidden=true;lockScreen.hidden=false;files=null;
  for(const url of urls.values())URL.revokeObjectURL(url);urls.clear();password.value='';setStatus('Atlas locked. Enter the password to reopen it.');password.focus();
});
