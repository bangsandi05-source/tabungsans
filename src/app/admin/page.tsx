import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminActions from "./admin-actions";


function formatRupiah(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as unknown as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/dashboard");

  const pending = await prisma.transaction.findMany({
    where: { status: "PENDING" },
    include: {
      target: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-8">
      <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6">
        Kelola permintaan setoran dan penarikan simulasi.
      </p>

      {pending.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center text-zinc-400">
          Tidak ada permintaan yang menunggu persetujuan.
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((tx) => (
            <div
              key={tx.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">
                    {tx.type === "DEPOSIT" ? "Setoran" : "Penarikan"} —{" "}
                    {tx.target.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {tx.target.user.name} ({tx.target.user.email})
                  </p>
                  <p className="text-xs text-zinc-400">
                    {tx.createdAt.toLocaleDateString("id-ID")}{" "}
                    {tx.createdAt.toLocaleTimeString("id-ID")}
                  </p>
                </div>
                <p
                  className={`text-lg font-bold ${
                    tx.type === "DEPOSIT" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {tx.type === "DEPOSIT" ? "+" : "-"}
                  {formatRupiah(tx.amount)}
                </p>
              </div>
              <AdminActions txId={tx.id} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
