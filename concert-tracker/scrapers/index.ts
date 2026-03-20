import * as kotaroOshio from './kotaro-oshio';
import * as depapepe from './depapepe';
import * as igusaseiji from './igusaseiji';
import * as gogosatoshi from './gogosatoshi';
import * as tatsuyamaruyama from './tatsuyamaruyama';
import type { Scraper, Concert, ScrapedData } from './types';

const scrapers: Scraper[] = [
  kotaroOshio,
  depapepe,
  igusaseiji,
  gogosatoshi,
  tatsuyamaruyama,
];

// Simple in-memory cache: { data, expiresAt }
interface Cache {
  data: ScrapedData;
  expiresAt: number;
}

let cache: Cache | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function clean(str: string | null | undefined): string | null {
  if (!str) return str ?? null;
  return str.replace(/[\u200b\u200c\u200d\ufeff]/g, '').replace(/\s+/g, ' ').trim();
}

export async function scrapeAll(forceRefresh = false): Promise<ScrapedData> {
  if (!forceRefresh && cache && Date.now() < cache.expiresAt) {
    return cache.data;
  }

  const results = await Promise.allSettled(
    scrapers.map((s) =>
      s.scrape().catch((err: Error) => {
        console.error(`[${s.source.name}] scrape failed:`, err.message);
        return [] as Concert[];
      })
    )
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allConcerts: Concert[] = [];

  results.forEach((result, i) => {
    const scraperMeta = scrapers[i].source;
    let concerts: Concert[] = result.status === 'fulfilled' ? result.value : [];
    // Normalize whitespace/zero-width chars in all string fields
    concerts = concerts.map(c => ({
      ...c,
      title: clean(c.title),
      venue: clean(c.venue),
      location: clean(c.location),
      dateDisplay: clean(c.dateDisplay),
    }));

    if (concerts.length === 0) {
      // Return a "visit site" placeholder so the site is still shown in the UI
      allConcerts.push({
        id: `${scraperMeta.name}-placeholder`,
        title: null,
        date: null,
        dateDisplay: null,
        time: null,
        price: null,
        venue: null,
        location: null,
        url: scraperMeta.url,
        source: scraperMeta.name,
        sourceUrl: scraperMeta.url,
        sourceColor: scraperMeta.color,
        calendarUrl: null,
        isPlaceholder: true,
      });
    } else {
      concerts.forEach((c, j) => {
        allConcerts.push({ id: `${scraperMeta.name}-${j}`, ...c });
      });
    }
  });

  // Sort: concerts with dates first (chronological), then placeholders
  allConcerts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.getTime() - b.date.getTime();
  });

  // Separate upcoming from past
  const upcoming = allConcerts.filter((c) => !c.date || c.date >= today);
  const past = allConcerts.filter((c) => c.date && c.date < today);

  const data: ScrapedData = { upcoming, past, scrapedAt: new Date().toISOString() };

  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
}
