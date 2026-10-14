import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold tracking-tight mb-2">TabungSans</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Simulasi tabungan berjangka — rencanakan target keuanganmu dengan
          mudah.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="rounded-full bg-zinc-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
          >
            Daftar
          </Link>
        </div>
      </div>
    </main>
  );
}
