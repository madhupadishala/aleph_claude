import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/admin/session";
import { ContentEditor } from "./ContentEditor";
export const dynamic = "force-dynamic";
export default async function ContentPage() {
  const cookie=(await cookies()).get("aleph_admin")?.value;
  if (!verifySession(cookie,process.env.ALEPH_ADMIN_PASSWORD)) redirect("/admin/login");
  return <ContentEditor />;
}
