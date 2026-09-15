import type { MetadataRoute } from "next";
import { segments } from "@/lib/aleph/commercial";
import { siteUrl } from "@/lib/site";

const baseUrl = siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/diagnostic",
    "/solutions",
    "/pricing",
    "/resources",
    "/privacy",
  ];
  const segmentRoutes = segments.map((segment) => `/for/${segment.slug}`);

  return [...staticRoutes, ...segmentRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
