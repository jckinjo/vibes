export interface Concert {
  title: string | null;
  date: Date | null;
  dateDisplay: string | null;
  time: string | null;
  price: string | null;
  venue: string | null;
  location: string | null;
  url: string;
  source: string;
  sourceUrl: string;
  sourceColor: string;
  calendarUrl: string | null;
  isPlaceholder?: boolean;
  id?: string;
}

export interface Source {
  name: string;
  url: string;
  color: string;
}

export interface Scraper {
  scrape(): Promise<Concert[]>;
  source: Source;
}

export interface ScrapedData {
  upcoming: Concert[];
  past: Concert[];
  scrapedAt: string;
}
