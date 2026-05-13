// 전체 청구서 URL 자동 생성 sitemap
import type { MetadataRoute } from "next";
import { fetchInvoices } from "@/lib/notion";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  // 홈 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  // 청구서 상세 페이지 동적 생성
  try {
    const invoices = await fetchInvoices();
    const dynamicRoutes: MetadataRoute.Sitemap = invoices.map((inv) => ({
      url: `${baseUrl}/invoice/${inv.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
