import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/1", "/2", "/3"],
    },
    sitemap: "https://eldaly.me/sitemap.xml",
  };
}
