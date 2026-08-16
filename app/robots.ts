import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /v4 stays disallowed now that it *is* the home page — indexing both
      // would be duplicate content. /hero and /expenses are working routes.
      disallow: ["/1", "/2", "/3", "/v4", "/hero", "/expenses"],
    },
    sitemap: "https://eldaly.me/sitemap.xml",
  };
}
