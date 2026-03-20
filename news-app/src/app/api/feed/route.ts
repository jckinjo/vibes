// Dev-only RSS proxy — bypasses CORS for browser testing.
// Not included in the Android build (output: 'export' excludes API routes).
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url");
  if (!url) return new Response("Missing url param", { status: 400 });

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; NewsDashboard/1.0)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  const xml = await res.text();
  return new Response(xml, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}
