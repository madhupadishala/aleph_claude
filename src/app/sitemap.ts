import type { MetadataRoute } from "next";
import { segments } from "@/lib/aleph/commercial";
import { blogPosts } from "@/lib/aleph/blogs";
import { siteUrl } from "@/lib/site";

const baseUrl = siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/blogs",
    "/diagnostic",
    "/solutions",
    "/pricing",
    "/resources",
    "/privacy",
  ];
  const segmentRoutes = segments.map((segment) => `/for/${segment.slug}`);
  const blogRoutes = blogPosts.map((post) => `/blogs/${post.slug}`);

  return [...staticRoutes, ...segmentRoutes, ...blogRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" || route === "/blogs" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
