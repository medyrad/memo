import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://memostyles.example";
  return [
    { url: baseUrl },
    { url: `${baseUrl}/products` },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/contact` },
  ];
}

