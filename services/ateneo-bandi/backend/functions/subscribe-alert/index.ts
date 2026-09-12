import {createClient} from "jsr:@supabase/supabase-js@2";
import {allowedOrigin,cors,json,sha256,token,validEmail,validFilters} from "../_shared/security.ts";

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  if(req.method!=="POST"||req.headers.get("origin")!==allowedOrigin) return json({error:"Richiesta non consentita"},403);
  const body=await req.json().catch(()=>null);
  if(!body||body.company||!validEmail(body.email)||!validFilters(body.filters)) return json({error:"Dati non validi"},400);
  const email=String(body.email).trim().toLowerCase();
  const verify=token(),unsubscribe=token();
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const {error}=await supabase.from("academic_alerts").upsert({email,filters:body.filters,cadence:body.cadence==="weekly"?"weekly":"daily",status:"pending",verify_token_hash:await sha256(verify),verify_expires_at:new Date(Date.now()+60*60*1000).toISOString(),unsubscribe_token_hash:await sha256(unsubscribe)},{onConflict:"email,filters"});
  if(error) return json({error:"Impossibile creare l'avviso"},500);
  const verifyUrl=`${Deno.env.get("SUPABASE_URL")}/functions/v1/verify-alert?token=${encodeURIComponent(verify)}`;
  const mail=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${Deno.env.get("RESEND_API_KEY")}`,"Content-Type":"application/json"},body:JSON.stringify({from:Deno.env.get("ALERT_FROM"),to:[email],subject:"Conferma il tuo avviso Ateneo Bandi",html:`<h1>Conferma l'avviso</h1><p>Clicca il pulsante per confermare il tuo indirizzo e attivare la ricerca salvata.</p><p><a href="${verifyUrl}">Conferma email</a></p><p>Il link scade tra un'ora. Se non sei stato tu, ignora questa email.</p>`})});
  if(!mail.ok) return json({error:"Invio della verifica non riuscito"},502);
  return json({ok:true,message:"Controlla la tua email per confermare l'avviso."});
});
