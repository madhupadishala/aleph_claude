import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/security/request";
export async function POST(request: Request) {
  try { requireSameOrigin(request); } catch { return NextResponse.json({error:"Forbidden"},{status:403}); }
  const response=NextResponse.json({ok:true});
  response.cookies.set("aleph_admin","",{path:"/",httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production",maxAge:0});
  return response;
}
