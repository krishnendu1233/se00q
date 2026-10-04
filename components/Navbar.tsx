import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-cyan-400 text-lg tracking-tight hover:text-cyan-300">
            se00q
          </Link>
          <Link href="/profile" className="text-xs text-gray-400 hover:text-cyan-400 transition-colors">
            Profile
          </Link>
        </div>

        <form method="GET" action="/" className="relative">
          <input
            name="q"
            type="text"
            placeholder="Search Analysis..."
            className="w-48 sm:w-64 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </form>
      </div>
    </header>
  );
}
