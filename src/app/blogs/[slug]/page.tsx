import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { blogPosts, getBlogPost } from "@/lib/aleph/blogs";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blogs/${post.slug}` },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <main className="page-wrap">
      <article className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
        <Link className="text-link" href="/blogs">
          <ArrowLeft size={17} /> Back to Practice Notes
        </Link>

        <header className="mt-10 border-b border-[#DCE6E1] pb-10">
          <p className="eyebrow">{post.category}</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.02] text-[#123629] md:text-7xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52665e]">
            {post.excerpt}
          </p>
          <div className="mt-7 flex gap-3 text-sm font-semibold text-[#718078]">
            <span>{post.published}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="mt-12 space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl leading-tight text-[#123629] md:text-4xl">
                {section.heading}
              </h2>
              <div className="mt-5 space-y-5 text-base leading-8 text-[#41554d] md:text-lg">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-16 rounded-[2rem] bg-[#EDF4F1] p-7 md:p-10">
          <p className="eyebrow">MAKE IT PRACTICAL</p>
          <h2 className="mt-3 text-3xl leading-tight text-[#123629]">
            See how your own practice is performing across five growth dimensions.
          </h2>
          <Link className="button primary mt-6" href="/diagnostic">
            Take the free diagnostic <ArrowUpRight size={17} />
          </Link>
        </aside>
      </article>
    </main>
  );
}
