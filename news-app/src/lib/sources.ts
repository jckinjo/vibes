export type Language = "ja" | "en" | "zh" | "ko";
export type Category = "politics" | "economy" | "society" | "international" | "tech" | "taiwan";

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl: string;
  language: Language;
  categories: Category[];
  bias?: string; // editorial bias note
  reliable: boolean;
  excludeKeywords?: string[]; // filter out articles whose title contains any of these
}

const JA_EXCLUDE_KEYWORDS = [
  // sports — competitions & events
  "センバツ", "選抜高校野球", "高校野球", "甲子園",
  "オリンピック", "パラリンピック", "国体",
  "決勝", "準決勝", "準々決勝", "開幕戦", "第1R", "第2R", "第3R",
  "優勝", "制覇", "連覇",
  // sports — disciplines
  "プロ野球", "高校野球", "野球", "ソフトボール",
  "Ｊリーグ", "Jリーグ", "サッカー",
  "ラグビー", "バスケットボール", "バレーボール", "バドミントン",
  "卓球", "テニス", "ゴルフ", "水泳", "陸上", "マラソン",
  "柔道", "相撲", "レスリング", "ボクシング",
  "スキー", "スノーボード", "フィギュアスケート", "スケート",
  "競馬", "競輪", "競艇",
  // sports — leagues / tours
  "NBA", "NFL", "MLB", "NHL", "ＮＢＡ",
  "米ツアー", "欧州ツアー", "ワールドカップ", "W杯",
  // sports — result words
  "本塁打", "三振", "得点", "失点", "スタート",
  // entertainment
  "映画", "ドラマ", "俳優", "女優", "タレント", "芸能",
  "アイドル", "コンサート", "紅白", "授賞式",
  "歌手", "アニメ映画", "興行収入",
];

const KO_EXCLUDE_KEYWORDS = [
  // sports — disciplines
  "야구", "프로야구", "고교야구", "축구", "농구", "배구", "골프", "테니스",
  "수영", "육상", "마라톤", "유도", "씨름", "레슬링", "복싱",
  "스키", "스노보드", "피겨", "스케이트", "배드민턴", "탁구",
  "경마", "올림픽", "패럴림픽",
  // sports — results
  "결승", "준결승", "우승", "홈런", "득점", "승리", "패배",
  "NBA", "NFL", "MLB", "PGA",
  // entertainment
  "연예", "아이돌", "드라마", "영화", "배우", "가수",
  "콘서트", "시상식", "OST", "뮤직비디오", "K팝", "케이팝",
];

const EN_EXCLUDE_KEYWORDS = [
  // sports — disciplines
  "football", "soccer", "basketball", "baseball", "tennis", "golf",
  "cricket", "rugby", "hockey", "volleyball", "boxing", "wrestling",
  "swimming", "athletics", "marathon", "cycling", "skiing", "skating",
  "horse racing", "formula 1", "F1", "NASCAR",
  // sports — events & results
  "Olympics", "Paralympic", "World Cup", "Super Bowl", "championship",
  "semifinals", "quarterfinals", "finals", "playoff",
  "home run", "touchdown", "goal", "match result",
  "NBA", "NFL", "MLB", "NHL", "FIFA", "UEFA", "Premier League",
  // entertainment
  "box office", "Oscar", "Grammy", "Emmy", "BAFTA",
  "blockbuster", "celebrity", "Hollywood",
];

const ZH_EXCLUDE_KEYWORDS = [
  // sports
  "足球", "籃球", "棒球", "網球", "高爾夫", "高尔夫",
  "奧運", "奥运", "奧林匹克", "奥林匹克", "世界盃", "世界杯",
  "冠軍", "冠军", "決賽", "决赛", "準決賽", "准决赛",
  "NBA", "NFL", "MLB", "FIFA",
  // entertainment
  "電影", "电影",
  "票房",
  "奧斯卡", "奥斯卡",
  "格萊美", "格莱美",
  "Kpop", "K-pop", "KPop",
  "動畫片", "动画片",
  "偶像劇", "偶像剧",
  "娛樂圈", "娱乐圈",
  "影視", "影视",
  "綜藝", "综艺",
];

