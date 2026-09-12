import {createClient} from "jsr:@supabase/supabase-js@2";
import {allowedOrigin,json,sign} from "../_shared/security.ts";

type Call={id:string;title:string;role:string;institution:string;city:string;region:string;sector:string;sectorCode:string;deadline:string;url:string};
const norm=(v:unknown)=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const entities:Record<string,string>={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"};
const esc=(v:unknown)=>String(v||"").replace(/[&<>\"]/g,c=>entities[c]);
const matches=(call:Call,f:Record<string,string>)=>{
  const hay=norm([call.title,call.role,call.institution,call.city,call.region,call.sector,call.sectorCode].join(" "));
  if(norm(f.query).split(/\s+/).filter(Boolean).some(t=>!hay.includes(t))) return false;
  return !(["role","region","city","institution"] as const).some(k=>f[k]&&call[k]!==f[k]);
};

Deno.serve(async(req)=>{
  if(req.method!=="POST"||req.headers.get("authorization")!==`Bearer ${Deno.env.get("CRON_SECRET")}`) return json({error:"Non autorizzato"},401);
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const response=await fetch(`${allowedOrigin}/services/ateneo-bandi/data/calls.json`,{headers:{"User-Agent":"AteneoBandi-Digest/1.0"}});
  if(!response.ok) return json({error:"Indice non disponibile"},502);
  const payload=await response.json(),today=new Date().toISOString().slice(0,10);
  const calls=(payload.calls as Call[]).filter(c=>c.deadline>=today);
  const {data:alerts,error}=await supabase.from("academic_alerts").select("id,email,filters,cadence,last_sent_at").eq("status","confirmed");
  if(error) return json({error:"Database non disponibile"},500);
  let delivered=0;
  for(const alert of alerts||[]){
    const elapsed=alert.last_sent_at?Date.now()-new Date(alert.last_sent_at).getTime():Infinity;
    if(elapsed<(alert.cadence==="weekly"?6:0.8)*86400000) continue;
    const candidates=calls.filter(c=>matches(c,alert.filters||{}));
    const ids=candidates.map(c=>c.id);
    const {data:sent}=await supabase.from("academic_alert_deliveries").select("call_id").eq("alert_id",alert.id).in("call_id",ids.length?ids:["none"]);
    const seen=new Set((sent||[]).map(x=>x.call_id)),fresh=candidates.filter(c=>!seen.has(c.id)).slice(0,25);
    if(!fresh.length) continue;
    const signature=await sign(alert.id),unsubscribe=`${Deno.env.get("SUPABASE_URL")}/functions/v1/unsubscribe-alert?id=${alert.id}&signature=${signature}`;
    const items=fresh.map(c=>`<li><strong>${esc(c.title)}</strong><br>${esc(c.institution)} · ${esc(c.city)} · scade ${esc(c.deadline)}<br><a href="${esc(c.url)}">Bando ufficiale</a></li>`).join("");
    const mail=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${Deno.env.get("RESEND_API_KEY")}`,"Content-Type":"application/json"},body:JSON.stringify({from:Deno.env.get("ALERT_FROM"),to:[alert.email],subject:`${fresh.length} nuovi bandi per la tua ricerca`,html:`<h1>Ateneo Bandi</h1><p>Nuove opportunità corrispondenti ai tuoi filtri:</p><ul>${items}</ul><p><a href="${unsubscribe}">Disattiva questo avviso</a></p>`})});
    if(!mail.ok) continue;
    await supabase.from("academic_alert_deliveries").insert(fresh.map(c=>({alert_id:alert.id,call_id:c.id})));
    await supabase.from("academic_alerts").update({last_sent_at:new Date().toISOString()}).eq("id",alert.id);
    delivered++;
  }
  return json({ok:true,delivered});
});
