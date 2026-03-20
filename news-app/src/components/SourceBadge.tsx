"use client";

interface Props {
  name: string;
  bias?: string;
  url: string;
}

const BIAS_COLORS: Record<string, string> = {
  "公共放送": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "公共放送・中立": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "公共放送・獨立": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "中道左派": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "中道右派": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "中立・通信社": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "テック特化": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "テック・科学特化": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "法國公共廣播・獨立": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "美國官方・獨立報道": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "台灣・傾民進黨": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "台灣・傾國民黨": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

export default function SourceBadge({ name, bias, url }: Props) {
  const colorClass = bias
    ? BIAS_COLORS[bias] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${colorClass} hover:opacity-80 transition-opacity`}
      title={bias}
    >
      {name}
      {bias && <span className="opacity-60">· {bias}</span>}
    </a>
  );
}
