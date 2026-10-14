import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="flex flex-1 flex-col max-w-2xl mx-auto w-full px-6 py-10">
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        Selamat datang, {session.user?.name}!
      </p>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center text-zinc-400">
        Belum ada target tabungan.
        <br />
        <Link
          href="/targets/new"
          className="inline-block mt-4 rounded-lg bg-zinc-900 text-white px-5 py-2 text-sm font-medium hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
        >
          + Buat Target Baru
        </Link>
      </div>
    </main>
  );
}
