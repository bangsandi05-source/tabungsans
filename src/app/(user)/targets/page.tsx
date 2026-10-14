import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";


function formatRupiah(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

export default async function TargetsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const targets = await prisma.target.findMany({
    where: { userId },
    include: {
      transactions: { where: { status: "APPROVED" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-2xl mx-auto w-full px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Target Tabungan</h1>
        <Link
          href="/targets/new"
          className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
        >
          + Baru
        </Link>
      </div>

      {targets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center text-zinc-400">
          Belum ada target. Buat target pertamamu!
        </div>
      ) : (
        <div className="space-y-3">
          {targets.map((t) => {
            const saldo = t.transactions.reduce(
              (s, tx) => s + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount),
              0
            );
            const persen =
              t.targetAmount != null && t.targetAmount > 0
                ? Math.min(Math.round((saldo / t.targetAmount) * 100), 100)
                : null;

            return (
              <Link
                key={t.id}
                href={`/targets/${t.id}`}
                className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Target: {t.targetDate.toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatRupiah(saldo)}</p>
                    {t.targetAmount != null && (
                      <p className="text-xs text-zinc-400">
                        / {formatRupiah(t.targetAmount)}
                      </p>
                    )}
                  </div>
                </div>
                {persen != null && (
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 mt-3">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
