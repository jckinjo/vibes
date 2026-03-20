"use client";

import { useState } from "react";
import type { NewsItem } from "@/lib/fetchNews";
import SourceBadge from "./SourceBadge";

interface Props {
  item: NewsItem;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function NewsCard({ item }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasSummary = item.summary && item.summary.trim().length > 0;

  return (
    <article className="group border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500 transition-colors shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 leading-snug mb-2 transition-colors"
          >
            {item.title}
          </a>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <SourceBadge
              name={item.source.name}
              bias={item.source.bias}
              url={item.source.url}
            />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(item.pubDate)}
            </span>
          </div>

          {hasSummary && (
            <div>
              <p
                className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${
                  expanded ? "" : "line-clamp-2"
                }`}
              >
                {item.summary}
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 mt-1 transition-colors"
              >
                {expanded ? "折りたたむ / Collapse" : "続きを読む / Read more"}
              </button>
            </div>
          )}
        </div>

        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-gray-400 hover:text-blue-500 transition-colors mt-0.5"
          aria-label="Open article"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}
