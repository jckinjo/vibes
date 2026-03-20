"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchNewsByLanguage } from "@/lib/fetchNews";
import type { NewsItem } from "@/lib/fetchNews";
import type { Language, Category } from "@/lib/sources";
import { LANGUAGE_LABELS, LANGUAGE_CATEGORIES, CATEGORY_LABELS, SOURCES } from "@/lib/sources";
import NewsCard from "./NewsCard";

const LANGUAGES: Language[] = ["ja", "en", "zh", "ko"];

interface FeedData {
  items: NewsItem[];
  fetchedAt: number;
}

export default function NewsFeed() {
  const [activeLanguage, setActiveLanguage] = useState<Language>("ja");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [activeSource, setActiveSource] = useState<string>("all");
  const [feeds, setFeeds] = useState<Partial<Record<Language, FeedData>>>({});
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchLanguage = useCallback(async (lang: Language) => {
    setLoading(true);
    try {
      const items = await fetchNewsByLanguage(lang);
      setFeeds((prev) => ({
        ...prev,
        [lang]: { items, fetchedAt: Date.now() },
      }));
      setLastRefresh(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch current language on mount + language change
  useEffect(() => {
    const cached = feeds[activeLanguage];
    const STALE_MS = 5 * 60 * 1000; // 5 min cache
    if (!cached || Date.now() - cached.fetchedAt > STALE_MS) {
      fetchLanguage(activeLanguage);
    }
    setActiveCategory("all");
    setActiveSource("all");
  }, [activeLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentItems = feeds[activeLanguage]?.items ?? [];
  const categories = LANGUAGE_CATEGORIES[activeLanguage];
  const langSources = SOURCES.filter((s) => s.language === activeLanguage);

  const filtered = currentItems.filter((item) => {
    const catOk = activeCategory === "all" || item.categories.includes(activeCategory);
    const srcOk = activeSource === "all" || item.source.id === activeSource;
    return catOk && srcOk;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Language Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLanguage(lang)}
            className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
              activeLanguage === lang
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {LANGUAGE_LABELS[lang]}
            </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => fetchLanguage(activeLanguage)}
          disabled={loading}
          className="px-3 py-2 text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-40 transition-colors flex items-center gap-1"
        >
          <svg
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "Loading..." : lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : "Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              activeCategory === "all"
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-500"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Source filter */}
        <div className="flex flex-wrap gap-1 ml-auto">
          <select
            value={activeSource}
            onChange={(e) => setActiveSource(e.target.value)}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All sources</option>
            {langSources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        {loading
          ? "Fetching news…"
          : `${filtered.length} articles`}
      </p>

      {/* Feed */}
      {loading && currentItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading news…</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">
              No articles found.
            </p>
          ) : (
            filtered.map((item) => <NewsCard key={item.id} item={item} />)
          )}
        </div>
      )}
    </div>
  );
}
