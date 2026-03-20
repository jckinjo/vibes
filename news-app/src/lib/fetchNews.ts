import Parser from "rss-parser";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { SOURCES, type Language, type Category, type NewsSource } from "./sources";

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  summary?: string;
  source: {
    id: string;
    name: string;
    bias?: string;
    url: string;
  };
  language: Language;
  categories: Category[];
}

const parser = new Parser();

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, (e) => {
    const map: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&nbsp;": " " };
    return map[e] ?? "";
  }).trim();
}

const FEED_LIMIT = 50;

/** Extract tokens for similarity comparison.
 *  - Latin: words of 3+ chars (lowercased)
 *  - CJK: overlapping bigrams  */
function titleTokens(title: string): Set<string> {
  const tokens: string[] = [];
  for (const w of title.match(/[a-zA-Z]{3,}/g) ?? []) {
    tokens.push(w.toLowerCase());
  }
  const cjk = title.match(/[\u3040-\u9fff\u4e00-\u9fff]/g) ?? [];
  for (let i = 0; i < cjk.length - 1; i++) {
    tokens.push(cjk[i] + cjk[i + 1]);
  }
  return new Set(tokens);
}

function jaccardSimilarity(a: string, b: string): number {
  const sa = titleTokens(a);
  const sb = titleTokens(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let intersection = 0;
  for (const t of sa) if (sb.has(t)) intersection++;
  return intersection / (sa.size + sb.size - intersection);
}

function deduplicateAndLimit(items: NewsItem[]): NewsItem[] {
  const kept: NewsItem[] = [];
  for (const item of items) {
    if (kept.every((k) => jaccardSimilarity(k.title, item.title) < 0.45)) {
      kept.push(item);
      if (kept.length >= FEED_LIMIT) break;
    }
  }
  return kept;
}

async function fetchRssXml(rssUrl: string): Promise<string> {
  if (Capacitor.isNativePlatform()) {
    // Android native: use CapacitorHttp which bypasses CORS via native HTTP
    const response = await CapacitorHttp.get({
      url: rssUrl,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsDashboard/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      responseType: "text",
    });
    return response.data;
  } else {
    // Browser dev mode: proxy through Next.js API route to avoid CORS
    const res = await fetch(`/api/feed?url=${encodeURIComponent(rssUrl)}`);
    return res.text();
  }
}

async function fetchSource(source: NewsSource): Promise<NewsItem[]> {
  try {
    const xml = await fetchRssXml(source.rssUrl);
    const feed = await parser.parseString(xml);
    const excluded = source.excludeKeywords ?? [];
    return (feed.items || [])
      .filter((item) => {
        const title = item.title ?? "";
        return excluded.every((kw) => !title.includes(kw));
      })
      .slice(0, 15)
      .map((item, i) => ({
      id: `${source.id}-${i}`,
      title: item.title || "",
      link: item.link || item.guid || "",
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      summary: item.contentSnippet
        ? item.contentSnippet.slice(0, 200)
        : item.summary
        ? stripHtml(item.summary).slice(0, 200)
        : item.content
        ? stripHtml(item.content).slice(0, 200)
        : undefined,
      source: {
        id: source.id,
        name: source.name,
        bias: source.bias,
        url: source.url,
      },
      language: source.language,
      categories: source.categories,
    }));
  } catch (err) {
    console.warn(`[fetchNews] Failed to fetch ${source.id}:`, (err as Error).message);
    return [];
  }
}

export async function fetchNewsByLanguage(language: Language): Promise<NewsItem[]> {
  const sources = SOURCES.filter((s) => s.language === language);
  const results = await Promise.allSettled(sources.map(fetchSource));
  const items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }
  // sort by pubDate descending, then deduplicate and cap at FEED_LIMIT
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return deduplicateAndLimit(items);
}
