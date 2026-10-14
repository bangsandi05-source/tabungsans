import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col max-w-4xl mx-auto w-full px-6 py-10">
      <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        Kelola permintaan setoran dan penarikan.
      </p>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center text-zinc-400">
        Belum ada permintaan yang menunggu persetujuan.
      </div>
    </main>
  );
}
