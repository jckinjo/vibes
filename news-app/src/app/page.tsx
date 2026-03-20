import NewsFeed from "@/components/NewsFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              📰 News Dashboard
            </h1>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 text-right hidden sm:block">
            <p>NHK / 朝日 / 毎日</p>
            <p>BBC / Guardian / HN / The New Stack / InfoQ / The Register</p>
            <p>BBC中文 / RFI / DW中文 / 端傳媒 / 報導者 / 中央社</p>
            <p>연합뉴스 / 한겨레 / 경향신문</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <NewsFeed />
      </main>
    </div>
  );
}
