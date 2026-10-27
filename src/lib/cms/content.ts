import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type CmsEntry = {
  id: string; kind: "page" | "blog"; slug: string;
  title: string; summary: string; body: string;
  status: "draft" | "published"; updated_at: string; published_at: string | null;
};
export const PAGE_SLUGS = ["home","about","pricing","solutions","resources"] as const;
export async function getPublished(kind: CmsEntry["kind"], slug: string): Promise<CmsEntry | null> {
  try {
    const { data, error } = await getSupabaseAdmin().from("aleph_cms_content")
      .select("*").eq("kind",kind).eq("slug",slug).eq("status","published").maybeSingle();
    if (error) throw error;
    return data as CmsEntry | null;
  } catch (error) {
    console.error("CMS published content unavailable", error);
    return null;
  }
}
export async function listPublishedBlogs(): Promise<CmsEntry[]> {
  try {
    const { data, error } = await getSupabaseAdmin().from("aleph_cms_content")
      .select("*").eq("kind","blog").eq("status","published").order("published_at",{ascending:false});
    if (error) throw error;
    return (data ?? []) as CmsEntry[];
  } catch (error) {
    console.error("CMS blog list unavailable",error);
    return [];
  }
}
