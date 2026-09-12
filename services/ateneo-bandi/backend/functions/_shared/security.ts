export const allowedOrigin = Deno.env.get("PUBLIC_SITE_ORIGIN") || "https://tacc-code-tacclab.github.io";
export const cors = {"Access-Control-Allow-Origin":allowedOrigin,"Access-Control-Allow-Headers":"content-type, authorization","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"};
export const json = (body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}});
export const token = ()=>{const bytes=crypto.getRandomValues(new Uint8Array(32));return btoa(String.fromCharCode(...bytes)).replaceAll("+","-").replaceAll("/","_").replaceAll("=","");};
export const sha256 = async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))).map(v=>v.toString(16).padStart(2,"0")).join("");
export const validEmail=(value:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)&&value.length<=254;
export const validFilters=(value:unknown)=>typeof value==="object"&&value!==null&&JSON.stringify(value).length<=2000;
export const sign=async(value:string)=>{
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(Deno.env.get("UNSUBSCRIBE_SECRET")!),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const bytes=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value)));
  return Array.from(bytes).map(v=>v.toString(16).padStart(2,"0")).join("");
};
