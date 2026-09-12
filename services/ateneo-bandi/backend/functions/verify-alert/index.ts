import {createClient} from "jsr:@supabase/supabase-js@2";
import {allowedOrigin,sha256} from "../_shared/security.ts";

Deno.serve(async(req)=>{
  const url=new URL(req.url),token=url.searchParams.get("token")||"";
  const destination=new URL("/services/ateneo-bandi/",allowedOrigin);
  if(token.length<32){destination.searchParams.set("alert","invalid");return Response.redirect(destination,303);}
  if(req.method==="GET") return new Response(`<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Conferma avviso</title><style>body{display:grid;min-height:100vh;place-items:center;margin:0;background:#072d35;color:#fff;font:16px system-ui}.box{max-width:520px;padding:40px;border-radius:20px;background:#fff;color:#123238}button{padding:14px 20px;border:0;border-radius:10px;background:#d7ff65;font-weight:800;cursor:pointer}</style><div class="box"><h1>Conferma l'avviso</h1><p>Premi il pulsante per verificare il tuo indirizzo e attivare le notifiche di Ateneo Bandi.</p><form method="post" action="?token=${token}"><button type="submit">Conferma email</button></form></div></html>`,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}});
  if(req.method!=="POST"){destination.searchParams.set("alert","invalid");return Response.redirect(destination,303);}
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const {data}=await supabase.from("academic_alerts").update({status:"confirmed",confirmed_at:new Date().toISOString(),verify_token_hash:null,verify_expires_at:null}).eq("verify_token_hash",await sha256(token)).eq("status","pending").gt("verify_expires_at",new Date().toISOString()).select("id").maybeSingle();
  destination.searchParams.set("alert",data?"confirmed":"invalid");
  return Response.redirect(destination,303);
});
