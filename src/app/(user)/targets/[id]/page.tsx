import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TargetActions from "./target-actions";


function formatRupiah(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

export default async function TargetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id!;

  const target = await prisma.target.findUnique({
    where: { id, userId },
    include: {
      transactions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!target) notFound();

  const saldo = target.transactions
    .filter((tx) => tx.status === "APPROVED")
    .reduce((s, tx) => s + (tx.type === "DEPOSIT" ? tx.amount : -tx.amount), 0);

  const persen =
    target.targetAmount != null && target.targetAmount > 0
      ? Math.min(Math.round((saldo / target.targetAmount) * 100), 100)
      : null;

  const now = new Date();
  const canWithdraw = now >= target.withdrawalOpenDate;
  const hasPendingWithdrawal = target.transactions.some(
    (tx) => tx.type === "WITHDRAWAL" && tx.status === "PENDING"
  );

  return (
    <main className="max-w-2xl mx-auto w-full px-6 py-8">
      <h1 className="text-2xl font-bold mb-1">{target.name}</h1>

      {/* Saldo & progres */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 mb-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Saldo simulasi</p>
        <p className="text-3xl font-bold tracking-tight mt-1">{formatRupiah(saldo)}</p>
        {persen != null && (
          <>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 mt-3">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${persen}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {persen}% dari {formatRupiah(target.targetAmount!)} — sisa{" "}
              {formatRupiah(Math.max(target.targetAmount! - saldo, 0))}
            </p>
          </>
        )}
      </div>

      {/* Info tanggal */}
      <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
          <p className="text-zinc-400 text-xs">Target tercapai</p>
          <p className="font-medium">{target.targetDate.toLocaleDateString("id-ID")}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
          <p className="text-zinc-400 text-xs">Boleh tarik mulai</p>
          <p className="font-medium">
            {target.withdrawalOpenDate.toLocaleDateString("id-ID")}
          </p>
        </div>
      </div>

      {/* Tombol aksi */}
      <TargetActions
        targetId={target.id}
        canWithdraw={canWithdraw}
        hasPendingWithdrawal={hasPendingWithdrawal}
        saldo={saldo}
      />

      {/* Riwayat transaksi target ini */}
      <h2 className="text-lg font-semibold mt-8 mb-3">Riwayat Transaksi</h2>
      {target.transactions.length === 0 ? (
        <p className="text-zinc-400 text-sm">Belum ada transaksi.</p>
      ) : (
        <div className="space-y-2">
          {target.transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {tx.type === "DEPOSIT" ? "Setoran" : "Penarikan"}
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
