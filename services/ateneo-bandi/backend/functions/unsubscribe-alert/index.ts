import {createClient} from "jsr:@supabase/supabase-js@2";
import {allowedOrigin,sign} from "../_shared/security.ts";

Deno.serve(async(req)=>{
  const url=new URL(req.url),id=url.searchParams.get("id")||"",signature=url.searchParams.get("signature")||"";
  const destination=new URL("/services/ateneo-bandi/",allowedOrigin);
  if(!id||signature!==await sign(id)){destination.searchParams.set("alert","invalid");return Response.redirect(destination,303);}
  const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  await supabase.from("academic_alerts").update({status:"unsubscribed"}).eq("id",id);
  destination.searchParams.set("alert","unsubscribed");
  return Response.redirect(destination,303);
});
