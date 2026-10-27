import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { PAGE_SLUGS } from "@/lib/cms/content";
import { requireSameOrigin, rateLimit } from "@/lib/security/request";
export const dynamic = "force-dynamic";
async function authorized() {
  const cookie = (await cookies()).get("aleph_admin")?.value;
  return verifySession(cookie,process.env.ALEPH_ADMIN_PASSWORD);
}
export async function GET() {
  if (!await authorized()) return NextResponse.json({error:"Unauthorized"},{status:401});
  try {
    const { data,error } = await getSupabaseAdmin().from("aleph_cms_content").select("*").order("updated_at",{ascending:false});
    if(error) throw error;
    return NextResponse.json({entries:data},{headers:{"Cache-Control":"no-store"}});
  } catch { return NextResponse.json({error:"Content storage unavailable. Apply CMS migration."},{status:503}); }
}
export async function PUT(request: Request) {
  if (!await authorized()) return NextResponse.json({error:"Unauthorized"},{status:401});
  try {
    requireSameOrigin(request);
    await rateLimit(request,"cms-write",60,3600);
    if(Number(request.headers.get("content-length")||0)>50000) return NextResponse.json({error:"Payload too large"},{status:413});
    const value: unknown = await request.json();
    if(!value || typeof value!=="object") return NextResponse.json({error:"Invalid payload"},{status:400});
    const row=value as Record<string,unknown>;
    const kind=row.kind, slug=row.slug, title=row.title, summary=row.summary, body=row.body,status=row.status;
    if(kind!=="page"&&kind!=="blog") return NextResponse.json({error:"Invalid kind"},{status:400});
    if(typeof slug!=="string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || (kind==="page"&&!PAGE_SLUGS.includes(slug as typeof PAGE_SLUGS[number]))) return NextResponse.json({error:"Invalid slug"},{status:400});
    if(typeof title!=="string"||title.length<1||title.length>180||typeof summary!=="string"||summary.length>800||typeof body!=="string"||body.length>30000||(status!=="draft"&&status!=="published")) return NextResponse.json({error:"Invalid content"},{status:400});
    // No HTML is interpreted in public output; text only.
    const client=getSupabaseAdmin();
    const {data:existing,error:readError}=await client.from("aleph_cms_content").select("published_at").eq("kind",kind).eq("slug",slug).maybeSingle();
    if(readError) throw readError;
    const {data,error}=await client.from("aleph_cms_content").upsert({
      kind,slug,title,summary,body,status,updated_at:new Date().toISOString(),
      published_at:status==="published"?(existing?.published_at??new Date().toISOString()):null
    },{onConflict:"kind,slug"}).select("*").single();
    if(error) throw error;
    return NextResponse.json({entry:data},{headers:{"Cache-Control":"no-store"}});
  } catch { return NextResponse.json({error:"Save failed"},{status:503}); }
}
