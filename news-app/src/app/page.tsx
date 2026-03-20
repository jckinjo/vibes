import NewsFeed from "@/components/NewsFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm">
        <h1 className="text-lg font-bold">
          📰 News Dashboard
        </h1>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <NewsFeed />
      </main>
    </div>
  );
}