export const SOURCES: NewsSource[] = [
  // ── Japanese ──────────────────────────────────────────────
  {
    id: "nhk",
    name: "NHK",
    url: "https://www3.nhk.or.jp/news/",
    rssUrl: "https://www3.nhk.or.jp/rss/news/cat0.xml",
    language: "ja",
    categories: ["society"],
    bias: "公共放送",
    reliable: true,
    excludeKeywords: JA_EXCLUDE_KEYWORDS,
  },
  {
    id: "nhk-politics",
    name: "NHK 政治",
    url: "https://www3.nhk.or.jp/news/catn/seiji/",
    rssUrl: "https://www3.nhk.or.jp/rss/news/cat4.xml",
    language: "ja",
    categories: ["politics"],
    bias: "公共放送",
    reliable: true,
  },
  {
    id: "nhk-economy",
    name: "NHK 経済",
    url: "https://www3.nhk.or.jp/news/catn/keizai/",
    rssUrl: "https://www3.nhk.or.jp/rss/news/cat5.xml",
    language: "ja",
    categories: ["economy"],
    bias: "公共放送",
    reliable: true,
  },
  {
    id: "asahi",
    name: "朝日新聞",
    url: "https://www.asahi.com/",
    rssUrl: "https://www.asahi.com/rss/asahi/newsheadlines.rdf",
    language: "ja",
    categories: ["society"],
    bias: "中道左派",
    reliable: true,
    excludeKeywords: JA_EXCLUDE_KEYWORDS,
  },
  {
    id: "mainichi",
    name: "毎日新聞",
    url: "https://mainichi.jp/",
    rssUrl: "https://mainichi.jp/rss/etc/mainichi-flash.rss",
    language: "ja",
    categories: ["society"],
    bias: "中道左派",
    reliable: true,
    excludeKeywords: JA_EXCLUDE_KEYWORDS,
  },

  // ── English ────────────────────────────────────────────────
  {
    id: "bbc-world",
    name: "BBC World",
    url: "https://www.bbc.com/news/world",
    rssUrl: "https://feeds.bbci.co.uk/news/world/rss.xml",
    language: "en",
    categories: ["international"],
    bias: "公共放送・中立",
    reliable: true,
    excludeKeywords: EN_EXCLUDE_KEYWORDS,
  },
  {
    id: "guardian-world",
    name: "The Guardian",
    url: "https://www.theguardian.com/world",
    rssUrl: "https://www.theguardian.com/world/rss",
    language: "en",
    categories: ["international"],
    bias: "中道左派",
    reliable: true,
    excludeKeywords: EN_EXCLUDE_KEYWORDS,
  },
  {
    id: "hackernews",
    name: "Hacker News",
    url: "https://news.ycombinator.com/",
    rssUrl: "https://news.ycombinator.com/rss",
    language: "en",
    categories: ["tech"],
    bias: "SWEコミュニティ",
    reliable: true,
  },
  {
    id: "thenewstack",
    name: "The New Stack",
    url: "https://thenewstack.io/",
    rssUrl: "https://thenewstack.io/feed/",
    language: "en",
    categories: ["tech"],
    bias: "Cloud Native・Infra特化",
    reliable: true,
  },
  {
    id: "infoq",
    name: "InfoQ",
    url: "https://www.infoq.com/",
    rssUrl: "https://feed.infoq.com/",
    language: "en",
    categories: ["tech"],
    bias: "アーキテクチャ・分散システム特化",
    reliable: true,
  },
  {
    id: "theregister",
    name: "The Register",
    url: "https://www.theregister.com/",
    rssUrl: "https://www.theregister.com/headlines.atom",
    language: "en",
    categories: ["tech"],
    bias: "エンタープライズ・DC特化",
    reliable: true,
  },

  // ── Chinese (independent sources only) ────────────────────
  {
    id: "bbc-zh-trad",
    name: "BBC 中文",
    url: "https://www.bbc.com/zhongwen/trad",
    rssUrl: "https://feeds.bbci.co.uk/zhongwen/trad/rss.xml",
    language: "zh",
    categories: ["international", "politics", "taiwan"],
    bias: "公共放送・獨立",
    reliable: true,
    excludeKeywords: ZH_EXCLUDE_KEYWORDS,
  },
  {
    id: "rfi-zh",
    name: "RFI 法廣",
    url: "https://www.rfi.fr/cn/",
    rssUrl: "https://www.rfi.fr/cn/rss",
    language: "zh",
    categories: ["international", "politics", "taiwan"],
    bias: "法國公共廣播・獨立",
    reliable: true,
    excludeKeywords: ZH_EXCLUDE_KEYWORDS,
  },
  {
    id: "twreporter",
    name: "報導者",
    url: "https://www.twreporter.org/",
    rssUrl: "https://www.twreporter.org/a/rss2.xml",
    language: "zh",
    categories: ["taiwan", "politics"],
    bias: "台灣・獨立調查報導",
    reliable: true,
    excludeKeywords: ZH_EXCLUDE_KEYWORDS,
  },
  {
    id: "cna-politics",
    name: "中央社 政治",
    url: "https://www.cna.com.tw/",
    rssUrl: "https://feeds.feedburner.com/rsscna/politics",
    language: "zh",
    categories: ["taiwan", "politics"],
    bias: "台灣官方通信社",
    reliable: true,
    excludeKeywords: ZH_EXCLUDE_KEYWORDS,
  },
  {
    id: "cna-mainland",
    name: "中央社 兩岸",
    url: "https://www.cna.com.tw/",
    rssUrl: "https://feeds.feedburner.com/rsscna/mainland",
    language: "zh",
    categories: ["taiwan", "politics"],
    bias: "台灣官方通信社・兩岸報道",
    reliable: true,
    excludeKeywords: ZH_EXCLUDE_KEYWORDS,
  },
  {
    id: "dw-zh",
    name: "DW 中文",
    url: "https://www.dw.com/zh/",
    rssUrl: "https://rss.dw.com/xml/rss-chi-all",
    language: "zh",
    categories: ["international", "politics"],
    bias: "德國公共廣播・獨立",
    reliable: true,
    excludeKeywords: ZH_EXCLUDE_KEYWORDS,
  },
  {
    id: "initium",
    name: "端傳媒",
    url: "https://theinitium.com/",
    rssUrl: "https://theinitium.com/feed/",
    language: "zh",
    categories: ["politics", "economy"],
    bias: "獨立中文媒體・深度報道",
    reliable: true,
    excludeKeywords: ZH_EXCLUDE_KEYWORDS,
  },

  // ── Korean ────────────────────────────────────────────────
  {
    id: "yna-politics",
    name: "연합뉴스 정치",
    url: "https://www.yna.co.kr/politics/all",
    rssUrl: "https://www.yna.co.kr/rss/politics.xml",
    language: "ko",
    categories: ["politics"],
    bias: "국가기간통신사",
    reliable: true,
    excludeKeywords: KO_EXCLUDE_KEYWORDS,
  },
  {
    id: "yna-economy",
    name: "연합뉴스 경제",
    url: "https://www.yna.co.kr/economy/all",
    rssUrl: "https://www.yna.co.kr/rss/economy.xml",
    language: "ko",
    categories: ["economy"],
    bias: "국가기간통신사",
    reliable: true,
    excludeKeywords: KO_EXCLUDE_KEYWORDS,
  },
  {
    id: "hani",
    name: "한겨레",
    url: "https://www.hani.co.kr/",
    rssUrl: "https://www.hani.co.kr/rss/",
    language: "ko",
    categories: ["politics", "society"],
    bias: "중도진보",
    reliable: true,
    excludeKeywords: KO_EXCLUDE_KEYWORDS,
  },
  {
    id: "kyunghyang",
    name: "경향신문",
    url: "https://www.khan.co.kr/",
    rssUrl: "https://www.khan.co.kr/rss/rssdata/total_news.xml",
    language: "ko",
    categories: ["politics", "society"],
    bias: "중도진보",
    reliable: true,
    excludeKeywords: KO_EXCLUDE_KEYWORDS,
  },
];

export const LANGUAGE_LABELS: Record<Language, string> = {
  ja: "日本語",
  en: "English",
  zh: "中文",
  ko: "한국어",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  politics: "政治 / Politics",
  economy: "経済 / Economy",
  society: "社会 / Society",
  international: "国際 / International",
  tech: "SWE / Infra",
  taiwan: "台灣",
};

export const LANGUAGE_CATEGORIES: Record<Language, Category[]> = {
  ja: ["politics", "economy", "society"],
  en: ["international", "tech"],
  zh: ["politics", "economy", "taiwan"],
  ko: ["politics", "economy", "society"],
};
