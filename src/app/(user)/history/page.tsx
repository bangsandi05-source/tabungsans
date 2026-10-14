import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


function formatRupiah(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

export default async function HistoryPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const transactions = await prisma.transaction.findMany({
    where: { target: { userId } },
    include: { target: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="max-w-2xl mx-auto w-full px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

      {transactions.length === 0 ? (
        <p className="text-zinc-400 text-sm">Belum ada transaksi.</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {tx.type === "DEPOSIT" ? "Setoran" : "Penarikan"} —{" "}
                  {tx.target.name}
                </p>
                <p className="text-xs text-zinc-400">
                  {tx.createdAt.toLocaleDateString("id-ID")} —{" "}
                  <span
                    className={
                      tx.status === "APPROVED"
                        ? "text-emerald-600"
                        : tx.status === "REJECTED"
                        ? "text-red-500"
                        : "text-amber-500"
                    }
                  >
                    {tx.status === "APPROVED"
                      ? "Disetujui"
                      : tx.status === "REJECTED"
                      ? "Ditolak"
                      : "Menunggu"}
                  </span>
                </p>
              </div>
              <p
                className={`font-medium ${
                  tx.type === "DEPOSIT" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {tx.type === "DEPOSIT" ? "+" : "-"}
                {formatRupiah(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
