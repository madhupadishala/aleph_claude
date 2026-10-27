import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";
import { blogPosts } from "@/lib/aleph/blogs";
import { listPublishedBlogs } from "@/lib/cms/content";

export const metadata = {
  title: "Practice Notes",
  description:
    "Practical notes for independent clinicians on visibility, patient trust, pricing confidence, retention, and practice authority.",
  alternates: { canonical: "/blogs" },
};

export default async function BlogsPage() {
  const cmsPosts = await listPublishedBlogs();
  const allPosts = [...cmsPosts.map(p => ({slug:p.slug,title:p.title,excerpt:p.summary,category:"Practice Notes",published:new Date(p.published_at || p.updated_at).toLocaleDateString("en-IN"),readTime:Math.max(1,Math.ceil(p.body.split(/\s+/).length/200))+" min read"})),...blogPosts.filter(p=>!cmsPosts.some(c=>c.slug===p.slug))];
  return (
    <main className="page-wrap">
      <PageIntro
        eyebrow="ALEPH PRACTICE NOTES"
        title="Useful thinking for a stronger independent practice."
      >
        Clear, practical notes on being found, building patient trust, pricing
        with confidence, and creating a practice people remember.
      </PageIntro>

      <section className="section-wrap">
        <div className="grid gap-6 lg:grid-cols-3">
          {allPosts.map((post, index) => (
            <article
              key={post.slug}
              className="flex min-h-[360px] flex-col rounded-[2rem] border border-[#DCE6E1] bg-white p-7 md:p-8"
            >
              <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.14em] text-[#607169]">
                <span>{post.category}</span>
                <span>0{index + 1}</span>
              </div>
              <h2 className="mt-8 text-3xl leading-tight text-[#123629]">
                {post.title}
              </h2>
              <p className="mt-5 leading-7 text-[#52665e]">{post.excerpt}</p>
              <div className="mt-auto pt-8">
                <div className="mb-5 flex gap-3 text-xs font-semibold text-[#718078]">
                  <span>{post.published}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
                <Link className="text-link" href={`/blogs/${post.slug}`}>
                  Read article <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-band">
        <p className="eyebrow">NOT SURE WHERE TO START?</p>
        <h2>
          Read less.
          <br />
          Know what your practice needs next.
        </h2>
        <Link className="button primary" href="/diagnostic">
          Take the free diagnostic <ArrowUpRight size={18} />
        </Link>
      </section>
    </main>
  );
}
