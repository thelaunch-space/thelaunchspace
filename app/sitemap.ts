import type { MetadataRoute } from "next";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thelaunch.space";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  // Auto-discover blog posts from app/blogs/<topic>/<slug>/page.tsx
  const blogsDir = join(process.cwd(), "app", "blogs");
  const blogPages: MetadataRoute.Sitemap = [];

  if (existsSync(blogsDir)) {
    const topics = readdirSync(blogsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("["));

    for (const topic of topics) {
      const topicDir = join(blogsDir, topic.name);
      const slugs = readdirSync(topicDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("["));

      for (const slug of slugs) {
        const pagePath = join(topicDir, slug.name, "page.tsx");
        if (existsSync(pagePath)) {
          blogPages.push({
            url: `${baseUrl}/blogs/${topic.name}/${slug.name}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      }
    }
  }

  return [...staticPages, ...blogPages];
}
